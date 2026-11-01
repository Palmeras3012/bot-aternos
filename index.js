const http = require('http');
const mineflayer = require('mineflayer');
const config = require('./config.json');

// Servidor HTTP obligatorio para mantener vivo el servicio en Render
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot 24/7 Active\n');
}).listen(process.env.PORT || 3000);

function createBot() {
  console.log('Intentando conectar al servidor de Minecraft...');

  const bot = mineflayer.createBot({
    host: config.ip,
    port: config.port,
    username: config.username,
    version: "1.21", // Forzamos la versión exacta para que ViaVersion lo acepte sin romper el socket
    auth: 'offline',
    checkTimeoutInterval: 60000
  });

  bot.once('spawn', () => {
    console.log('¡ÉXITO: El bot se conectó y entró al servidor correctamente!');

    // Esperar a que cargue el mundo antes de loguearse
    setTimeout(() => {
      try {
        bot.chat('/register ILOVECULOS ILOVECULOS');
        bot.chat('/login ILOVECULOS');
        console.log('Comandos de autenticación enviados.');
      } catch (e) {
        console.log('Error al enviar comandos:', e.message);
      }
    }, 4000);
  });

  // Mantener la sesión activa con micro-movimientos de cabeza cada 60 segundos
  bot.on('spawn', () => {
    const afkInterval = setInterval(() => {
      if (bot.entity) {
        const yaw = Math.random() * Math.PI * 2;
        bot.look(yaw, 0, true);
      }
    }, 60000);

    bot.once('end', () => {
      clearInterval(afkInterval);
    });
  });

  bot.on('end', (reason) => {
    console.log('Bot desconectado. Razón: ' + reason + '. Reconectando en 15s...');
    setTimeout(createBot, 15000);
  });

  bot.on('error', (err) => {
    console.log('Error detectado en el socket:', err.message || err);
  });
}

createBot();
