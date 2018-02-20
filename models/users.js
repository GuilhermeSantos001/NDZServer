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
    return `Conta criada em ${dataDia} de ${data} de ${ano}, na ${dia} as ${h}Horas, ${m}Minutos e ${s}Segundos`;
};

/**
 * @private Restrito ao escopo global
 * @description Retorna um texto, uma data completa, dia da semana, dia do 
 * mes, mes, ano e hora para o login
 * @author GuilhermeSantos
 * @version 1.0.0
 */
function dateNowToLogin() {
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
    return `Último login foi em ${dataDia} de ${data} de ${ano}, na ${dia} as ${h}Horas, ${m}Minutos e ${s}Segundos`;
};

/**
 * @private Restrito ao escopo global
 * @type object
 * @description Cria uma instancia da classe Schema
 * @default new Schema({})
 */
var usersSchema = new Schema({
    language: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, '{PATH} este campo é obrigatório']
    },
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
        required: [true, '{PATH} este campo é obrigatório para sua segurança'],
        minlength: [8, 'O valor do caminho `{PATH}` (`{VALUE}`) é menor que o comprimento mínimo permitido ({MINLENGTH}).']
    },
    username: {
        type: String,
        trim: true,
        required: [true, '{PATH} este campo é obrigatório'],
        maxlength: [20, 'O valor do caminho `{PATH}` (`{VALUE}`) excedeu o comprimento maximo permitido ({MAXLENGTH}).'],
        minlength: [2, 'O valor do caminho `{PATH}` (`{VALUE}`) é menor que o comprimento mínimo permitido ({MINLENGTH}).']
    },
    money: {
        type: Number,
        max: [99999, 'O valor do caminho `{PATH}` ({VALUE}) é maior que o maximo permitido ({MAX}).'],
        min: [0, 'O valor do caminho `{PATH}` ({VALUE}) é menor que o minimo permitido ({MIN}).'],
        required: [true, '{PATH} este campo é obrigatório']
    },
    level: {
        type: Number,
        max: [90, 'O valor do caminho `{PATH}` ({VALUE}) é maior que o maximo permitido ({MAX}).'],
        min: [1, 'O valor do caminho `{PATH}` ({VALUE}) é menor que o minimo permitido ({MIN}).'],
        required: [true, '{PATH} este campo é obrigatório']
    },
    achievements: {
        type: String,
        enum: []
    },
    lastLogin: {
        type: String,
        trim: true,
        default: dateNowToLogin()
    },
    dateCreated: {
        type: String,
        trim: true,
        default: dateNow()
    },
    verifyAccount: {
        type: Boolean,
        default: false,
        required: [true, '{PATH} este campo é obrigatório']
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