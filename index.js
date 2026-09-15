const http = require('http');
const mineflayer = require('mineflayer');
const config = require('./config.json');

http.createServer((req, res) => {
  res.write("Bot de Falix activo 24/7");
  res.end();
}).listen(process.env.PORT || 3000);

function createBot() {
  console.log('Conectando bot a Falix...');

  const bot = mineflayer.createBot({
    host: config.ip,
    port: config.port,
    username: config.username,
    version: "1.21.11",
    auth: 'offline',
    hideErrors: false
  });

  bot.on('spawn', () => {
    console.log('¡ÉXITO: El bot ha entrado al servidor!');
    setTimeout(() => {
      bot.chat('/register BotClave123 BotClave123');
      bot.chat('/login BotClave123');
    }, 2500);
  });

  bot.on('end', (reason) => {
    console.log('Bot desconectado (razón: ' + reason + '). Reintentando en 15s...');
    setTimeout(createBot, 15000);
  });

  bot.on('error', (err) => {
    console.log('Error de conexión:', err.message || err);
  });
}

createBot();
