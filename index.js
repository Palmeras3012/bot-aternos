const http = require('http');
const mineflayer = require('mineflayer');
const config = require('./config.json');

// Servidor HTTP falso para mantener el servicio activo en Render
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot 24/7 Active\n');
}).listen(process.env.PORT || 3000);

function createBot() {
  console.log('Conectando bot al servidor Java de Play Hosting...');

  const bot = mineflayer.createBot({
    host: config.ip,
    port: config.port,
    username: config.username,
    version: "1.21", // Forzamos versión compatible con ViaVersion
    auth: 'offline',
    checkTimeoutInterval: 60000
  });

  bot.once('spawn', () => {
    console.log('¡ÉXITO: El bot entró al servidor!');

    // Autenticación segura
    setTimeout(() => {
      try {
        bot.chat('/register ILOVECULOS ILOVECULOS');
        bot.chat('/login ILOVECULOS');
      } catch (e) {
        console.log('Error enviando comandos:', e.message);
      }
    }, 4000);
  });

  // Anti-AFK suave por intervalos de movimiento de cabeza
  bot.once('spawn', () => {
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
    console.log('Bot desconectado (Razón: ' + reason + '). Reconectando en 15s...');
    setTimeout(createBot, 15000);
  });

  bot.on('error', (err) => {
    console.log('Error en el socket:', err.message || err);
  });
}

createBot();
