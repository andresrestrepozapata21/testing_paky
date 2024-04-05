document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = {
        email_ru: document.getElementById('email').value,
        password_ru: document.getElementById('password').value
    };
    // window.myAppConfig.development
    // window.myAppConfig.production
    fetch(window.myAppConfig.development + '/routerUser/login', {
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
            const id_ru = data.data[0].id_ru;
            const token = data.token;
            window.location = '../master/?id=' + id_ru + '&token=' + token;
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error con el login.');
        });
});

