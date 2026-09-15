const http = require('http');
const mineflayer = require('mineflayer');
const config = require('./config.json');

// Servidor web para mantener Render y UptimeRobot vivos 24/7
http.createServer((req, res) => {
  res.write("Bot de Aternos activo 24/7");
  res.end();
}).listen(process.env.PORT || 3000);

function createBot() {
  console.log('Conectando bot a Aternos...');

  const botOptions = {
    host: config.ip,
    username: config.username,
    version: "1.21.4", // Compatible con PaperMC 26.2 / 1.21.4
    hideErrors: false
  };

  // Solo agregar puerto si es un puerto no estándar específico
  if (config.port && config.port !== 25565) {
    botOptions.port = config.port;
  }

  const bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('¡ÉXITO: El bot ha entrado al servidor!');
    
    // Auto-login para superar AuthMe
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
