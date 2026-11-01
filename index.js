const http = require('http');
const mineflayer = require('mineflayer');
const config = require('./config.json');

http.createServer((req, res) => {
  res.write("Bot 24/7 Active");
  res.end();
}).listen(process.env.PORT || 3000);

function createBot() {
  console.log('Conectando bot al servidor...');

  const bot = mineflayer.createBot({
    host: config.ip,
    port: config.port,
    username: config.username,
    version: false,
    auth: 'offline',
    checkTimeoutInterval: 60000
  });

  bot.once('spawn', () => {
    console.log('¡ÉXITO: El bot entró al servidor!');

    // Autenticación con retraso seguro
    setTimeout(() => {
      try {
        bot.chat('/register ILOVECULOS ILOVECULOS');
        bot.chat('/login ILOVECULOS');
      } catch (e) {
        console.log('Error enviando comandos:', e.message);
      }
    }, 3000);

    // Anti-AFK compatible con GrimAC y Play Hosting:
    // Alterna agacharse y levantarse (sneak) cada 45 segundos.
    // Esto mantiene el socket de red transmitiendo paquetes 100% válidos.
    setInterval(() => {
      if (bot.entity) {
        bot.setControlState('sneak', true);
        setTimeout(() => {
          bot.setControlState('sneak', false);
        }, 1000);
      }
    }, 45000);
  });

  bot.on('end', (reason) => {
    console.log('Bot desconectado (Razón: ' + reason + '). Reintentando en 15s...');
    setTimeout(createBot, 15000);
  });

  bot.on('error', (err) => console.log('Error de conexión:', err.message || err));
}

createBot();
