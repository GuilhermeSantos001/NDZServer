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

//================================================================================
// MongoDB
// Banco de dados
//================================================================================
/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa o metodo mongoose
 * @default require('mongoose')
 */
var mongoose = require('mongoose');

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa as configurações do mongoDB
 * @default require('../configs/mongodb')
 */
var configMongoDB = require('../configs/mongodb') || {
    "user": {}
};

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa o modulo para criar o Schema de usuarios
 * @default require('../models/users').Users
 */
var Schema_users = require('../models/users');

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa o modulo para exibir mensagens no console
 * @default require('./www').drawMessageServer
 */
var drawMessageServer = require('./www').drawMessageServer;

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
 * @description Importa o modulo do servidor SMTP
 * @default require('./SMTPServer')
 */
const SMTPServer = require('./SMTPServer');

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
 * @description Define o metodo Promise do mongoose
 * @default mongoose.Promise = global.Promise;
 */
mongoose.Promise = global.Promise;

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Endereço de DNS do mongoDB
 * @default 'mongodb://admin:_master=Admin2017@localhost:30000/ndzserver'
 */
var uri = `mongodb://${configMongoDB.user.name}:${configMongoDB.user.password}@${configMongoDB.address}:${configMongoDB.port}/${configMongoDB.db}`;

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Configuração de conexão com o mongoDB
 */
var options = {
    native_parser: true,
    useMongoClient: true,
    autoIndex: false, // Não crie índices
    reconnectTries: Number.MAX_VALUE, // Nunca pare de tentar se reconectar
    reconnectInterval: 500, // Reconecte-se a cada 500ms
    poolSize: 10, // Mantenha até 10 conexões de soquete, ou seja passou disso, mantenha o restante na fila
    bufferMaxEntries: 0 // Se não estiver conectado, devolva os erros imediatamente ao invés de aguardar a ligação novamente
};

//================================================================================
// MODULOS DE SEGURANÇA
//================================================================================
var crypto = require('crypto'),
    algorithm = 'aes-256-gcm',
    password = '3zTvzr3p67VC61jmV54rIYu1545x4TlY';

/**
 * @description Cria uma string para o vector da criptografia
 * @param {number} length Tamanho da string
 * @author GuilhermeSantos
 * @version 1.0.0
 * @returns {string}
 */
function ivGenerate(length) {
    var randomInt = function (max) {
        return Math.floor(max * Math.random());
    };
    var abc = [
            "a", "b", "c",
            "d", "e", "f",
            "g", "h", "i",
            "j", "k", "l",
            "m", "n", "o",
            "p", "q", "r",
            "s", "t", "u",
            "v", "w", "y",
            "z"
        ],
        nums = [
            1, 2, 3,
            4, 5, 6,
            7, 8, 9,
            0
        ],
        specials = [
            "_", "$", "@",
            "*", "#", "!",
            "-", "="
        ];
    var abc_length = abc.length - 1;
    var nums_length = nums.length - 1;
    var specials_length = specials.length - 1;
    var iv = "";
    while (iv.length < length) {
        let cif = randomInt(3);
        let uppercase = randomInt(2);
        if (cif == 0) {
            if (uppercase)
                iv += abc[randomInt(abc_length)].toUpperCase();
            else
                iv += abc[randomInt(abc_length)].toLowerCase();
        } else if (cif == 1) {
            iv += nums[randomInt(nums_length)];
        } else if (cif == 2) {
            iv += specials[randomInt(specials_length)];
        }
    }
    return iv;
};

/**
 * @description Cria uma criptografia para a string
 * @param {string} string Texto a ser criptografado
 * @author GuilhermeSantos
 * @version 1.0.0
 * @returns {{}}
 */
