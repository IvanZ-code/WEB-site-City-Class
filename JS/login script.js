(function() {
const messageDiv = document.getElementById('message');
       
const form = document.getElementById('loginForm');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);

    fetch('../PHP/login.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            window.location.href = "../index.html";
            messageDiv.textContent = '';
        } else {
            messageDiv.textContent = data.message;
        }
    })
    .catch(err => {
        messageDiv.textContent = "Ошибка сервера. Попробуйте позже.";
        console.error(err);
    });
});

})();