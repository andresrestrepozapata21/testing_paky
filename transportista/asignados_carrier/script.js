// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const idCarrier = urlParams.get('id');
const token = urlParams.get('token');
document.addEventListener('DOMContentLoaded', function () {
    // Resto del código para capturar parámetros y hacer el fetch...

    fetch('http://localhost:3000/carrier/asignatedPackage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id_carrier: idCarrier }),
    })
        .then(response => response.json())
        .then(data => {
            displayPackages(data.data_packages);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

function displayPackages(packages) {
    const packagesInfoDiv = document.getElementById('packagesInfo');
    packagesInfoDiv.innerHTML = '<h3>Paquetes asignados para enviar</h3>';

    // Iterar sobre todos los paquetes
    packages.forEach((pkg, index) => {
        const packageElement = document.createElement('div');
        packageElement.className = 'package';
        let estado = pkg.status_p;
        if (estado == 1) {
            packageElement.className = 'dropACentral';
        } else if (estado == 4) {
            packageElement.className = 'centralACliente';
        }
        packageElement.innerHTML = `
            <p>Orden: ${pkg.order_number}</p>
            <p>Fecha de Creación: ${new Date(pkg.date_created_p).toLocaleDateString()}</p>
            <p>Ganancia para el Transportista: ${pkg.profit_for_carrier}</p>
            <p>Precio Total del Pedido: ${pkg.total_price_p}</p>
            <p>Dirección de Entrega: ${pkg.direction_client_p}</p>
            <p>Estado Paquete: ${pkg.status_p}</p>
            <button id="packageBtn_${index}">Deslizar para iniciar Entrega</button>
        `;
        packagesInfoDiv.appendChild(packageElement);

        // Añadir manejador de evento click al botón recién creado
        document.getElementById(`packageBtn_${index}`).addEventListener('click', () => handlePackageAction(pkg.id_p));
    });
}

function handlePackageAction(packageId) {
    console.log("Realizando acción para el paquete con ID:", packageId);
    // Aquí puedes realizar la llamada fetch al otro endpoint usando el packageId
    fetch('http://localhost:3000/carrier/confirmatePackage', {
        method: 'POST', // o 'GET', dependiendo de tu endpoint
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Asegúrate de reemplazar esto según sea necesario
        },
        body: JSON.stringify({ id_p: packageId }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.result == 1) {
                console.log('Respuesta del endpoint:', data);
                alert("todo ok");
                window.location.reload();
            }
        })
        .catch(error => console.error('Error:', error));
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