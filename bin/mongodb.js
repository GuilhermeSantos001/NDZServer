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
var Schema_users = require('../models/users').Users;

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa o modulo para criar o Schema de topicos
 * @default require('../models/topics').Topics
 */
var Schema_topics = require('../models/topics').Topics;

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

//=============================================================================
// EVENTO DE CONEXÂO DO SERVIDOR PRINCIPAL
//=============================================================================
/**
 * @description Se o socket estabelecer uma conexão
 */
serversIO.serverMainIO.on('connect', (socket) => {
    // Faz uma requisição para a criação de conta
    socket.on('createAccount', (content) => {
        if (!content && typeof content != 'string' ||
            typeof content === 'string' && content.length <= 0) {
            return drawMessageServer('Chamada para requestLogin resultou um erro, pois o parametro content não é uma string', 'errorImportant');
        }
        var contentData = JSON.parse(LZString.decompressFromEncodedURIComponent(content)) || {};
        var email = String(contentData.email),
            password = String(contentData.password),
            username = String(contentData.username),
            money = Number(contentData.money),
            accountCode = String(contentData.accountCode),
            accountIP = String(contentData.accountIP);
        createAccount(email, password, username, money, accountCode, accountIP);
    });
    // Faz uma requisição para a verificação da conta
    socket.on('existAccount', (content) => {
        if (!content && typeof content != 'string' ||
            typeof content === 'string' && content.length <= 0) {
            return drawMessageServer('Chamada para requestLogin resultou um erro, pois o parametro content não é uma string', 'errorImportant');
        }
        var contentData = JSON.parse(LZString.decompressFromEncodedURIComponent(content)) || {};
        var accountIP = String(contentData.accountIP);
        existAccount(accountIP);
    });
    // Faz uma requisição para recuperar o email da conta
    socket.on('emailAccount', (content) => {
        if (!content && typeof content != 'string' ||
            typeof content === 'string' && content.length <= 0) {
            return drawMessageServer('Chamada para requestLogin resultou um erro, pois o parametro content não é uma string', 'errorImportant');
        }
        var contentData = JSON.parse(LZString.decompressFromEncodedURIComponent(content)) || {};
        var accountIP = String(contentData.accountIP);
        emailAccount(accountIP);
    });
    // Faz uma requisição para logar na conta
    socket.on('loginAccount', (content) => {
        if (!content && typeof content != 'string' ||
            typeof content === 'string' && content.length <= 0) {
            return drawMessageServer('Chamada para requestLogin resultou um erro, pois o parametro content não é uma string', 'errorImportant');
        }
        var contentData = JSON.parse(LZString.decompressFromEncodedURIComponent(content)) || {};
        var accountEmail = String(contentData.email),
            accountPassword = String(contentData.password),
            callbackSocket = String(contentData.callbackSocket),
            callbackSocketError = String(contentData.callbackSocketError);
        loginAccount(accountEmail, accountPassword, callbackSocket, callbackSocketError);
    });
    // Faz uma requisição para logar na conta(registro salvo)
    socket.on('loginRememberAccount', (content) => {
        if (!content && typeof content != 'string' ||
            typeof content === 'string' && content.length <= 0) {
            return drawMessageServer('Chamada para requestLogin resultou um erro, pois o parametro content não é uma string', 'errorImportant');
        }
        var contentData = JSON.parse(LZString.decompressFromEncodedURIComponent(content)) || {};
        var accountIP = String(contentData.accountIP);
        loginRegisterSaveAccount(accountIP);
    });
});

//================================================================================
// MODULOS DO BANCO DE DADOS
//================================================================================
/**
 * @public Exportado pelo module.exports
 * @description Cria uma conta de usuario
 * @param {string} email Endereço de email
 * @param {string} password Senha de usuario
 * @param {string} username Nome de usuario
 * @param {string} money Dinheiro do usuario
 * @param {string} accountCode Codigo de ativação da conta
 * @param {string} accountIP IP do usuario
 * @author GuilhermeSantos
 * @version 1.0.0
 */
