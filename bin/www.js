/**
 * Module dependencies.
 */

var app = require('../app.js');
var debug = require('debug')('myapp:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '9876');
app.set('port', port);

/**
 * Create HTTP and SOCKET.IO server.
 */
const server = require('http').createServer(app);

/**
 * Servidor principal
 */
const serverMainIO = require('socket.io')(server, {
  path: '/main',
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, onReady);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}

function onReady() {
  welcomeMessageServer(true);
  loadServerModules();
};

function loadServerModules() {
  require('./serverRequest');
  require('./SMTPServer');
  require('./mongodb');
};

//=============================================================================
// Server
//=============================================================================
/**
 * @public Exportado pelo module.exports
 * @description Exibe a mensagem de boas vindas ao desenvolvedor
 * @param {boolean} CClear Define se deve limpar o console antes de mostrar a mensagem
 * @author GuilhermeSantos
 * @version 1.0.0
 */
function welcomeMessageServer(CClear) {
  if (CClear) console.clear();
  console.log("/////////////////////////////////////////////////////////////////////////////////");
  console.log("//                                                                             //");
  console.log("//  SERVER: NDZServer v1.0.0                                                   //");
  console.log("//  LICENSE: ISC                                                               //");
  console.log("//  DEVELOPER: GuilhermeSantos                                                 //");
  console.log("//  REPOSITORY: GIT https://lzogamesoficial.visualstudio.com/NoDaysofZombies   //");
  console.log("//                                                                             //");
  console.log("//                              GuilhermeSantos                                //");
  console.log("//             (c) 2017 LZOGames. Todos os direitos reservados.                //");
  console.log("/////////////////////////////////////////////////////////////////////////////////");
  console.log("");
  drawMessageServer('Servidor executando em http://localhost:9876/', "fixed");
};

/**
 * @public Exportado pelo module.exports
 * @description Exibe uma mensagem no console
 * @param {string} message Mensagem a ser exibida no console
 * @param {string} icon Icone da mensagem, define a importancia
 * @icons log, error, fixed, comum, alert, important, errorImportant, success and successError
 * @author GuilhermeSantos
 * @version 1.0.0
 */
function drawMessageServer(message, icon) {
  padZero = function (string, length) {
    var s = string.toString();
    while (s.length < length) {
      s = '0' + s;
    }
    return s;
  };
  var date = new Date();
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  var icons = {
    log: "📣",
    error: "🚫",
    fixed: "📌",
    comum: "📢",
    alert: "🔔",
    important: "⚠",
    errorImportant: "⛔",
    success: "✅",
    successError: "❎"
  }
  console.log(`${icons[icon] || icons["comum"]}  Servidor(${padZero(h, 2)}:${padZero(m, 2)}:${padZero(s, 2)}): ${message}`);
  console.log("");
};

module.exports = {
  welcomeMessageServer: welcomeMessageServer,
  drawMessageServer: drawMessageServer,
  serversIO: {
    serverMainIO: serverMainIO
  }
};