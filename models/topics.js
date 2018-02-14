//================================================================================
// Schema(Topics)
// Feito para a criação de tópicos
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
 * @type object
 * @description Cria uma instancia da classe Schema
 * @default new Schema({})
 */
var topicsSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, '{PATH} este campo é obrigatório'],
        maxlength: [20, 'O valor do caminho `{PATH}` (`{VALUE}`) excedeu o comprimento maximo permitido ({MAXLENGTH}).'],
        minlength: [2, 'O valor do caminho `{PATH}` (`{VALUE}`) é menor que o comprimento mínimo permitido ({MINLENGTH}).']
    },
    tags: {
        type: String,
        enum: ['Topic', 'Comum']
    },
    authorName: [{ // Username
        type: String,
        trim: true,
        required: [true, '{PATH} este campo é obrigatório'],
        maxlength: [20, 'O valor do caminho `{PATH}` (`{VALUE}`) excedeu o comprimento maximo permitido ({MAXLENGTH}).'],
        minlength: [2, 'O valor do caminho `{PATH}` (`{VALUE}`) é menor que o comprimento mínimo permitido ({MINLENGTH}).']
    }, { // Endereço de Email
        type: String,
        lowercase: true,
        trim: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "O valor não é valido ({VALUE})"],
        required: [true, '{PATH} este campo é obrigatório']
    }, { // Endereço de IP
        type: String,
        unique: true,
        trim: true,
        require: [true, '{PATH} este campo é obrigatório']
    }],
    likes: {
        type: Number,
        max: [99999, 'O valor do caminho `{PATH}` ({VALUE}) é maior que o maximo permitido ({MAX}).'],
        min: [0, 'O valor do caminho `{PATH}` ({VALUE}) é menor que o minimo permitido ({MIN}).'],
        default: 0
    },
    dislike: {
        type: Number,
        max: [99999, 'O valor do caminho `{PATH}` ({VALUE}) é maior que o maximo permitido ({MAX}).'],
        min: [0, 'O valor do caminho `{PATH}` ({VALUE}) é menor que o minimo permitido ({MIN}).'],
        default: 0
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
 * @description Define o Schema para criar os topicos
 * @default mongoose.model('topics', topicsSchema)
 */
var Topics = mongoose.model('topics', topicsSchema);

//================================================================================
// MODULO PARA EXPORTAR O SCRIPT
//================================================================================
module.exports = {
    Topics: Topics
};