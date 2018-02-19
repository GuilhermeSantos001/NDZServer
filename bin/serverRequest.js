/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa o modulo para exibir mensagens no console
 * @default require('./www').drawMessageServer
 */
const drawMessageServer = require('./www.js').drawMessageServer;

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa o modulo io do socket.io
 * @default require('./www.js').serversIO
 */
var serversIO = require('./www.js').serversIO;

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa o modulo para comprimir strings
 * @default require('./lib/lz-string')
 */
var LZString = require('./lib/lz-string');

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa o modulo para expandir o modulo JSON
 * @default require('./lib/JsonEx')
 */
var JsonEx = require('./lib/JsonEx');

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa o modulo para acessar o banco de dados
 * @default require('./mongodb.js')
 */
const mongodb = require('./mongodb.js');

//================================================================================
// EVENTOS DE CONEXÂO COM O SERVIDOR PRINCIPAL
//================================================================================
serversIO.serverMainIO.on('connect', socket => {
    drawMessageServer('usuario conectado ao servidor principal. socketId: ' + socket.id);
    socket.on('disconnect', reason => {
        drawMessageServer('usuario desconectado do servidor principal. socketId: ' + socket.id);
    });
    socket.on('connect_error', reason => {
        drawMessageServer('erro na conexão com o usuario no servidor principal.');
    });
    socket.on('reconnecting', reason => {
        drawMessageServer('usuario reconectando no servidor principal razão: ' + reason, 'important');
    });
    socket.on('reconnect_attempt', socket => {
        drawMessageServer('usuario reconectado ao servidor principal. socketId: ' + socket.id);
    });
    socket.on('create_account', content => {
        content = JsonEx.parse(LZString.decompressFromEncodedURIComponent(content));
        var language = String(content.language),
            email = String(content.email),
            password = String(content.password),
            username = String(content.username),
            money = Number(content.money),
            level = Number(content.level);
        // Cria a conta de usuario
        mongodb.createAccount(language, email, password, username, 1500, 1);
    });
});