/** 
 * Armazena a conexão do usuario
 */
var socket = null;

/** 
 * Armazena o IP do usuario
 */
var userIp;
getIP();

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
    socket.on('connect_account', onConnectAccount);
    socket.on('account_exist', onAccountExist);
    socket.on('account_noExist', onAccountNoExist);
    socket.on('account_existRequestLogin', onAccountExistRequestLogin);
    socket.on('account_email', onAccountEmail);
    socket.on('noLogin_modal_3', onNoLoginModal3);
    socket.on('noLogin_modal_4', onNoLoginModal4);

    function onConnect(evt) {
        console.info("Autenticação com o servidor foi um sucesso!");
        verifyLogin();
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

    function onConnectAccount(content) {
        if (!content && typeof content != 'string' ||
            typeof content === 'string' && content.length <= 0) {
            return;
        }
        var data = JSON.parse(LZString.decompressFromEncodedURIComponent(content)) || {};
        var username = String(data.username),
            money = Number(data.money),
            accountIP = String(data.accountIP),
            accountEmail = String(data.email);
        $("#accountUserName").text(username);
        $("#accountUserMoney").html(`<i class="material-icons blue-text" style="font-size: 22px;">monetization_on</i> \
        ${money.toString()}`);
        $("#btnConfiguraçõesDePerfil").removeClass("disabled");
        var ls = localStorage;
        ls.setItem('NDZServer', LZString.compressToBase64(JSON.stringify({
            "accountIP": accountIP,
            "accountEmail": accountEmail
        })));
    };

    function onAccountExist() {
        accountExist();
    };

    function onAccountNoExist() {
        accountNoExist();
    };

    function onAccountExistRequestLogin() {
        Materialize.toast('<span>Você já tem uma conta no seu endereço de IP</span>', 5000, 'rounded');
        buttonLoginAccount();
    };

    function onAccountEmail(content) {
        if (!content && typeof content != 'string' ||
            typeof content === 'string' && content.length <= 0) {
            return;
        }
        var data = JSON.parse(LZString.decompressFromEncodedURIComponent(content)) || {};
        var accountEmail = String(data.email);
        setAccountLoginEmail(accountEmail);
    };

    function onNoLoginModal3() {
        setTimeout(() => {
            Materialize.toast('<span>Não foi possível acessar sua conta, a senha está errada!</span>', 5000, 'rounded');
            $("#modal_3").modal('open');
        }, 200);
    };

    function onNoLoginModal4() {
        setTimeout(() => {
            Materialize.toast('<span>Não foi possível acessar sua conta, seu email ou senha estão errados!</span>', 5000, 'rounded');
            $("#modal_4").modal('open');
        }, 200);
    };
};

/** 
 * Fecha a conexão com o servidor principal
 */
function disconnectToMainServer() {
    if (connectToMainServerIsRunning()) {
        socket().close();
    }
};

/** 
 * Verifica se a conexão com o servidor
 */
function connectToMainServerIsRunning() {
    return socket && socket.connected;
};

/**
 * Pega o ip do usuario
 */
function getIP() {
    var findIP = new Promise(r => {
        var w = window,
            a = new(w.RTCPeerConnection || w.mozRTCPeerConnection || w.webkitRTCPeerConnection)({
                iceServers: []
            }),
            b = () => {};
        a.createDataChannel("");
        a.createOffer(c => a.setLocalDescription(c, b, b), b);
        a.onicecandidate = c => {
            try {
                c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r)
            } catch (e) {}
        }
    })

    findIP.then(ip => scriptStart(ip)).catch(e => console.error(e));
};

/**
 * Gera um codigo para a conta do usuario
 * @param {number} length Tamanho do codigo
 */