function createAccount(email, password, username, money, accountCode, accountIP) {
    mongoose.connect(uri, options, (error, db) => {
        if (error) {
            return drawMessageServer('A tentativa de se conectar ao mongoDB falhou! ' + error, 'errorImportant');
        }
        if (typeof money == 'number') {
            var moneyCheck = true;
        } else {
            var moneyCheck = false;
        }
        if (!email || !password || !username || !moneyCheck || !accountCode || !accountIP) {
            drawMessageServer(`Não é possivel criar uma conta com essas configurações: ${email} ${password} ${username} ${money} ${accountCode} ${accountIP}`, 'error');
            return mongoose.connection.close();
        };

        // Cria o novo usuario
        var user = new Schema_users({
            email: email,
            password: LZString.compressToBase64(JSON.stringify(encryptJSON(password))),
            username: username,
            money: money,
            accountCode: accountCode,
            accountIP: accountIP
        });

        // Faz uma verificação para ver se a conta já existe 
        Schema_users.count({
            accountIP: accountIP
        }, function (err, count) {
            if (err) {
                return drawMessageServer('Não foi possivel verificar se existe a conta no banco de dados, erro: ' + err, 'error');
            }
            if (count > 0) {
                drawMessageServer(`A conta no ip(${accountIP}) já existe!`, 'important');
                serversIO.serverMainIO.emit('account_existRequestLogin');
                return mongoose.connection.close();
            }
            saveAccount();
        });

        // Conclusão para adicionar a conta
        function saveAccount() {
            // Faz uma validação de dados antes de criar a conta
            user.validate(function (err) {
                if (err) {
                    drawMessageServer(err.message || err, 'alert');
                    mongoose.connection.close();
                } else {
                    // Salva o usuario no banco de dados
                    user.save(function (err) {
                        if (err) {
                            return drawMessageServer('Não foi possivel salvar o usuario no banco de dados, erro: ' + err, 'important');
                        }
                        drawMessageServer(`Usuario ${email} salvo no banco de dados`, 'success');
                        serversIO.serverMainIO.emit('connect_account', LZString.compressToEncodedURIComponent(JSON.stringify({
                            email: email,
                            username: username,
                            money: money,
                            accountIP: accountIP
                        })));
                        mongoose.connection.close();
                    });
                }
            });
        }
    });
};

/**
 * @public Exportado pelo module.exports
 * @description Verifica se a conta existe no IP
 * @param {string} accountIP Endereço de ip
 * @author GuilhermeSantos
 * @version 1.0.0
 */
function existAccount(accountIP) {
    mongoose.connect(uri, options, (error, db) => {
        if (error) {
            return drawMessageServer('A tentativa de se conectar ao mongoDB falhou! ' + error, 'errorImportant');
        }
        if (!accountIP) {
            drawMessageServer(`Não é possivel fazer uma verificação para a conta com essas configurações: ${accountIP}`, 'error');
            return mongoose.connection.close();
        };
        // Faz uma verificação para ver se a conta já existe 
        Schema_users.count({
            accountIP: accountIP
        }, function (err, count) {
            if (err) {
                return drawMessageServer('Não foi possivel verificar se existe a conta no banco de dados, erro: ' + err, 'error');
            }
            if (count > 0) {
                serversIO.serverMainIO.emit('account_exist');
                drawMessageServer(`A conta no ip(${accountIP}) existe!`, 'success');
            } else {
                serversIO.serverMainIO.emit('account_noExist');
                drawMessageServer(`A conta no ip(${accountIP}) não existe!`, 'successError');
            }
            return mongoose.connection.close();
        });
    });
};

/**
 * @public Exportado pelo module.exports
 * @description Recupera o email da conta
 * @param {string} accountIP Endereço de ip
 * @author GuilhermeSantos
 * @version 1.0.0
 */
