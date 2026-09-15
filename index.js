const http = require('http');
const mineflayer = require('mineflayer');
const config = require('./config.json');

// Servidor web para mantener Render y UptimeRobot vivos
http.createServer((req, res) => {
  res.write("Bot de Aternos activo 24/7");
  res.end();
}).listen(process.env.PORT || 3000);

function createBot() {
  const bot = mineflayer.createBot({
    host: config.ip,
    port: config.port,
    username: config.username,
    version: "1.21" // Fijamos la versión exacta por AuthMe/ViaVersion
  });

  bot.on('spawn', () => {
    console.log('El bot ha entrado al servidor.');
    
    // Auto-login para superar la barrera de AuthMe
    setTimeout(() => {
      bot.chat('/register BotClave123 BotClave123');
      bot.chat('/login BotClave123');
    }, 2000);
  });

  bot.on('end', () => {
    console.log('Bot desconectado. Reintentando en 15 segundos...');
    setTimeout(createBot, 15000);
  });

  bot.on('error', err => {
    console.log('Error del bot:', err);
  });
}

createBot();
