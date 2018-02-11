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

//=============================================================================
// MODULOS DO SERVIDOR PRINCIPAL
//=============================================================================
/**
 * @description Se a conexão com o socket for estabelecida
 */
serversIO.serverMainIO.on('connect', (socket) => {
    // Cria a chamada para enviar um email
    socket.on('sendEmail', (content) => {
        if (!content && typeof content != 'string' ||
            typeof content === 'string' && content.length <= 0) {
            return drawMessageServer('Chamada para sendEmail resultou um erro, pois o parametro content não é uma string', 'errorImportant');
        }
        var emailContent = JSON.parse(LZString.decompressFromEncodedURIComponent(content)) || {};
        var email = emailContent.email
            , message = emailContent.message
            , language = emailContent.language;
        sendEmail(email, message, language);
    });
});

//=============================================================================
// MODULOS DO NODEMAILER
//=============================================================================
/**
 * @description Envia um email para o destinatario
 * @param {string} email Email do destinatario
 * @param {string} message Mensagem do documento
 * @param {string} language Idioma do destinatario
 * @author GuilhermeSantos
 * @version 1.0.0
 */
function sendEmail(email, message, language) {

    if (!email || !message || !language) {
        return drawMessageServer(`Não é possivel enviar um email com essas configurações: ${email} ${message} ${language}`, 'error');
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
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'yys6bpxgij7fkht4@ethereal.email',
            pass: 'Ux5AMt7PesuKP7Qp5N'
        }
    });

    if (TS[language]) {
        var subject = TS[language].subject[0];
        var text = TS[language].text[0];
        var html = `${TS[language].html[0]}`;
    } else {
        var subject = "Account created ✔";
        var text = "Thanks for playing";
        var html = `<b>You did the part of beta</b>`;
    }

    html += `<br> ${message}`;

    var contentHTML = `<img src="http://www.cursou.com.br/wp-content/uploads/2017/11/Curso-de-Desenvolvimento-Web.png"/><br>`
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
        from: '"NDZServer 📤" <ndzserver@lzogames.esy.es>',
        to: `"${toName} 📥" <${email}>`,
        subject: subject,
        text: text,
        html: html
    };

    // Envia o email com o objeto de transporte definido
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return drawMessageServer('Não foi possivel enviar o email', 'successError');
        }
        drawMessageServer('Email enviado com sucesso!', 'success');
        drawMessageServer(`Preview URL ${nodemailer.getTestMessageUrl(info)}`, 'alert');
        transport.close();
    });
};