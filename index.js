const http = require('http');
const mineflayer = /^4/.test(require('mineflayer/package.json').version) ? require('mineflayer') : require('mineflayer');
const config = require('./config.json');

http.createServer((req, res) => {
  res.write("Bot 24/7 Active");
  res.end();
}).listen(process.env.PORT || 3000);

function createBot() {
  console.log('Iniciando conexión segura con el servidor...');

  const bot = mineflayer.createBot({
    host: config.ip,
    port: config.port,
    username: config.username,
    version: false,
    auth: 'offline',
    // Desactivamos por completo el flujo de paquetes automáticos en el arranque
    defaultChatHandlers: false,
    skipValidation: true
  });

  // Interceptar los datos de conexión para evitar que mande paquetes inválidos al spawnear
  bot._client.on('packet', (data, metadata) => {
    // Si el servidor pide confirmación de posición (Position Look), respondemos de inmediato con la misma
    if (metadata.name === 'position' || metadata.name === 'player_position_and_look') {
      bot._client.write('teleport_confirm', { teleportId: data.teleportId });
    }
  });

  bot.once('spawn', () => {
    console.log('¡ÉXITO ABSOLUTO: El bot se plantó en el servidor sin errores de paquetes!');

    // Login tras asegurar la estabilidad de la conexión
    setTimeout(() => {
      try {
        bot.chat('/register ILOVECULOS ILOVECULOS');
        bot.chat('/login ILOVECULOS');
      } catch (e) {
        console.log('Error en comandos:', e.message);
      }
    }, 4000);
  });

  bot.on('end', (reason) => {
    console.log('Desconectado. Razón: ' + reason + '. Reconectando en 15s...');
    setTimeout(createBot, 15000);
  });

  bot.on('error', (err) => {
    console.log('Error crítico en socket:', err.message || err);
  });
}

createBot();
