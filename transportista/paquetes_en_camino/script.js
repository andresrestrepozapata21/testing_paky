// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const idCarrier = urlParams.get('id');
const token = urlParams.get('token');
document.addEventListener('DOMContentLoaded', function () {
    // window.myAppConfig.development
    // window.myAppConfig.production
    fetch(window.myAppConfig.development + '/carrier/onTheWayPackage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id_carrier: idCarrier }),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            displayPackages(data.data_packages);
        })
        .catch((error) => {
            console.error(error);
        });
});

function displayPackages(packages) {
    const packagesInfoDiv = document.getElementById('packagesInfo');
    packagesInfoDiv.innerHTML = '<h3>Pedidos en Camino</h3>';

    // Iterar sobre todos los paquetes
    packages.forEach((pkg, index) => {
        const packageElement = document.createElement('div');
        packageElement.className = 'package';
        let estado = pkg.status_p;
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
            <p>Orden: ${pkg.order_number}</p>
            <p>Fecha de Creación: ${new Date(pkg.date_created_p).toLocaleDateString()}</p>
            <p>Ganancia para el Transportista: ${pkg.profit_for_carrier}</p>
            <p>Precio Total del Pedido: ${pkg.total_price_p}</p>
            <p>Dirección de Entrega: ${pkg.direction_client_p}</p>
            <p class='estado'>${estado}</p>
            <button id="packageBtn_${index}">Detalles</button>
        `;
        packagesInfoDiv.appendChild(packageElement);

        // Añadir manejador de evento click al botón recién creado
        document.getElementById(`packageBtn_${index}`).addEventListener('click', () => handlePackageAction(pkg.id_p));
    });
}

function handlePackageAction(packageId) {
    console.log("Realizando acción para el paquete con ID:", packageId);
    window.location = '../detalles_paquete/?id=' + idCarrier + '&token=' + token + '&id_p=' + packageId
}

document.getElementById(`asignadosBtn`).addEventListener('click', () => {
    window.location = '../asignados_carrier/?id=' + idCarrier + '&token=' + token;
});

document.getElementById(`EnCaminoBtn`).addEventListener('click', () => {
    window.location = '../paquetes_en_camino/?id=' + idCarrier + '&token=' + token;
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