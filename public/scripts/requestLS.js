!function(e){function t(a){if(n[a])return n[a].exports;var r=n[a]={i:a,l:!1,exports:{}};return e[a].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,a){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:a})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/public/scripts/",t(t.s=0)}([function(e,t,n){"use strict";var a=n(1);a.Language.addElement("window_login_text_01",{pt_br:"Faça seu cadastro para acessar o fórum",en_us:"Make your registration to access the forum"}),a.Language.addElement("window_login_text_02",{pt_br:"Endereço de e-mail",en_us:"Email address"}),a.Language.addElement("window_login_text_03",{pt_br:"Sua senha",en_us:"Your password"}),a.Language.addElement("window_login_text_04",{pt_br:"Registrar",en_us:"Register"}),a.Language.addElement("window_login_text_05",{pt_br:"Entrar",en_us:"Enter"}),a.Language.addElement("window_register_text_01",{pt_br:"Crie seu cadastro para acessar o fórum",en_us:"Create your registration to access the forum"}),a.Language.addElement("window_register_text_02",{pt_br:"Endereço de email",en_us:"Email address"}),a.Language.addElement("window_register_text_03",{pt_br:"Nome de usuário",en_us:"Username"}),a.Language.addElement("window_register_text_04",{pt_br:"Sua senha",en_us:"Your password"}),a.Language.addElement("window_register_text_05",{pt_br:"Confirme sua senha",en_us:"Confirm your password"}),a.Language.addElement("window_register_text_06",{pt_br:"Voltar",en_us:"Return"}),a.Language.addElement("window_register_text_07",{pt_br:"Confirmar",en_us:"Confirm"}),a.Language.addElement("window_preloader_text_01",{pt_br:"Carregando",en_us:"Loading"}),a.Language.addElement("window_accountCreated_text_01",{pt_br:"Verifique seu endereço de e-mail para confirmar seu cadastro",en_us:"Verify your email address to confirm your registration"}),$(document).ready(function(){a.Language.default=1,a.Language.loadPage()})},function(e,t,n){"use strict";function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),u=function(){function e(){a(this,e),this.languages=["en_us","pt_br"],this.default=0,this.elements=[]}return r(e,[{key:"language",value:function(){return this.definePageLanguage()||this.languages[this.default]}},{key:"addElement",value:function(e,t){this.elements.push({getElementById:function(){return document.getElementById(e)},getElementText:function(e){if(t[e]){var n=t[e];"string"!=typeof n?n=null:"string"==typeof n&&n.length<=0&&(n=null)}return n||"???"},translate:function(e,t){e&&(e.textContent=t)}})}},{key:"definePageLanguage",value:function(){if(document.getElementById("translate_default"))var e=document.getElementById("translate_default").getAttribute("translateDefault");else var e=null;return"string"==typeof e&&e.length>0?e:null}},{key:"loadPage",value:function(){var e=this.language();this.elements.forEach(function(t){var n=t.getElementById(),a=t.getElementText(e);t.translate(n,a)})}}]),e}();t.Language=new u}]);