function emailAccount(accountIP) {
    mongoose.connect(uri, options, (error, db) => {
        if (error) {
            return drawMessageServer('A tentativa de se conectar ao mongoDB falhou! ' + error, 'errorImportant');
        }
        if (!accountIP) {
            drawMessageServer(`Não é possivel fazer uma verificação para a conta com essas configurações: ${accountIP}`, 'error');
            return mongoose.connection.close();
        };
        // Faz uma verificação para ver se a conta já existe 
        Schema_users.count({
            accountIP: accountIP
        }, function (err, count) {
            if (err) {
                return drawMessageServer('Não foi possivel verificar se existe a conta no banco de dados, erro: ' + err, 'error');
            }
            if (count > 0) {
                Schema_users.findOne({
                    accountIP: accountIP
                }, function (err, user) {
                    if (err) {
                        return drawMessageServer(`Não foi possivel recuperar o email da conta(ip:${accountIP}, erro: ` + error, 'errorImportant');
                    }
                    var email = user.email;
                    serversIO.serverMainIO.emit('account_email', LZString.compressToEncodedURIComponent(JSON.stringify({
                        email: email
                    })));
                    drawMessageServer(`O email da conta no ip(${accountIP}) é ${email}`, 'success');
                    mongoose.connection.close();
                });
            } else {
                drawMessageServer(`A conta no ip(${accountIP}) não existe!`, 'successError');
                return mongoose.connection.close();
            }
        });
    });
};

/**
 * @public Exportado pelo module.exports
 * @description Faz uma requisição de login para a conta
 * @param {string} email Endereço de email da conta
 * @param {string} password Senha da conta
 * @param {string} callbackSocket Chamada de retorno para o socket
 * @param {string} callbackSocketError Chamada de retorno de erro para o socket
 * @author GuilhermeSantos
 * @version 1.0.0
 */
function loginAccount(email, password, callbackSocket, callbackSocketError) {
    mongoose.connect(uri, options, (error, db) => {
        if (error) {
            return drawMessageServer('A tentativa de se conectar ao mongoDB falhou! ' + error, 'errorImportant');
        }
        if (!email || !password || !callbackSocket || !callbackSocketError) {
            drawMessageServer(`Não é possivel fazer uma verificação para a conta com essas configurações: ${email} ${password} ${callbackSocket} ${callbackSocketError}`, 'error');
            return mongoose.connection.close();
        };
        // Faz uma verificação para ver se a conta já existe 
        Schema_users.count({
            email: email
        }, function (err, count) {
            if (err) {
                return drawMessageServer('Não foi possivel verificar se existe a conta no banco de dados, erro: ' + err, 'error');
            }
            if (count > 0) {
                Schema_users.findOne({
                    email: email
                }, function (err, user) {
                    if (err) {
                        return drawMessageServer(`Não foi possivel recuperar o email da conta(ip:${accountIP}, erro: ` + error, 'errorImportant');
                    }
                    var userPassword = decryptJSON(JSON.parse(LZString.decompressFromBase64(user.password)));
                    if (password == userPassword) {
                        if (callbackSocket) serversIO.serverMainIO.emit(callbackSocket, LZString.compressToEncodedURIComponent(JSON.stringify({
                            email: user.email,
                            username: user.username,
                            money: user.money,
                            accountIP: user.accountIP
                        })));
                        drawMessageServer(`O login para a conta no email(${email}) foi requisitado!`, 'success');
                    } else {
                        if (callbackSocketError) serversIO.serverMainIO.emit(callbackSocketError);
                        drawMessageServer(`A senha para a conta no email(${email}) está errada!`, 'successError');
                    }
                    mongoose.connection.close();
                });
            } else {
                drawMessageServer(`A conta no email(${email}) não existe!`, 'successError');
                return mongoose.connection.close();
            }
        });
    });
};

/**
 * @public Exportado pelo module.exports
 * @description Faz uma requisição de login para a conta(registro salvo)
 * @param {string} callbackSocketError Chamada de retorno de erro para o socket
 * @author GuilhermeSantos
 * @version 1.0.0
 */
