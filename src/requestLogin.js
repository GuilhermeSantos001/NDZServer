/**
 *   <NDZServer it is a program for creating a safe community and innovative>
 *   NDZServer Copyright (C) 2018 GuilhermeSantos001, Inc. <https://github.com/GuilhermeSantos001/NDZServer>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://github.com/GuilhermeSantos001/NDZServer/blob/master/LICENSE>
 *
 *   To enter in contact with the developer <luizgp120@hotmail.com>
 */

/**
 * Importa os modulos
 */
import {
    Language
} from "./language";

import LZString from "./lz-string";

import JsonEx from "./JsonEx";

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
    emailCheckedServer();
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
    if ($("#register_icon_prefix_01").hasClass('checkedEmailServer')) {
        return $("#window_register_text_07").addClass('disabled');
    }
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
    var socket = io.connect('http://ndzservercommunity.ddns.net:9876/', {
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
            var language = Language.language(),
                email = $("#register_icon_prefix_01").val(),
                username = $("#register_icon_prefix_02").val(),
                password = $("#register_icon_prefix_03").val();
            var content = LZString().compressToEncodedURIComponent(JsonEx().stringify({
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
                $('#window_preloader').modal('destroy');
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

function emailCheckedServer() {
    connectToServer(socket => {
        var email = $("#register_icon_prefix_01").val(),
            socketId = String(socket.id);
        var content = LZString().compressToEncodedURIComponent(JsonEx().stringify({
            email: email,
            socketId: socketId
        }));
        socket.emit('emailAlreadyUsed', content);
        socket.on('eventPage_emailChecked', content => {
            content = JsonEx().parse(LZString().decompressFromEncodedURIComponent(content));
            var email = Boolean(content.email),
                socketId = String(content.socketId),
                language = String(content.language);
            if (email && String(socket.id) == socketId) {
                $("#register_icon_prefix_01").addClass('invalid checkedEmailServer');
                $("#icon_page_email_01").addClass('red-text');
                if (language == 'pt_br') {
                    Materialize.toast('Já existe uma conta com este endereço de email!', 3500, 'rounded');
                } else if (language == 'en_us') {
                    Materialize.toast('An account already exists with this email address!', 3500, 'rounded');
                }
            } else {
                if ($("#register_icon_prefix_01").hasClass('checkedEmailServer')) {
                    $("#register_icon_prefix_01").removeClass('invalid checkedEmailServer');
                    $("#icon_page_email_01").removeClass('red-text');
                }
            }
            btnConfirmIsValid();
            socket.disconnect();
        });
    });
};