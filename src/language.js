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
class LSTrict {
    constructor() {
        this.languages = ["en_us", "pt_br", 'es'];
        this.default = 2;
        this.elements = [];
    };

    /**
     * @description Retorna o idioma atual
     */
    language() {
        return this.definePageLanguage() || this.languages[this.default];
    };

    /**
     * @description Adiciona o elemento para traduzir
     * 
     * @param {string} id ID do elemento
     * @param {{}} languages Textos e os idiomas
     */
    addElement(id, languages) {
        this.elements.push({
            getElementById: function () {
                return document.getElementById(id);
            },
            getElementText: function (language) {
                if (languages[language]) {
                    var text = languages[language];
                    if (typeof text != 'string') {
                        text = null;
                    } else if (typeof text == 'string' && text.length <= 0) {
                        text = null;
                    }
                }
                return text || '???';
            },
            translate: function (element, text) {
                if (element)
                    element.textContent = text;
            }
        });
    };

    /**
     * @description Adiciona o atributo para traduzir
     * 
     * @param {string} id ID do elemento
     * @param {string} attribute Nome do atributo
     * @param {{}} languages Textos e os idiomas
     */
    addAttribute(id, attribute, languages) {
        this.elements.push({
            getElementById: function () {
                return document.getElementById(id);
            },
            getElementText: function (language) {
                if (languages[language]) {
                    var text = languages[language];
                    if (typeof text != 'string') {
                        text = null;
                    } else if (typeof text == 'string' && text.length <= 0) {
                        text = null;
                    }
                }
                return text || '???';
            },
            translate: function (element, text) {
                if (element) {
                    if (element.hasAttribute(attribute)) {
                        element.setAttribute(attribute, text);
                    }
                }
            }
        });
    };

    /**
     * @description Define o idioma atual
     * 
     */
    definePageLanguage() {
        if (document.getElementById("translate_default")) {
            var defaultPageLanguage = document.getElementById("translate_default").getAttribute("translateDefault");
        } else {
            var defaultPageLanguage = null;
        }
        if (typeof defaultPageLanguage === 'string' && defaultPageLanguage.length > 0) {
            return defaultPageLanguage;
        }
        return null;
    };

    /**
     * @description Carrega o texto dos elementos da pagina atual.
     * 
     */
    loadPage() {
        var language = this.language();
        this.elements.forEach(element => {
            var getElementById = element.getElementById();
            var getElementText = element.getElementText(language);
            element.translate(getElementById, getElementText);
        });
    };
};
export const Language = new LSTrict();