function loginRegisterSaveAccount(accountIP) {
    mongoose.connect(uri, options, (error, db) => {
        if (error) {
            return drawMessageServer('A tentativa de se conectar ao mongoDB falhou! ' + error, 'errorImportant');
        }
        if (!accountIP) {
            drawMessageServer(`Não é possivel fazer uma verificação para a conta com essas configurações: ${accountIP}`, 'error');
            return mongoose.connection.close();
        };
        // Faz uma verificação para ver se a conta já existe 
        Schema_users.count({
            accountIP: accountIP
        }, function (err, count) {
            if (err) {
                return drawMessageServer('Não foi possivel verificar se existe a conta no banco de dados, erro: ' + err, 'error');
            }
            if (count > 0) {
                Schema_users.findOne({
                    accountIP: accountIP
                }, function (err, user) {
                    if (err) {
                        return drawMessageServer(`Não foi possivel recuperar a conta(ip:${accountIP}, erro: ` + error, 'errorImportant');
                    }
                    serversIO.serverMainIO.emit('connect_account', LZString.compressToEncodedURIComponent(JSON.stringify({
                        email: user.email,
                        username: user.username,
                        money: user.money,
                        accountIP: user.accountIP
                    })));
                    drawMessageServer(`O login para a conta no ip(${accountIP}) foi requisitado!`, 'success');
                    mongoose.connection.close();
                });
            } else {
                drawMessageServer(`A conta no ip(${accountIP}) não existe!`, 'successError');
                return mongoose.connection.close();
            }
        });
    });
};

/**
 * @public Exportado pelo module.exports
 * @description Remove a conta de usuario
 * @param {string} email Email do usuario a ser removido
 * @author GuilhermeSantos
 * @version 1.0.0
 */
function removeAccount(email) {
    mongoose.connect(uri, options, (error, db) => {
        if (error) {
            return drawMessageServer('A tentativa de se conectar ao mongoDB falhou! ' + error, 'errorImportant');
        }

        if (!email || typeof email != 'string') {
            drawMessageServer(`Não é possivel remover uma conta com essas configurações: ${email}`, 'error');
            return mongoose.connection.close();
        }

        // Cria uma busca pelo documento com a  propriedade 'email' e quando encontra o primeiro ele 
        // remove o documento
        Schema_users.findOneAndRemove({
            email: email
        }, function (err, user) {
            if (err) {
                return drawMessageServer('Não foi possivel remover o usuario no banco de dados, erro: ' + err, 'important');
            }

            // Se o usuario existir
            if (user) {
                drawMessageServer(`Usuario ${email} removido do banco de dados`, 'success');
            }
            mongoose.connection.close();
        });
    });
};

/**
 * @public Exportado pelo module.exports
 * @description Atualiza a conta do usuario
 * @param {string} email Email do usuario
 * @param {{}} set Propriedades a serem atualizadas ou adicionadas
 * @param {{}} unset Propriedades a serem removidas
 * @author GuilhermeSantos
 * @version 1.0.0
 */
function updateAccount(email, set, unset) {
    mongoose.connect(uri, options, (error, db) => {
        if (error) {
            return drawMessageServer('A tentativa de se conectar ao mongoDB falhou! ' + error, 'errorImportant');
        }

        if (!email || typeof email != 'string' || set && typeof set != 'object' || unset && typeof unset != 'object') {
            drawMessageServer(`Não é possivel remover uma conta com essas configurações: ${email} ${set} ${unset}`, 'error');
            return mongoose.connection.close();
        }

        // Atualiza os dados
        function updateProps(callback) {
            if (!set) {
                if (unset) {
                    return callback();
                }
                return mongoose.connection.close();
            }

            Schema_users.findOneAndUpdate({
                email: email
            }, {
                $set: Object.assign({}, set)
            }, function (err, user) {
                if (error) {
                    return drawMessageServer('Não foi possivel atualizar o usuario no banco de dados, erro: ' + error, 'important');
                }

                // Se o usuario existir
                if (user) {
                    drawMessageServer(`Dados(${Object.keys(set).length}) do usuario ${email} foram atualizado no banco de dados`, 'success');
                }

                if (unset) {
                    return callback();
                }
                mongoose.connection.close();
            });
        };

        // Remove os dados
        function removeProps() {
            if (!unset) {
                return mongoose.connection.close();
            }

            Schema_users.findOneAndUpdate({
                email: email
            }, {
                $unset: Object.assign({}, unset)
            }, function (err, user) {
                if (error) {
                    return drawMessageServer('Não foi possivel atualizar o usuario no banco de dados, erro: ' + error, 'important');
                }

                // Se o usuario existir
                if (user) {
                    drawMessageServer(`Dados(${Object.keys(unset).length}) do usuario ${email} foram removidos do banco de dados`, 'success');
                }
                mongoose.connection.close();
            });
        };

        // Chama a função passando uma callback
        updateProps(removeProps);
    });
};