function getAccountCode(length) {
    var letters = [
        'a', 'b', 'c',
        'd', 'e', 'f',
        'g', 'h', 'i',
        'j', 'k', 'l',
        'm', 'n', 'o',
        'p', 'q', 'r',
        's', 't', 'u',
        'v', 'w', 'y',
        'z'
    ]
    var numbers = [
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9
    ]
    var sequence = '';
    var sequence_break = 3;
    var break_count = 0;
    var sequence_choose = [
        'letters',
        'numbers'
    ]
    while (length > 0) {
        if (break_count >= sequence_break) {
            break_count = 0;
            sequence += '-';
        }
        var choose = Math.floor(Math.random() * sequence_choose.length);
        if (sequence_choose[choose] == 'letters') {
            sequence += letters[Math.floor(Math.random() * letters.length)];
            break_count++;
        } else if (sequence_choose[choose] == 'numbers') {
            sequence += numbers[Math.floor(Math.random() * numbers.length)];
            break_count++;
        }
        length--;
    }
    return sequence;
};

/**
 * Verifica se o usuario estava logado
 */
function verifyLogin() {
    var ls = localStorage;
    var data = null;
    if (ls.getItem('NDZServer')) {
        data = JSON.parse(LZString.decompressFromBase64(ls.getItem('NDZServer')))
    }
    if (data) {
        var accountIP = String(data.accountIP);
        var accountData = LZString.compressToEncodedURIComponent(JSON.stringify({
            accountIP: accountIP
        }));
        socket.emit('existAccount', accountData);
    } else {
        return $('#modal_1').modal('open');
    }
};

/** 
 * Confirmar cadastro para a conta
 */
function accountExist() {
    var ls = localStorage;
    var data = null;
    if (ls.getItem('NDZServer')) {
        data = JSON.parse(LZString.decompressFromBase64(ls.getItem('NDZServer')))
    }
    if (data) {
        var accountIP = String(data.accountIP);
        var accountEmail = String(data.accountEmail);
        if (accountIP == userIp) {
            $('#modal_3').modal('open');
            $('#icon_prefix_5').val(accountEmail);
        }
    }
};

/**
 * Remove o registro do cadastro da conta
 */
function accountNoExist() {
    var ls = localStorage;
    var data = null;
    if (ls.getItem('NDZServer')) {
        data = JSON.parse(LZString.decompressFromBase64(ls.getItem('NDZServer')))
    }
    if (data) {
        ls.removeItem('NDZServer');
    }
    verifyLogin();
};

/**
 * Inicia o script
 */
function scriptStart(ip) {
    userIp = ip;
    connectToMainServer();
};

/**
 * Configura a estrutura de modals
 */
$(document).ready(function () {
    $('.modal').modal({
        dismissible: false, // Modal pode ser descartado clicando fora do modal
        opacity: .5, // Opacidade do fundo modal
        inDuration: 300, // Fade In
        outDuration: 200, // Fade Out
        startingTop: '5%', // Inicio do modal, atributo top
        endingTop: '10%', // Fim do modal, atributo top
        ready: function (modal, trigger) { // Callback para o Modal aberto. Parâmetros modais e de gatilho disponíveis.
        },
        complete: function () { // Callback para o Modal fechado.
        }
    });
});

/**
 * Botão para criar a conta
 */
function buttonCreateAccount() {
    $('#modal_2').modal('open');
};

/**
 * Evento para o input do nome de usuario
 */
$("#icon_prefix_1").keyup(() => {
    if ($("#icon_prefix_1").val().length >= 2) {
        $("#input_nomeDeUsuario").removeClass("grey-text").addClass("green-text");
    } else {
        $("#input_nomeDeUsuario").removeClass("green-text").addClass("grey-text");
    }
});

/**
 * Evento para o input do email de usuario
 */
$("#icon_prefix_2").keyup(() => {
    emailValidation()
}).focusout(() => {
    emailValidation();
});

function emailValidation() {
    if ($("#icon_prefix_2").hasClass('valid')) {
        $("#input_emailDeUsuario").removeClass("grey-text").addClass("green-text");
    } else {
        $("#input_emailDeUsuario").removeClass("green-text").addClass("grey-text");
    }
};

/**
 * Evento para o input do senha de usuario
 */
$("#icon_prefix_3, #icon_prefix_4").keyup(() => {
    passwordValidation()
}).focusout(() => {
    passwordValidation();
});

