class LSTrict {
    constructor() {
        this.languages = ["en_us", "pt_br"];
        this.default = 0;
        this.elements = [];
    };

    /**
     * @description Retorna o idioma atual
     */
    language() {
        return this.definePageLanguage() || this.languages[this.default];
    };

    /**
     * @description Adiciona o idioma para traduzir
     * 
     * @param id {string} ID do elemento
     * @param languages {{}} Textos e os idiomas
     */
    addElement(id, languages) {
        this.elements.push({
            getElementById: function () {
                return document.getElementById(id)
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
     * @description Define o idioma atual
     * 
     */
    definePageLanguage() {
        var defaultPageLanguage = document.getElementById("translate_default").getAttribute("translateDefault");
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