//================================================================================
// MODULOS DA PAGINA DO JOGADOR
//================================================================================
/**
 * @public Exportado pelo module.exports
 * @description Conecta
 * @param {string} email Email do usuario
 * @author GuilhermeSantos
 * @version 1.0.0
 */
function playerPage_loginAccount(email, password) {
    mongoose.connect(uri, options, (error, db) => {
        if (error) {
            return drawMessageServer('A tentativa de se conectar ao mongoDB falhou! ' + error, 'errorImportant');
        }

        if (!email || typeof email != 'string') {
            drawMessageServer(`Não é possivel logar na conta com essas configurações: ${email} ${password}`, 'error');
            return mongoose.connection.close();
        }

        Schema_users.findOne({
            email: email
        }, function (err, user) {
            if (error) {
                return drawMessageServer('Não foi possivel encontrar o usuario no banco de dados, erro: ' + error, 'important');
            }

            // Se o usuario existir
            if (user) {
                var userPassword = decryptJSON(JSON.parse(LZString.decompressFromBase64(user.password)));
                if (password === userPassword) {
                    var content = {};
                    content.email = user.email;
                    content.password = userPassword;
                    content.username = user.username;
                    content.familyName = user.familyName;
                    content.lifestyle = user.lifestyle;
                    content.money = user.money;
                    content.fameFamily = user.fameFamily;
                    content.spawnCity = user.spawnCity;
                    content.level = user.level;
                    content.lastLogin = user.lastLogin;
                    serversIO.serverMainIO.emit('playerPage_LoginSuccess', LZString.compressToEncodedURIComponent(JSON.stringify(content)));
                }
            }
            mongoose.connection.close();
        });
    });
};

// createAccount('luizgp120@hotmail.com', '123', 'GuilhermeSantos', 'Mordog', 'Noobie', '678-124-368-972');
// removeAccount('luizgp120@hotmail.com');
// updateAccount('luizgp120@hotmail.com', {}, { newProperty: '' });
// loginAccount('luizgp120@hotmail.com', '123');

// mongoose.connect(uri, options, (error, db) => {
//     if (error) {
//         return drawMessageServer('A tentativa de se conectar ao mongoDB falhou! ' + error, 'errorImportant');
//     }

//     // Schema_users.create({ name: 'Cintia', idade: 18 }, function (err, small) {
//     //     if (err) throw err;
//     // });

//     // users.remove({ name: 'Guilherme' }, (err) => {
//     //     if (err) throw err;
//     // });

//     // Schema_users.remove({ name: 'Cintia' }, (err) => {
//     //     if (err) return console.error(err);
//     // });

//     // Schema_users.find(function (err, kittens) {
//     //     if (err) return console.error(err);
//     //     drawMessageServer(kittens, 'alert');
//     // });
// });

//================================================================================
// MODULO PARA EXPORTAR O SCRIPT
//================================================================================
module.exports = {
    createAccount: createAccount,
    removeAccount: removeAccount,
    updateAccount: updateAccount,
    playerPage: {
        playerPage_loginAccount: playerPage_loginAccount
    }
};