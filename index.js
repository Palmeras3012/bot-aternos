const http = require('http');
const mineflayer = require('mineflayer');
const config = require('./config.json');

// Servidor web para mantener Render y UptimeRobot vivos
http.createServer((req, res) => {
  res.write("Bot de Aternos activo 24/7");
  res.end();
}).listen(process.env.PORT || 3000);

function createBot() {
  console.log('Iniciando intento de conexión...');
  
  const bot = mineflayer.createBot({
    host: config.ip,
    port: config.port,
    username: config.username,
    version: "1.21.4" // Coincide exactamente con tu servidor PaperMC
  });

  bot.on('spawn', () => {
    console.log('¡El bot ha entrado con éxito al servidor!');
    
    // Auto-login para AuthMe
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
    console.log('Error en la conexión del bot:', err);
  });
}

createBot();
