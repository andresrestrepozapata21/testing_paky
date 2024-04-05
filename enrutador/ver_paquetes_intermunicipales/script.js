// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const id_ru = urlParams.get('id');
const token = urlParams.get('token');

document.addEventListener('DOMContentLoaded', function () {
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.development + '/routerUser/getInterCityPackages', {
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
                let statusText;
                switch (item.status_p) {
                    case 1:
                        statusText = "Bodega dropshipper";
                        break;
                    case 2:
                        statusText = "Bodega central origen";
                        break;
                    case 3:
                        statusText = "En camino entre bodegas centrales";
                        break;
                    case 4:
                        statusText = "En bodega central destino";
                        break;
                    case 5:
                        statusText = "En camino a entrega final";
                        break;
                    case 6:
                        statusText = "Entregado";
                        break;
                    case 7:
                        statusText = "En camino de bodega dropshipper a bodega central";
                        break;
                }

                dataTable.row.add([
                    item.id_p,
                    item.orden_p,
                    item.guide_number_p,
                    item.profit_carrier_p,
                    item.total_price_p,
                    item.with_collection_p ? "Sí" : "No",
                    statusText,
                    item.direction_client_p,
                    item.createdAt,
                    `<a href="#" class="show-modal" data-id="${item.id_p}">Ver Productos</a>`
                ]).draw();
            });

            // Agregar evento clic a los enlaces "Ver Productos"
            $('.show-modal').click(function (e) {
                e.preventDefault();
                const packageId = $(this).data('id');
                showModal(packageId);
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });

    // Función para mostrar el modal con la información de los productos del paquete
    function showModal(packageId) {
        const formData = {
            id_p: packageId,
        };
        // Realizar la petición Fetch para obtener los productos del paquete
        fetch(window.myAppConfig.development + `/routerUser/getProductsPackage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                const productTable = $('#productTable').DataTable();
                productTable.clear().draw();

                // Procesar los datos y llenar la tabla de productos del paquete
                data.data.forEach(item => {
                    item.package_products.forEach(product => {
                        productTable.row.add([
                            product.product.id_product,
                            product.product.name_product,
                            product.product.description_product,
                            product.cuantity_pp,
                            product.product.price_sale_product,
                            product.product.price_cost_product,
                            product.product.size_product
                        ]).draw();
                    });
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