// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const idCarrier = urlParams.get('id');
const token = urlParams.get('token');

document.addEventListener('DOMContentLoaded', function () {
    // Resto del código para capturar parámetros y hacer el fetch...
    // window.myAppConfig.development
    // window.myAppConfig.production
    fetch(window.myAppConfig.production + '/carrier/master', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id_carrier: idCarrier }),
    })
        .then(response => response.json())
        .then(data => {
            displayCarrierInfo(data.data_master[0]);
            displayPackages(data.data_packages);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

function displayCarrierInfo(carrier) {
    const carrierInfoDiv = document.getElementById('carrierInfo');
    carrierInfoDiv.innerHTML = `
        <h3>Información del Transportista</h3>
        <p>Nombre: ${carrier.name_carrier}</p>
        <p>Saldo: ${carrier.revenue_carrier}</p>
        <p>Deuda: ${carrier.debt_carrier}</p>
    `;
}

function displayPackages(packages) {
    const packagesInfoDiv = document.getElementById('packagesInfo');
    packagesInfoDiv.innerHTML = '<h3>Detalles de los Pedidos</h3>';

    // Limitar la visualización a máximo 3 paquetes
    packages.slice(0, 3).forEach(pkg => {
        const packageElement = document.createElement('div');
        packageElement.className = 'package';
        packageElement.innerHTML = `
            <p>Orden: ${pkg.order_number}</p>
            <p>Fecha de Creación: ${new Date(pkg.date_created_p).toLocaleDateString()}</p>
            <p>Ganancia para el Transportista: ${pkg.profit_for_carrier}</p>
            <p>Precio Total del Pedido: ${pkg.total_price_p}</p>
            <p>Dirección de Entrega: ${pkg.direction_client_p}</p>
        `;
        packagesInfoDiv.appendChild(packageElement);
    });
}


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