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
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa o modulo File System do Node.JS
 * @default require('fs')
 */
var fs = require('fs');

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa os textos do sistema
 * @default JSON.parse(fs.readFileSync('./TS/SMTPServer.json')) || {}
 */
var TS = JSON.parse(fs.readFileSync('./TS/SMTPServer.json')) || {};

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
 * @description Importa o modulo io do socket.io
 * @default require('./www.js').serversIO
 */
var serversIO = require('./www.js').serversIO;

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa o modulo nodemailer para enviar emails
 * @default require('nodemailer')
 */
const nodemailer = require('nodemailer');

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
 * @description Importa o modulo para as configurações do SMTP
 * @default require('../configs/SMTP')
 */
const SMTPConfig = require('../configs/SMTP');

//=============================================================================
// MODULOS DO NODEMAILER
//=============================================================================
/**
 * @description Envia um email para o destinatario
 * @param {string} email Email do destinatario
 * @param {string} language Idioma do destinatario
 * @author GuilhermeSantos
 * @version 1.0.0
 */
function sendEmail(email, language) {
    if (!email || !language) {
        return drawMessageServer(`Não é possivel enviar um email com essas configurações: ${email} ${language}`, 'error');
    };

    // Cria um objeto transportador reutilizável usando o transporte SMTP padrão
    // const transporter = nodemailer.createTransport({
    //     host: 'in-v3.mailjet.com',
    //     port: 465,
    //     secure: true,
    //     auth: {
    //         user: 'ca5156712f96e55a60b212088f2c6818',
    //         pass: 'd2eddf7fa51937a801f5a9cc7bbe780e'
    //     }
    // });

    // Transporte para teste
    const transporter = nodemailer.createTransport({
        host: String(SMTPConfig.host), // Endereço do host
        secure: Boolean(SMTPConfig.secure), // Usar certificado SSL
        port: Number(SMTPConfig.port), // Porta do host
        auth: {
            user: String(SMTPConfig.user),
            pass: String(SMTPConfig.pass)
        },
        tls: {
            rejectUnauthorized: false // Para não falhar em certificados inválidos
        }
    });

    if (TS[language]) {
        var subject = TS[language].subject[0];
        var text = TS[language].text[0];
        var html = `${TS[language].html[0]}`;
    } else {
        var subject = "Account created ✔";
        var text = "Thank you for register";
        var html = `<b>You were part of the beta</b>`;
    }

    var contentHTML = `<img src="https://i.imgur.com/Ln4vpgb.png"><br>`
    html = (contentHTML += html);
    var toName = (function (string) {
        var i = 0;
        var length = string.length;
        var newString = '';
        for (; i < length; i++) {
            let letter = string[i];
            if (letter === "@") {
                break;
            } else {
                newString += letter;
            }
        }
        return newString;
    })(email);

    // Configurar dados de e-mail com símbolos unicode
    let mailOptions = {
        from: `"${SMTPConfig.emailFromName} 📤" <${SMTPConfig.emailFrom}>`,
        to: `"${toName} 📥" <${email}>`,
        subject: subject,
        text: text,
        html: html
    };

    // Envia o email com o objeto de transporte definido
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            drawMessageServer('Não foi possivel enviar o email', 'successError');
            drawMessageServer(`Error: ${error}`, 'error');
            drawMessageServer(`Info: ${info}`, 'log');
            return transporter.close();
        }
        drawMessageServer('Email enviado com sucesso!', 'success');
        drawMessageServer(`Preview URL ${nodemailer.getTestMessageUrl(info)}`, 'alert');
        transporter.close();
    });
};

//================================================================================
// MODULO PARA EXPORTAR O SCRIPT
//================================================================================
module.exports = {
    sendEmail: sendEmail
};