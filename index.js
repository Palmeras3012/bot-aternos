const http = require('http');
const mineflayer = require('mineflayer');
const config = require('./config.json');

// Servidor web para que Render y UptimeRobot respondan 200 OK
http.createServer((req, res) => {
  res.write("Bot de Aternos activo 24/7");
  res.end();
}).listen(process.env.PORT || 3000);

// Conexión del bot a Minecraft
function createBot() {
  const bot = mineflayer.createBot({
    host: config.ip,
    port: config.port,
    username: config.username,
    version: false
  });

  bot.on('spawn', () => {
    console.log('El bot ha entrado al servidor de Aternos.');
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
