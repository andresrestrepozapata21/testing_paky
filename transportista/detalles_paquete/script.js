// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const idPackage = urlParams.get('id_p');
const idCarrier = urlParams.get('id');
const token = urlParams.get('token');

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/carrier/detailsPackage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id_p: idPackage }),
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
    packagesInfoDiv.innerHTML = '<h3>Detalles de los Pedidos</h3>';

    // Iterar sobre todos los paquetes
    packages.forEach((pkg, index) => {
        const packageElement = document.createElement('div');
        packageElement.className = 'package';
        let estado;
        if (pkg.status_p == 7) {
            estado = 'En camino de bodega inicia central';
        } else if (pkg.status_p == 3) {
            estado = 'En camino entre bodegas centrales';
        } else if (pkg.status_p == 5) {
            estado = 'En camino a entrega final';
        } else if (pkg.status_p == 1) {
            estado = 'Bodega Dropshipper';
        } else if (pkg.status_p == 2) {
            estado = 'Bodega central origen';
        } else if (pkg.status_p == 4) {
            estado = 'Bodega central destino';
        } else if (pkg.status_p == 6) {
            estado = 'Entregado al cliente';
        }
        packageElement.innerHTML = `
            <p>Número de Guía: ${pkg.guide_number_p}</p>
            <p>Orden: ${pkg.order_number}</p>
            <p>Fecha de Creación: ${new Date(pkg.date_created_p).toLocaleDateString()}</p>
            <p>Ganancia para el Transportista: ${pkg.profit_for_carrier}</p>
            <p>Precio Total del Pedido: ${pkg.total_price_p}</p>
            <p>Nombre Cliente: ${pkg.name_client_p}</p>
            <p>Teléfono Cliente: ${pkg.phone_number_client_p}</p>
            <p>Email Cliente: ${pkg.email_client_p}</p>
            <p>Dirección de Entrega: ${pkg.direction_client_p}</p>
            <p>Departamento de Entrega: ${pkg.name_department_destiny}</p>
            <p>ciudad de Entrega: ${pkg.name_city_destiny}</p>
            <p class='estado'>${estado}</p>
            <div class="form-group">
                <label for="file_${index}">Evidencia:</label>
                <input type="file" id="file_${index}" name="file_${index}" required>
            </div>
            </br>
            <button id="packageBtn_${index}">Entregar</button>
        `;
        packagesInfoDiv.appendChild(packageElement);

        // Añadir manejador de evento click al botón recién creado
        document.getElementById(`packageBtn_${index}`).addEventListener('click', () => handlePackageAction(pkg.id_p, index));
    });
}

function handlePackageAction(packageId, index) {
    const fileInput = document.getElementById(`file_${index}`);
    // Verificar si el usuario ha seleccionado un archivo
    if (fileInput.files.length === 0) {
        alert('Por favor, carga un archivo antes de continuar.');
        return; // Detiene la función si no hay archivos seleccionados
    }

    // Crea una instancia de FormData
    const formData = new FormData();
    formData.append('evidence', document.getElementById(`file_${index}`).files[0]);
    formData.append('id_p', packageId);
    formData.append('type_evidence', 1);
    fetch('http://localhost:3000/carrier/deliverPackage', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            window.location.reload();
        })
        .catch((error) => {
            console.error(error);
        });
}

// Añadir manejador de evento click al botón recién creado
document.getElementById(`back`).addEventListener('click', () => {
    window.location = '../paquetes_en_camino/?id=' + idCarrier + '&token=' + token;
});

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