/**
 * Principais modulos.
 */
var app = require('../app.js');
var debug = require('debug')('myapp:server');
var http = require('http');

/** 
 * Configurações do servidor
*/
var config = require('../configs/server');
const serverConfig = {
  port: Number(config["port"]) || 9876,
  path: String(config["path"]) || "/main",
  name: String(config["name"]) || "NDZServer",
  version: String(config["version"]) || "1.0.0",
  license: String(config["MIT"]) || "MIT",
  author: String(config["author"]) || "GuilhermeSantos",
  repository: String(config["repository"]) || "https://github.com/GuilhermeSantos001/NDZServer"
};

/**
 * Porta do servidor
 */

var port = normalizePort(process.env.PORT || serverConfig.port);
app.set('port', port);

/**
 * Cria o HTTP para o servidor SOCKET.IO.
 */
const server = require('http').createServer(app);

/**
 * Servidor principal
 */
const serverMainIO = require('socket.io')(server, {
  path: serverConfig.path,
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

/**
 * Ouça na porta fornecida, em todas as interfaces de rede.
 */
server.listen(port, onReady);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize uma porta em um número, string ou falso.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

/**
 * Evento "error" do servidor HTTP.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requer privilégios elevados');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' já está em uso');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Evento "listening" do servidor HTTP.
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
 * @version 1.0.1
 */
function welcomeMessageServer(CClear) {
  if (CClear) console.clear();
  console.log("/////////////////////////////////////////////////////////////////////////////////");
  console.log("//                                                                             //");
  console.log(`//  SERVER: NDZServer v1.0.2                                                   //`);
  console.log("//  LICENSE: MIT                                                               //");
  console.log("//  DEVELOPER: GuilhermeSantos                                                 //");
  console.log("//  REPOSITORY: GIT https://github.com/GuilhermeSantos001/NDZServer            //");
  console.log("//                                                                             //");
  console.log("//                              GuilhermeSantos                                //");
  console.log("//             (c) 2018 GuilhermeSantos. Todos os direitos reservados.         //");
  console.log("/////////////////////////////////////////////////////////////////////////////////");
  console.log("");
  drawMessageServer('Servidor executando em http://localhost:'+serverConfig.port+'/', "alert");
};

/**
 * @public Exportado pelo module.exports
 * @description Exibe uma mensagem no console
 * @param {string} message Mensagem a ser exibida no console
 * @param {string} icon Icone da mensagem, define a importancia
 * @icons log, error, fixed, comum, alert, important, errorImportant, success and successError
 * @param {string} author Nome do criador da mensagem
 * @author GuilhermeSantos
 * @version 1.0.1
 * @return {console} Retorna uma mensagem no console
 */
function drawMessageServer(message, icon, author) {
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
  console.log(`${icons[icon] || icons["comum"]}  ${author || 'Servidor'}(${padZero(h, 2)}:${padZero(m, 2)}:${padZero(s, 2)}): ${message}`);
  console.log("");
};

module.exports = {
  welcomeMessageServer: welcomeMessageServer,
  drawMessageServer: drawMessageServer,
  serversIO: {
    serverMainIO: serverMainIO
  }
};