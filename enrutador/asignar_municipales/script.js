// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const id_ru = urlParams.get('id');
const token = urlParams.get('token');

document.addEventListener('DOMContentLoaded', function () {
    // Realizar la petición Fetch al endpoint
    fetch('http://localhost:3000/routerUser/getCarriers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => response.json())
        .then(data => {
            // Procesar los datos y llenar la tabla
            const dataTable = $('#dataTable').DataTable();

            data.data.forEach(item => {
                dataTable.row.add([
                    item.id_carrier,
                    item.type_document,
                    item.number_document_carrier,
                    item.name_carrier,
                    item.last_name_carrier,
                    item.phone_number_carrier,
                    item.email_carrier,
                    `<a class="view-packages" data-id="${item.id_carrier}">Ver Paquetes</a>`,
                    item.status_capacity,
                    `<button class="asignate-packages" data-id="${item.id_carrier}">Asignar</button>`
                ]).draw();
            });

            // Agregar evento clic al botón "Ver Paquetes"
            $('.view-packages').click(function () {
                const carrierId = $(this).data('id');
                // Llamar a la función para ver los paquetes
                viewPackages(carrierId);
            });
            // Agregar evento clic al botón "Ver Paquetes"
            $('.asignate-packages').click(function () {
                const carrierId = $(this).data('id');
                // Llamar a la función para ver los paquetes
                window.location = '../detalles_asignar_municipal/?id_carrier=' + carrierId + '&id_ru=' + id_ru + '&token=' + token;
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });

    // Función para manejar el evento click del enlace "Ver Paquetes"
    function viewPackages(carrierId) {
        const formData = {
            id_carrier: carrierId,
        };
        // Realizar la petición Fetch al endpoint de paquetes del transportista
        fetch(`http://localhost:3000/routerUser/getPackagesCarrier`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                // Procesar los datos y llenar la tabla de paquetes
                const packageTable = $('#packageTable').DataTable();
                packageTable.clear().draw();

                data.data.forEach(package => {
                    const statusText = package.status_p;
                    const withCollectionText = package.with_collection_p ? 'Sí' : 'No';

                    packageTable.row.add([
                        package.id_p,
                        package.orden_p,
                        package.name_client_p,
                        package.phone_number_client_p,
                        package.guide_number_p,
                        statusText,
                        withCollectionText,
                        package.total_price_p
                    ]).draw();
                });
                // Mostrar el modal
                $('#myModal').css('display', 'block');
            })
            .catch(error => {
                console.error('Error en la petición Fetch de productos del paquete:', error);
            });
    }
    // Cerrar el modal al hacer clic en la "X"
    $('.close').click(function () {
        $('#myModal').css('display', 'none');
    });

    // Cerrar el modal al hacer clic fuera de él
    $(window).click(function (event) {
        if (event.target == $('#myModal')[0]) {
            $('#myModal').css('display', 'none');
        }
    });
});

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