function passwordValidation() {
    if ($("#icon_prefix_3").val() == $("#icon_prefix_4").val()) {
        if ($("#icon_prefix_3").val().length > 8 && $("#icon_prefix_4").val().length > 8) {
            $("#icon_prefix_3, #icon_prefix_4").removeClass("invalid").addClass("valid");
            $("#input_passwordDeUsuario, #input_passwordDeUsuario2").removeClass("grey-text").addClass("green-text");
        } else {
            $("#icon_prefix_3, #icon_prefix_4").removeClass("valid invalid");
        }
    } else {
        $("#input_passwordDeUsuario, #input_passwordDeUsuario2").removeClass("green-text").addClass("grey-text");
        if ($("#icon_prefix_3").val().length > 8 && $("#icon_prefix_4").val().length > 8) {
            $("#icon_prefix_3, #icon_prefix_4").removeClass("valid").addClass("invalid");
        } else {
            $("#icon_prefix_3, #icon_prefix_4").removeClass("valid invalid");
        }
    }
};

/**
 * Evento para exibir a senha de usuario
 */
var passwordShow = null;
$("#input_passwordDeUsuarioShow").click(() => {
    if (!passwordShow) {
        passwordShow = true;
        $("#icon_prefix_3, #icon_prefix_4").attr('type', 'text');
        $("#input_passwordDeUsuarioShow").removeClass("grey-text").addClass("green-text").text('visibility_off');
    } else {
        passwordShow = null;
        $("#icon_prefix_3, #icon_prefix_4").attr('type', 'password');
        $("#input_passwordDeUsuarioShow").removeClass("green-text").addClass("grey-text").text('visibility');
    }
});

/** 
 * Botão para cancelar a criação a conta
 */
function buttonCancelCreateAccount() {
    $('#modal_1').modal('open');
};

/**
 * Botão para salvar a criação da conta
 */
$("#icon_prefix_1, #icon_prefix_2, #icon_prefix_3, #icon_prefix_4").keyup(() => {
    var prefix_1 = $("#icon_prefix_1").val().length > 2,
        prefix_2 = $("#icon_prefix_2").hasClass('valid'),
        prefix_3 = $("#icon_prefix_3").hasClass('valid'),
        prefix_4 = $("#icon_prefix_4").hasClass('valid');
    if (prefix_1 && prefix_2 && prefix_3 && prefix_4) {
        $("#btnSalvarAccount").removeClass('disabled');
    } else {
        $("#btnSalvarAccount").addClass('disabled');
    }
});

$("#btnSalvarAccount").click(() => {
    if (connectToMainServerIsRunning()) {
        var prefix_1 = $("#icon_prefix_1").val(),
            prefix_2 = $("#icon_prefix_2").val(),
            prefix_3 = $("#icon_prefix_3").val();
        var accountData = LZString.compressToEncodedURIComponent(JSON.stringify({
            email: prefix_2,
            password: prefix_3,
            username: prefix_1,
            money: 500,
            accountCode: getAccountCode(12),
            accountIP: userIp
        }));
        socket.emit('createAccount', accountData);
    }
});

/**
 * Evento para mostrar a senha na hora de confirmar o cadastro
 */
var passwordShow2 = null;
$("#input_passwordDeUsuarioShow2").click(() => {
    if (!passwordShow2) {
        passwordShow2 = true;
        $("#icon_prefix_6").attr('type', 'text');
        $("#input_passwordDeUsuarioShow2").removeClass("grey-text").addClass("green-text").text('visibility_off');
    } else {
        passwordShow2 = null;
        $("#icon_prefix_6").attr('type', 'password');
        $("#input_passwordDeUsuarioShow2").removeClass("green-text").addClass("grey-text").text('visibility');
    }
});

/**
 * Evento para salvar a senha na hora de confirmar o cadastro
 */
$("#icon_prefix_6").keyup(() => {
    if ($("#icon_prefix_6").val().length > 8) {
        $("#icon_prefix_6").addClass('valid');
        $("#btnConfirmPassword").removeClass('disabled');
        $("#iconConfirmPassword").removeClass('grey-text').addClass('green-text');
    } else {
        $("#icon_prefix_6").removeClass('valid');
        $("#btnConfirmPassword").addClass('disabled');
        $("#iconConfirmPassword").removeClass('green-text').addClass('grey-text');
    }
});

