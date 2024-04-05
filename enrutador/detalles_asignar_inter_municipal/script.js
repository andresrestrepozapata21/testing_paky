// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const id_ru = urlParams.get('id_ru');
const id_carrier = urlParams.get('id_carrier');
const token = urlParams.get('token');

document.addEventListener('DOMContentLoaded', function () {
    cargarDatosDelServidor();

    // Añadir evento al botón regresar si es necesario
    document.getElementById('btnRegresar').addEventListener('click', function () {
        window.location = '../asignar_municipales/?id=' + id_ru + '&token=' + token;
    });

    // Captura del evento click del botón "Asignar"
    document.getElementById('btnAsignar').addEventListener('click', function () {
        enviarDatosDeAsignacion();
    });

    // Evento para cada checkbox de paquete
    document.querySelectorAll('input[name="seleccionPaquete"]').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            const capacidadVehiculo = 10; // Asumiendo un valor fijo, reemplázalo según corresponda con la variable adecuada
            verificarSeleccionPaquetes(capacidadVehiculo);
        });
    });

});

function enviarDatosDeAsignacion() {
    const checkboxesSeleccionados = document.querySelectorAll('input[name="seleccionPaquete"]:checked');
    let idsPaquetes = [];

    checkboxesSeleccionados.forEach(function (checkbox) {
        idsPaquetes.push(parseInt(checkbox.value));
    });

    const datosAsignacion = {
        id_carrier, // Asume un ID fijo, reemplázalo por el ID real del transportista
        ids_p: idsPaquetes
    };

    fetch('http://localhost:3000/routerUser/toAsignatePackages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Asegúrate de usar el esquema de autorización correcto (Bearer en este caso)
        },
        body: JSON.stringify(datosAsignacion)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if(data.result = 1){
                alert('Paquetes asignados correctamente.');
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            alert('Ocurrió un error al asignar los paquetes.');
        });
}

async function cargarDatosDelServidor() {
    const url = "http://localhost:3000/routerUser/getDetailAsignateInter"; // Reemplaza esto con la URL de tu endpoint

    try {
        const response = await fetch(url, {
            method: 'POST', // Método POST
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Aquí se asume un esquema de autenticación Bearer
            },
            body: JSON.stringify({ id_carrier })
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();

        // Asumiendo que 'data' contiene las propiedades 'data_carrier' y 'data_packages'
        cargarInformacionTransportista(data.data_carrier[0]);
        cargarTablaPaquetes(data.data_free_packages, data.data_asignated_packages ,data.data_carrier[0].vehicle.capacity_vehicle);
    } catch (error) {
        console.error('Error al cargar los datos del servidor:', error);
    }
}

function cargarInformacionTransportista(transportista) {
    const div = document.getElementById('info-transportista');
    div.innerHTML = `
        <h2>Información del Transportista</h2>
        <p><strong>Nombre:</strong> ${transportista.name_carrier} ${transportista.last_name_carrier}</p>
        <p><strong>Teléfono:</strong> ${transportista.phone_number_carrier}</p>
        <p><strong>Email:</strong> ${transportista.email_carrier}</p>
        <p><strong>Vehículo:</strong> ${transportista.vehicle.class_vehicle} - ${transportista.vehicle.plate_vehicle}</p>
        <p><strong>Capacidad:</strong> ${transportista.vehicle.capacity_vehicle} paquetes</p>
        <p><strong>Descripción:</strong> ${transportista.vehicle.description_vehicle}</p>
    `;
}

function cargarTablaPaquetes(paquetes, paquetes_asignados ,capacidadVehiculo) {
    const tbody = document.getElementById('tabla-paquetes').getElementsByTagName('tbody')[0];
    const tbody2 = document.getElementById('tabla-paquetes-asignated').getElementsByTagName('tbody')[0];
    paquetes_asignados.forEach((paquete) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${paquete.id_p}</td>
            <td>${paquete.orden_p}</td>
            <td>${paquete.name_client_p}</td>
            <td>${paquete.guide_number_p}</td>
            <td>${paquete.total_price_p}</td>
            <td><a href="#" onclick="mostrarDetallePaquete(${paquete.id_p})">Ver Productos</a></td>
            <td><input type="checkbox" disabled checked></td>
        `;
        tbody2.appendChild(tr);
    });
    paquetes.forEach((paquete) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${paquete.id_p}</td>
            <td>${paquete.orden_p}</td>
            <td>${paquete.name_client_p}</td>
            <td>${paquete.guide_number_p}</td>
            <td>${paquete.total_price_p}</td>
            <td><a href="#" onclick="mostrarDetallePaquete(${paquete.id_p})">Ver Productos</a></td>
            <td><input type="checkbox" name="seleccionPaquete" value="${paquete.id_p}" onchange="verificarSeleccionPaquetes(${capacidadVehiculo})"></td>
        `;
        tbody.appendChild(tr);
    });
}

function mostrarDetallePaquete(idPaquete) {
    const formData = {
        id_p: idPaquete,
    };
    // Realizar la petición Fetch para obtener los productos del paquete
    fetch(`http://localhost:3000/routerUser/getProductsPackage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];

            data.data.forEach((item) => {
                item.package_products.forEach(product => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${product.product.id_product}</td>
                        <td>${product.product.name_product}</td>
                        <td>${product.product.description_product}</td>
                        <td>${product.cuantity_pp}</td>
                        <td>${product.product.price_sale_product}</td>
                        <td>${product.product.price_cost_product}</td>
                        <td>${product.product.size_product}</td>
                    `;
                    productTable.appendChild(tr);
                });
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch de productos del paquete:', error);
        });
    abrirModal();
}

function abrirModal() {
    document.getElementById('modal').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
}

document.querySelector('.close-button').addEventListener('click', cerrarModal);

function verificarSeleccionPaquetes(capacidadVehiculo) {
    const seleccionados = document.querySelectorAll('input[name="seleccionPaquete"]:checked').length;
    const btnAsignar = document.getElementById('btnAsignar');

    if (seleccionados > 0 && seleccionados <= capacidadVehiculo) {
        btnAsignar.disabled = false;
    } else {
        btnAsignar.disabled = true;
    }

    if (seleccionados > capacidadVehiculo) {
        alert(`La selección de paquetes no puede exceder la capacidad del vehículo de ${capacidadVehiculo} paquetes.`);
        // Opcional: Desmarcar el último seleccionado o manejar según necesidad.
    } else {
        console.log(seleccionados)
    }
}

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