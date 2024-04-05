// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const idCarrier = urlParams.get('id_carrier');
const idVehicle = urlParams.get('id_vehicle');


// Llenar el campo ID Carrier con el valor capturado
document.getElementById('id_carrier').value = idCarrier;
document.getElementById('id_vehicle').value = idVehicle;

document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Crea una instancia de FormData
    const formData = new FormData();

    formData.append('documents', document.getElementById('file1').files[0]);
    formData.append('documents', document.getElementById('file2').files[0]);
    formData.append('id_vehicle', document.getElementById('id_vehicle').value);
    formData.append('id_carrier', document.getElementById('id_carrier').value);
    // window.myAppConfig.development
    // window.myAppConfig.production
    fetch(window.myAppConfig.development + '/carrier/vehicle/loadDocuments', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Archivos subidos con éxito.');
            window.location = '../login/';
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error al subir los archivos.');
        });
});