/**
 * Botão para logar na conta
 */
function buttonLoginAccount() {
    $("#modal_4").modal('open');
};

/**
 * Configura os Tooltips
 */
$(document).ready(function () {
    $('.tooltipped').tooltip({
        delay: 100
    });
});

/**
 * Evento para recuperar o email da conta
 */
var requestLoginEmail = null;
$("#getLoginEmail").click(() => {
    var accountData = LZString.compressToEncodedURIComponent(JSON.stringify({
        accountIP: userIp
    }));
    socket.emit('emailAccount', accountData);
});

function setAccountLoginEmail(email) {
    $("#iconLoginEmail").removeClass('grey-text').addClass('green-text');
    $('#icon_prefix_7').val(email).removeClass('validate invalid').addClass('valid').attr('disabled', true);
    $("#getLoginEmail").removeClass('grey-text').addClass('green-text').text('mail');
    requestLoginEmail = true;
};

/**
 * Evento do botão para logar na conta
 */
$("#icon_prefix_7").keyup(() => {
    btnLoginAccountIsValid();
}).focusout(() => {
    btnLoginAccountIsValid();
});

$("#icon_prefix_8").keyup(() => {
    btnLoginAccountIsValid();
}).focusout(() => {
    btnLoginAccountIsValid();
});

function btnLoginAccountIsValid() {
    var email = $("#icon_prefix_7").hasClass('valid'),
        password = $("#icon_prefix_8").val().length > 8;
    if (email && password) {
        $("#btnConfirmPassword2").removeClass('disabled');
    } else {
        $("#btnConfirmPassword2").addClass('disabled');
    }
    if (email) {
        $("#iconLoginEmail").removeClass('grey-text').addClass('green-text');
        $("#icon_prefix_7").addClass('valid');
    } else {
        if (!requestLoginEmail) {
            $("#iconLoginEmail").removeClass('green-text').addClass('grey-text');
            $("#icon_prefix_7").removeClass('valid');
        }
    }
    if (password) {
        $("#iconConfirmPassword2").removeClass('grey-text').addClass('green-text');
        $("#icon_prefix_8").addClass('valid');
    } else {
        $("#iconConfirmPassword2").removeClass('green-text').addClass('grey-text');
        $("#icon_prefix_8").removeClass('valid');
    }
};

/**
 * Evento para mostrar a senha para logar na conta
 */
var passwordShow3 = null;
$("#input_passwordDeUsuarioShow3").click(() => {
    if (!passwordShow3) {
        passwordShow3 = true;
        $("#icon_prefix_8").attr('type', 'text');
        $("#input_passwordDeUsuarioShow3").removeClass("grey-text").addClass("green-text").text('visibility_off');
    } else {
        passwordShow3 = null;
        $("#icon_prefix_8").attr('type', 'password');
        $("#input_passwordDeUsuarioShow3").removeClass("green-text").addClass("grey-text").text('visibility');
    }
});

/**
 * Botão para cancelar o login na conta
 */
$("#btnCancelLoginAccount").click(() => {
    $('#modal_1').modal('open');
});

/**
 * Requisição para logar na conta
 */
function requestLoginAccount(requestIndex, callbackSocket, callbackSocketError) {
    if (connectToMainServerIsRunning()) {
        if (requestIndex == '1') {
            var prefix_1 = $("#icon_prefix_7").val(),
                prefix_2 = $("#icon_prefix_8").val();
        } else if (requestIndex == '2') {
            var prefix_1 = $("#icon_prefix_5").val(),
                prefix_2 = $("#icon_prefix_6").val();
        }
        var accountData = LZString.compressToEncodedURIComponent(JSON.stringify({
            email: prefix_1,
            password: prefix_2,
            callbackSocket: callbackSocket,
            callbackSocketError: callbackSocketError
        }));
        socket.emit('loginAccount', accountData);
    }
};