function encrypt(string) {
    if (!string || string && typeof string != 'string' ||
        string && typeof string === 'string' && string.length <= 0) {
        return drawMessageServer(`A string ${string} não pode ser criptografada`);
    }
    var iv = ivGenerate(64);
    var cipher = crypto.createCipheriv(algorithm, password, iv)
    var encrypted = cipher.update(string, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    var tag = cipher.getAuthTag();
    return {
        content: encrypted,
        tag: tag,
        iv: iv
    };
}

/**
 * @description Cria uma descriptografia para a string
 * @param {{}} encrypted Objeto a ser descriptografado
 * @author GuilhermeSantos
 * @version 1.0.0
 * @returns {string}
 */
function decrypt(encrypted) {
    try {
        var iv = encrypted.iv;
        var decipher = crypto.createDecipheriv(algorithm, password, iv)
        decipher.setAuthTag(encrypted.tag);
        var dec = decipher.update(encrypted.content, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    } catch (error) {
        drawMessageServer(`A descriptografia falhou para ${encrypted.content}`);
        return null;
    }
};

/**
 * @description Cria uma criptografia para a string que converte o Buffer em JSON
 * @param {string} string Texto a ser criptografado
 * @author GuilhermeSantos
 * @version 1.0.0
 * @returns {{}}
 */
function encryptJSON(string) {
    var encryptContent = encrypt(string);
    return {
        content: encryptContent.content,
        tag: JSON.stringify(encryptContent.tag),
        iv: encryptContent.iv
    }
};

/**
 * @description Cria uma descriptografia para a string com o Buffer em JSON
 * @param {{}} encrypted Objeto a ser descriptografado
 * @author GuilhermeSantos
 * @version 1.0.0
 * @returns {string}
 */
function decryptJSON(encrypted) {
    try {
        var iv = encrypted.iv;
        var decipher = crypto.createDecipheriv(algorithm, password, iv)
        decipher.setAuthTag(Buffer.from(JSON.parse(encrypted.tag).data));
        var dec = decipher.update(encrypted.content, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    } catch (error) {
        drawMessageServer(`A descriptografia falhou para ${encrypted.content}`);
        return null;
    }
};

//================================================================================
// EVENTOS DE CONEXÂO COM O MONGODB
//================================================================================
/**
 * @description Se a conexão for estabelecida
 */
mongoose.connection.on('connected', function () {
    drawMessageServer('A conexão com o mongoDB foi estabelecida em: ' + uri, 'fixed');
});

/**
 * @description Se o correr erros com a conexão
 */
mongoose.connection.on('error', function (err) {
    drawMessageServer('A conexão com o mongoDB teve um erro: ' + err, 'error');
});

/**
 * @description Quando a conexão é desconectada
 */
mongoose.connection.on('disconnected', function () {
    drawMessageServer('A conexão com o mongoDB foi fechada');
});

/**
 * @description Quando a conexão está aberta
 */
mongoose.connection.on('open', function () {
    drawMessageServer('A conexão com o mongoDB foi aberta');
});

/**
 * @description Se o aplicativo fechar, feche a conexão
 */
process.on('SIGINT', function () {
    mongoose.connection.close(function (error) {
        if (error) {
            return drawMessageServer(error, 'errorImportant');
        }
        if (mongoose.connection.readyState == 1) {
            drawMessageServer('A conexão com o mongoDB foi fechada, devido ao encerramento do servidor', 'alert');
        }
        process.exit(0);
    });
});

//================================================================================
// MODULOS DO BANCO DE DADOS
//================================================================================
/**
 * @description Cria um novo usuario
 * @param {string} language Language Idioma do usuario
 * @param {string} email Endereço de email da conta
 * @param {string} password Senha da conta
 * @param {string} username Nome de usuario da conta
 * @param {number} money Dinheiro de usuario da conta
 * @param {number} level Nivel de usuario da conta
 * @author GuilhermeSantos
 * @version 1.0.1
 */
function createAccount(language, email, password, username, money, level) {
    mongoose.connect(uri, options, (err) => {
        if (err) {
            drawMessageServer('Não foi possivel conectar com o mongoDB', 'important');
            drawMessageServer(`Erro: ${err}`, 'errorImportant');
            return mongoose.connection.close();
        }
        mongooseConnected();
    });

    function mongooseConnected() {
        var user = new Schema_users({
            language: String(language),
            email: String(email),
            password: LZString.compressToBase64(JsonEx.stringify(encryptJSON(String(password)))),
            username: String(username),
            money: Math.floor(Number(money)),
            level: Math.floor(Number(level))
        });
        user.validate((err) => {
            if (err) {
                drawMessageServer(`Não é possivel criar o novo usuario com o email(${email})`, 'important');
                drawMessageServer(`Erro: ${err}`, 'errorImportant');
                return mongoose.connection.close();
            }
            Schema_users.findOne({
                email: email
            }, (err, account) => {
                if (err) {
                    drawMessageServer(`Não foi possivel verificar se o usuario com o email(${email}) já foi salvo`, 'important');
                    drawMessageServer(`Erro: ${err}`, 'errorImportant');
                    return mongoose.connection.close();
                }
                if (!account) {
                    user.save(function (err) {
                        if (err) {
                            drawMessageServer(`Erro na hora de salvar o novo usuario com o email(${email})`, 'important');
                            drawMessageServer(`Erro: ${err}`, 'errorImportant');
                            return mongoose.connection.close();
                        }
                        drawMessageServer(`Usuario com o email(${email}) salvo no banco de dados`, 'success');
                        SMTPServer.sendEmail(email, language);
                        return mongoose.connection.close();
                    });
                } else {
                    drawMessageServer(`O usuario com o email(${email}) já foi salvo`, 'important');
                    return mongoose.connection.close();
                }
            });
        });
    }
};

//createAccount('pt_br', 'exemple@hotmail.com', '12345678910', 'Gui', 123, 23);

// var compressPassword = LZString.compressToBase64(JsonEx.stringify(encryptJSON('123')));
// var decompressPassword = decryptJSON(JsonEx.parse(LZString.decompressFromBase64(compressPassword)));

//================================================================================
// MODULO PARA EXPORTAR O SCRIPT
//================================================================================
module.exports = {
    createAccount: createAccount
};