// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const idCarrier = urlParams.get('id');
const token = urlParams.get('token');

// Agregar evento de escucha para el envío del formulario
document.getElementById('paymentForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    // Capturar los datos del formulario
    const formData = new FormData();
    formData.append('bancolombia_number_account_carrier', document.getElementById('numCuenta').value);
    formData.append('nequi_carrier', document.getElementById('nequi').value);
    formData.append('daviplata_carrier', document.getElementById('daviplata').value);
    formData.append('qr', document.getElementById('imagen').files[0]);

    // Enviar los datos al endpoint utilizando Fetch
    fetch('http://localhost:3000/carrier/accounts/' + idCarrier, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            // Aquí puedes manejar la respuesta del servidor como desees
        })
        .catch(error => {
            console.error('Error:', error);
            // Aquí puedes manejar los errores de la petición
        });
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