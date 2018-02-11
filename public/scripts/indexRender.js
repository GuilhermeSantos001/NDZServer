/** 
 * Armazena a conexão do usuario
 */
var socket = null;

/**
 * Cria uma conexão com o servidor principal
 */
function connectToMainServer() {
    socket = io.connect('http://localhost:9876/', {
        'path': '/main',
        'forceNew': true,
        'reconnection': true,
        'reconnectionDelay': 1000,
        'reconnectionDelayMax': 5000,
        'reconnectionAttempts': 5
    });

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onError);
    socket.on('reconnect_error', onError);
    socket.on('reconnect_attempt', onReconnectAttempt);
    socket.on('reconnect_failed', onReconnectError);

    function onConnect(evt) {
        console.info("Autenticação com o servidor foi um sucesso!");
    };

    function onDisconnect(evt) {
        console.info("Conexão com o servidor foi fechada");
    };

    function onError(message) {
        console.error("Autenticação com o servidor resultou em uma falha");
    };

    function onReconnectAttempt(attemptNumber) {
        console.warn('Tentativa de autenticação com o servidor', 'Tentativa: ' + attemptNumber);
    };

    function onReconnectError() {
        console.error('Tentativa de autenticação com o servidor, foi um fracasso!');
    };
};

/** 
 * Fecha a conexão com o servidor principal
 */
function disconnectToMainServer() {
    if (socket && socket.connected) {
        socket().close();
    }
};