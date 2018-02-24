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
import {
    Language
} from './language';

/**
 * Tela de login
 */
Language.addElement('window_login_text_01', {
    'pt_br': 'Faça seu cadastro para acessar o fórum',
    'en_us': 'Make your registration to access the forum',
    'es': 'Haga su registro para acceder al foro'
});

Language.addElement('window_login_text_02', {
    'pt_br': 'Endereço de email',
    'en_us': 'Email address',
    'es': 'Dirección de email'
});

Language.addElement('window_login_text_03', {
    'pt_br': 'Sua senha',
    'en_us': 'Your password',
    'es': 'Tu contraseña'
});

Language.addElement('window_login_text_04', {
    'pt_br': 'Registrar',
    'en_us': 'Register',
    'es': 'Registrar'
});

Language.addElement('window_login_text_05', {
    'pt_br': 'Entrar',
    'en_us': 'Enter',
    'es': 'Entrar'
});

/**
 * Tela de registro
 */
Language.addElement('window_register_text_01', {
    'pt_br': 'Crie seu cadastro para acessar o fórum',
    'en_us': 'Create your registration to access the forum',
    'es': 'Crear su registro para acceder al foro'
});

Language.addElement('window_register_text_02', {
    'pt_br': 'Endereço de email',
    'en_us': 'Email address',
    'es': 'Dirección de correo electrónico'
});

Language.addElement('window_register_text_03', {
    'pt_br': 'Nome de usuário',
    'en_us': 'Username',
    'es': 'Nombre del usuario'
});

Language.addElement('window_register_text_04', {
    'pt_br': 'Sua senha',
    'en_us': 'Your password',
    'es': 'Tu contraseña'
});

Language.addElement('window_register_text_05', {
    'pt_br': 'Confirme sua senha',
    'en_us': 'Confirm your password',
    'es': 'Confirme su contraseña'
});

Language.addElement('window_register_text_06', {
    'pt_br': 'Voltar',
    'en_us': 'Return',
    'es': 'Regresar'
});

Language.addElement('window_register_text_07', {
    'pt_br': 'Confirmar',
    'en_us': 'Confirm',
    'es': 'Confirmar'
});

/**
 * Tela de loader
 */
Language.addElement('window_preloader_text_01', {
    'pt_br': 'Carregando',
    'en_us': 'Loading',
    'es': 'Cargando'
});

/**
 * Tela de Conta criada
 */
Language.addElement('window_accountCreated_text_01', {
    'pt_br': 'Verifique seu endereço de e-mail para confirmar seu cadastro',
    'en_us': 'Verify your email address to confirm your registration',
    'es': 'Compruebe su correo electrónico para confirmar tu registro'
});

/**
 * Tooltips da pagina
 */
Language.addAttribute('register_icon_password_visibility', 'data-tooltip', {
    'pt_br': 'Visualizar a senha',
    'en_us': 'View the password',
    'es': 'Ver la contraseña'
});

/**
 * Traduzir a pagina
 */
$(window).on('load', () => {
    Language.loadPage();
});