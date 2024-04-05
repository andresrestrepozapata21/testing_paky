// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const id_ru = urlParams.get('id');
const token = urlParams.get('token');

document.getElementById(`inicio`).addEventListener('click', () => {
    window.location = '../master/?id=' + id_ru + '&token=' + token;
});

document.getElementById(`pkgMunici`).addEventListener('click', () => {
    window.location = '../ver_paquetes_municipales/?id=' + id_ru + '&token=' + token;
});

document.getElementById(`asignarMuni`).addEventListener('click', () => {
    window.location = '../asignar_municipales/?id=' + id_ru + '&token=' + token;
});

document.getElementById(`pkgInter`).addEventListener('click', () => {
    window.location = '../ver_paquetes_intermunicipales/?id=' + id_ru + '&token=' + token;
});

document.getElementById(`asignarInter`).addEventListener('click', () => {
    window.location = '../asignar_intermunicipales/?id=' + id_ru + '&token=' + token;
});