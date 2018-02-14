/**
 * Eventos quando o documento está pronto
 */
$(document).ready(function () {
    $('ul.tabs').tabs();
    setInterval(() => {
        $('.carousel').carousel('next');
    }, 8000);
    $('.carousel.carousel-slider').carousel({
        fullWidth: true
    });
    renderUpdates();
    updatesInfo();
    renderRegras();
    renderNoticias();
});

/**
 * Faz uma renderização das atualizações
 */
var updateSelected = null;
var updatesData = [{
    id: 1,
    tile: 'Alpha v1.02',
    desc: [
        'Novos scripts',
        'Geração da pagina NDZServer',
        'Adaptação do banco de dados'
    ],
    active: true
}, {
    id: 2,
    tile: 'Alpha v1.01',
    desc: [
        'Novos scripts',
        'Atualização dos sistemas',
        'Correção de erros'
    ],
    active: false
}, {
    id: 3,
    tile: 'Alpha v1.00',
    desc: [
        'Desenvolvimento da base da plataforma',
        'Integração com o banco de dados',
        'Integração com o SMTP'
    ],
    active: false
}];

function renderUpdates() {
    updatesData.map((update) => {
        if (update.active) {
            if (!updateSelected) updateSelected = update.id;
            var classCollection = 'collection-item blue white-text';
            var classIcon1 = 'material-icons white-text right';
            var classIcon2 = 'material-icons white-text left';
        } else {
            var classCollection = 'collection-item blue-text';
            var classIcon1 = 'material-icons blue-text right';
            var classIcon2 = 'material-icons blue-text left';
        }
        var updateTitle = update.tile;
        $("#renderUpdate").append(
            `<a id="update_${update.id}" class="${classCollection}" onclick="changeUpdateVersion('${update.id}')"\
                style="cursor: pointer;">\
            <i id="updateIcon1_${update.id}" class="${classIcon1}">update</i>\
            <i id="updateIcon2_${update.id}" class="${classIcon2}">note</i>\
            ${updateTitle}</a>`
        );
    });
};

function updatesInfo() {
    var firstCollection = true;
    updatesData.map((update) => {
        if (update.active) {
            var updateInfo = update.desc;
            update.desc.map((desc) => {
                if (firstCollection) {
                    firstCollection = false;
                    var classCollection = 'collection-item blue white-text';
                } else {
                    var classCollection = 'collection-item white blue-text';
                }
                var updateString = `<li class="${classCollection}">\
                <i class="material-icons left">info</i>\
                <i class="material-icons right">system_update_alt</i>\
                <span>${desc}</span></li>`;
                $("#updateInfo").append(updateString);
            });
        }
    });
};

function changeUpdateVersion(updateId) {
    // Reseta a descrição anterior
    $(`#update_${updateSelected}`).removeClass(
        'collection-item blue white-text'
    ).addClass(
        'collection-item blue-text'
    );
    $(`#updateIcon1_${updateSelected}`).removeClass(
        'material-icons white-text right'
    ).addClass(
        'material-icons blue-text right'
    );
    $(`#updateIcon2_${updateSelected}`).removeClass(
        'material-icons white-text left'
    ).addClass(
        'material-icons blue-text left'
    );
    // Define a nova descrição
    updateSelected = updateId;
    $(`#update_${updateSelected}`).addClass(
        'collection-item blue white-text'
    );
    $(`#updateIcon1_${updateSelected}`).addClass(
        'material-icons white-text right'
    );
    $(`#updateIcon2_${updateSelected}`).addClass(
        'material-icons white-text left'
    );
    updatesDataReload(updateId);
};

function updatesDataReload(updateId) {
    updatesData.map((update) => {
        if (update.id == updateId) {
            update.active = true;
        } else {
            update.active = false;
        }
    });
    $("#updateInfo").text('');
    updatesInfo();
};

/**
 * Faz uma renderização das regras
 */
var regrasData = [
    'Não é permitido a criação de tópicos sobre o mesmo assunto',
    'Tópico com apologia, linguagem impropria, divulgação de dados pessoais \
    ou de qualquer pessoa, são proibidos.',
    'Pedir dinheiro, inscritos, votos ou qualquer tipo de benefício é proibido',
    'Fotos de perfil inapropriadas são proibidas',
    'Divulgação de conteúdos inapropriados é proibido'
];

function renderRegras() {
    var firstRegra = true;
    regrasData.map((regra) => {
        if (firstRegra) {
            firstRegra = false;
            classCollection = 'collection-item blue white-text';
            classIcon1 = 'material-icons left white-text';
            classIcon2 = 'material-icons right white-text';
        } else {
            classCollection = 'collection-item white blue-text';
            classIcon1 = 'material-icons left blue-text';
            classIcon2 = 'material-icons right blue-text';
        }
        $("#renderRegras").append(`
            <a class="${classCollection}">\
            <i class="${classIcon1}">warning</i>\
            <i class="${classIcon2}">gavel</i>\
            <font size="4">${regra}</font></a>`);
    });
};

/**
 * Faz uma renderização das noticias
 */
var noticiasData = [
    'Evento do primeiro cadastro',
    'Conquista por criar um tópico no beta',
    'Seja o primeiro a comentar em qualquer tópico e ganhe uma conquista'
];

function renderNoticias() {
    var firstNoticia = true;
    noticiasData.map((regra) => {
        if (firstNoticia) {
            firstNoticia = false;
            classCollection = 'collection-item blue white-text';
            classIcon1 = 'material-icons left white-text';
            classIcon2 = 'material-icons right white-text';
        } else {
            classCollection = 'collection-item white blue-text';
            classIcon1 = 'material-icons left blue-text';
            classIcon2 = 'material-icons right blue-text';
        }
        $("#renderNoticias").append(`
            <a class="${classCollection}">\
            <i class="${classIcon1}">note</i>\
            <i class="${classIcon2}">new_releases</i>\
            <font size="4">${regra}</font></a>`);
    });
};