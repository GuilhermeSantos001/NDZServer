//================================================================================
// Schema(Users)
// Feito para o cadastro de usuarios
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
 * @description Importa a classe Schema do mongoose
 * @default mongoose.Schema
 */
var Schema = mongoose.Schema;

/**
 * @private Restrito ao escopo global
 * @description Coloca 0 na frente da string enquanto a string for menor que a
 * quantia de 0 indicada
 * @param {string} string valor indicado para colocar o 0 a frente desse valor
 * @param {number} length Quantidade de 0 indicada
 * @author GuilhermeSantos
 * @version 1.0.0
 */
var padZero = function (string, length) {
    var s = string.toString();
    while (s.length < length) {
        s = '0' + s;
    }
    return s;
};


/**
 * @private Restrito ao escopo global
 * @description Retorna um texto, uma data completa, dia da semana, dia do 
 * mes, mes, ano e hora
 * @param {string} string valor indicado para colocar o 0 a frente desse valor
 * @param {number} length Quantidade de 0 indicada
 * @author GuilhermeSantos
 * @version 1.0.0
 */
var dateNow = function () {
    var dias = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sabado"
    ];
    var mes = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];
    var date = new Date();
    var h = padZero(date.getHours(), 2);
    var m = padZero(date.getMinutes(), 2);
    var s = padZero(date.getSeconds(), 2);
    var ano = date.getFullYear();
    var data = mes[date.getMonth()] || '???';
    var dataDia = date.getDate();
    var dia = dias[date.getDay()];
    return `Conta criada em ${dataDia} de ${data} de ${ano}, no ${dia} as ${h}Horas, ${m}Minutos e ${s}Segundos`;
};

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Cria uma instancia da classe Schema
 * @default new Schema({})
 */
var usersSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "O valor não é valido ({VALUE})"],
        required: [true, '{PATH} este campo é obrigatório']
    },
    password: {
        type: String,
        trim: true,
        required: [true, '{PATH} este campo é obrigatório para sua segurança']
    },
    username: {
        type: String,
        trim: true,
        required: [true, '{PATH} este campo é obrigatório'],
        maxlength: [20, 'O valor do caminho `{PATH}` (`{VALUE}`) excedeu o comprimento maximo permitido ({MAXLENGTH}).'],
        minlength: [8, 'O valor do caminho `{PATH}` (`{VALUE}`) é menor que o comprimento mínimo permitido ({MINLENGTH}).']
    },
    familyName: {
        type: String,
        trim: true,
        unique: true,
        required: [true, '{PATH} este campo é obrigatório'],
        maxlength: [20, 'O valor do caminho `{PATH}` (`{VALUE}`) excedeu o comprimento maximo permitido ({MAXLENGTH}).'],
        minlength: [6, 'O valor do caminho `{PATH}` (`{VALUE}`) é menor que o comprimento mínimo permitido ({MINLENGTH}).']
    },
    lifestyle: {
        type: String,
        trim: true,
        required: [true, '{PATH} este campo é obrigatório'],
        enum: {
            values: ['Noobie', 'Survivor', 'Trader', 'Gangster', 'Athletic', 'Nerd'],
            message: '`{PATH}` não tem um valor valido `{VALUE}`'
        }
    },
    money: {
        type: Number,
        max: [99999, 'O valor do caminho `{PATH}` ({VALUE}) é maior que o maximo permitido ({MAX}).'],
        min: [0, 'O valor do caminho `{PATH}` ({VALUE}) é menor que o minimo permitido ({MIN}).'],
        required: [true, '{PATH} este campo é obrigatório']
    },
    fameFamily: {
        type: String,
        trim: true,
        required: [true, '{PATH} este campo é obrigatório']
    },
    spawnCity: {
        type: Array,
        default: ['Blocks', 1]
    },
    level: {
        type: Number,
        max: [90, 'O valor do caminho `{PATH}` ({VALUE}) é maior que o maximo permitido ({MAX}).'],
        min: [1, 'O valor do caminho `{PATH}` ({VALUE}) é menor que o minimo permitido ({MIN}).'],
        default: 1,
        required: [true, '{PATH} este campo é obrigatório']
    },
    lastLogin: {
        type: String,
        trim: true,
        default: dateNow()
    },
    accountCode: {
        type: String,
        unique: true,
        trim: true,
        required: [true, '{PATH} este campo é obrigatório']
    },
    accountCodeActivated: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: String,
        trim: true,
        default: dateNow()
    }
});

/**
 * @public Exportado pelo module.exports
 * @type {{}}
 * @description Define o Schema para criar os usuarios
 * @default mongoose.model('users', usersSchema)
 */
var Users = mongoose.model('users', usersSchema);

//================================================================================
// MODULO PARA EXPORTAR O SCRIPT
//================================================================================
module.exports = Users;