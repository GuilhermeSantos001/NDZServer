/**
 * Evento da pagina
 */
$(document).ready(() => {
    $('.modal').modal({
        dismissible: false,
        opacity: .5,
        inDuration: 300,
        outDuration: 200,
        startingTop: '4%',
        endingTop: '10%'
    });
    $('#window_login').modal('open');
});

$("#register_icon_prefix_01").focusout(() => {
    btnConfirmIsValid();
});

$("#register_icon_prefix_02, \
    #register_icon_prefix_03, \
    #register_icon_prefix_04").focusout(() => {
    btnConfirmIsValid();
}).keyup(() => {
    btnConfirmIsValid();
});

function btnConfirmIsValid() {
    if ($("#register_icon_prefix_02").val().length >= 2) {
        $("#register_icon_prefix_02").removeClass('invalid').addClass('valid');
    } else if ($("#register_icon_prefix_02").val().length > 0) {
        $("#register_icon_prefix_02").removeClass('valid').addClass('invalid');
    } else {
        $("#register_icon_prefix_02").removeClass('valid invalid');
    }
    if ($("#register_icon_prefix_03, #register_icon_prefix_04").val().length >= 8 &&
        $("#register_icon_prefix_03").val() == $("#register_icon_prefix_04").val()) {
        $("#register_icon_prefix_03, #register_icon_prefix_04").removeClass('invalid').addClass('valid');
    } else if ($("#register_icon_prefix_03, #register_icon_prefix_04").val().length > 0 &&
        $("#register_icon_prefix_03").val() != $("#register_icon_prefix_04").val() ||
        $("#register_icon_prefix_03, #register_icon_prefix_04").val().length > 0 &&
        $("#register_icon_prefix_03").val() == $("#register_icon_prefix_04").val()) {
        $("#register_icon_prefix_03, #register_icon_prefix_04").removeClass('valid').addClass('invalid');
    } else {
        $("#register_icon_prefix_03, #register_icon_prefix_04").removeClass('valid invalid');
    }
    var email = $("#register_icon_prefix_01").hasClass('valid'),
        username = $("#register_icon_prefix_02").hasClass('valid'),
        password = $("#register_icon_prefix_03").hasClass('valid'),
        password_confirm = $("#register_icon_prefix_04").hasClass('valid');
    if (email && username && password && password_confirm) {
        $("#window_register_text_07").removeClass('disabled');
    } else {
        $("#window_register_text_07").addClass('disabled');
    }
};

$("#register_icon_password_visibility").click(() => {
    if ($("#register_icon_password_visibility").hasClass("grey-text")) {
        $("#register_icon_password_visibility").fadeOut('fast').removeClass("grey-text")
            .addClass("green-text").text('visibility_off').fadeIn('fast');
        $("#register_icon_prefix_03, #register_icon_prefix_04").fadeOut('fast')
            .attr('type', 'text').fadeIn('fast');
    } else if ($("#register_icon_password_visibility").hasClass("green-text")) {
        $("#register_icon_password_visibility").fadeOut('fast').removeClass("green-text")
            .addClass("grey-text").text('visibility').fadeIn('fast');
        $("#register_icon_prefix_03, #register_icon_prefix_04").fadeOut('fast')
            .attr('type', 'password').fadeIn('fast');
    }
});

/**
 * Conexão com o servidor
 */
function connectToServer(callback) {
    var socket = io.connect('http://localhost:9876/', {
        'path': '/main',
        'forceNew': true,
        'reconnection': false,
    });
    socket.on('connect', () => {
        callback(socket);
    });
};

/**
 * Botões da pagina
 */
$("#window_login_text_04").click(() => {
    setTimeout(() => {
        $('#window_register').modal('open');
    }, 350);
});

$("#window_register_text_06").click(() => {
    setTimeout(() => {
        $('#window_login').modal('open');
    }, 350);
});

$("#window_register_text_07").click(() => {
    setTimeout(() => {
        $('#window_preloader').modal('open');
        connectToServer(socket => {
            var language = 'en_us',
                email = $("#register_icon_prefix_01").val(),
                username = $("#register_icon_prefix_02").val(),
                password = $("#register_icon_prefix_03").val();
            var content = LZString.compressToEncodedURIComponent(JsonEx.stringify({
                language: language,
                email: email,
                password: password,
                username: username,
                money: 1500,
                level: 1
            }));
            socket.emit('create_account', content);
            socket.disconnect();
            $("#window_accountCreated_text_email").text(email);
            setTimeout(() => {
                $('#window_preloader').modal('close');
                setTimeout(() => {
                    $('#window_accountCreated').modal('open');
                }, 350)
            }, 1000);
        });
    }, 350);
});

$("#window_accountCreated_button_01").click(() => {
    setTimeout(() => {
        $('#window_login').modal('open');
    }, 350);
});