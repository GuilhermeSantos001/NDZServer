import {
    Language
} from './language';

/**
 * Tela de login
 */
Language.addElement('window_login_text_01', {
    'pt_br': 'Faça seu cadastro para acessar o fórum',
    'en_us': 'Make your registration to access the forum'
});

Language.addElement('window_login_text_02', {
    'pt_br': 'Endereço de e-mail',
    'en_us': 'Email address'
});

Language.addElement('window_login_text_03', {
    'pt_br': 'Sua senha',
    'en_us': 'Your password'
});

Language.addElement('window_login_text_04', {
    'pt_br': 'Registrar',
    'en_us': 'Register'
});

Language.addElement('window_login_text_05', {
    'pt_br': 'Entrar',
    'en_us': 'Enter'
});

/**
 * Tela de registro
 */
Language.addElement('window_register_text_01', {
    'pt_br': 'Crie seu cadastro para acessar o fórum',
    'en_us': 'Create your registration to access the forum'
});

Language.addElement('window_register_text_02', {
    'pt_br': 'Endereço de email',
    'en_us': 'Email address'
});

Language.addElement('window_register_text_03', {
    'pt_br': 'Nome de usuário',
    'en_us': 'Username'
});

Language.addElement('window_register_text_04', {
    'pt_br': 'Sua senha',
    'en_us': 'Your password'
});

Language.addElement('window_register_text_05', {
    'pt_br': 'Confirme sua senha',
    'en_us': 'Confirm your password'
});

Language.addElement('window_register_text_06', {
    'pt_br': 'Voltar',
    'en_us': 'Return'
});

Language.addElement('window_register_text_07', {
    'pt_br': 'Confirmar',
    'en_us': 'Confirm'
});

/**
 * Tela de loader
 */
Language.addElement('window_preloader_text_01', {
    'pt_br': 'Carregando',
    'en_us': 'Loading'
});

/**
 * Tela de Conta criada
 */
Language.addElement('window_accountCreated_text_01', {
    'pt_br': 'Verifique seu endereço de e-mail para confirmar seu cadastro',
    'en_us': 'Verify your email address to confirm your registration'
});

/**
 * Traduzir a pagina
 */
$(document).ready(() => {
    Language.loadPage();
});