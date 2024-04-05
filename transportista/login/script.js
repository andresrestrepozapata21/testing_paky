document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = {
        email_carrier: document.getElementById('email').value,
        password_carrier: document.getElementById('password').value
    };
    // window.myAppConfig.development
    // window.myAppConfig.production
    fetch(window.myAppConfig.development + '/carrier/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('login éxitoso.');
            const idCarrier = data.data[0].id_carrier;
            const token = data.token;
            window.location = '../master/?id=' + idCarrier + '&token=' + token;
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error con el login.');
        });
});

