// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const idCarrier = urlParams.get('id');
const token = urlParams.get('token');

document.addEventListener('DOMContentLoaded', function () {
    // Resto del código para capturar parámetros y hacer el fetch...
    // window.myAppConfig.development
    // window.myAppConfig.production
    fetch(window.myAppConfig.production + '/carrier/history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id_carrier: idCarrier }),
    })
        .then(response => response.json())
        .then(data => {
            displayPackages(data.data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

function displayPackages(packages) {
    const packagesInfoDiv = document.getElementById('packagesInfo');

    // Limitar la visualización a máximo 3 paquetes
    packages.forEach(pkg => {
        const packageElement = document.createElement('div');
        packageElement.className = 'package';
        let estado = pkg.package.status_p;
        if (estado == 7) {
            estado = 'En camino de bodega inicia central';
            packageElement.className = 'dropACentral';
        } else if (estado == 3) {
            estado = 'En camino entre bodegas centrales';
            packageElement.className = 'centralACentral';
        } else if (estado == 5) {
            estado = 'En camino a entrega final';
            packageElement.className = 'centralACliente';
        }
        packageElement.innerHTML = `
            <p>Orden: ${pkg.package.orden_p}</p>
            <p>Fecha de Creación: ${new Date(pkg.package.createdAt).toLocaleDateString()}</p>
            <p>Ganancia para el Transportista: ${pkg.package.profit_carrier_p}</p>
            <p>Precio Total del Pedido: ${pkg.package.total_price_p}</p>
            <p>Dirección de Entrega: ${pkg.package.direction_client_p}</p>
            <p class='estado'>${estado}</p>
        `;
        packagesInfoDiv.appendChild(packageElement);
    });
}

document.getElementById(`todosBtn`).addEventListener('click', () => {

});

document.getElementById(`enCaminoBtn`).addEventListener('click', () => {

});

document.getElementById(`entregadosBtn`).addEventListener('click', () => {

});

document.getElementById(`canceladosBtn`).addEventListener('click', () => {

});

document.getElementById(`inicioBtn`).addEventListener('click', () => {
    window.location = '../master/?id=' + idCarrier + '&token=' + token;
});

document.getElementById(`packageBtn`).addEventListener('click', () => {
    window.location = '../asignados_carrier/?id=' + idCarrier + '&token=' + token;
});

document.getElementById(`historialBtn`).addEventListener('click', () => {
    window.location = '../historial/?id=' + idCarrier + '&token=' + token;
});

document.getElementById(`perfilBtn`).addEventListener('click', () => {
    window.location = '../perfil/?id=' + idCarrier + '&token=' + token;
});