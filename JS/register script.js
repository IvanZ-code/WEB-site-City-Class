(function() {
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const fullname = document.getElementById('fullname').value.trim();
    const agree = document.getElementById('agree').checked;

    const message = document.getElementById('message');

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      message.textContent = 'Пароли не совпадают.';
      message.style.color = 'red';
      return;
    }

    // Проверка формата email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      message.textContent = 'Некорректный формат e-mail.';
      message.style.color = 'red';
      return;
    }

    // Проверка формата телефона
    const phonePattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (!phonePattern.test(phone)) {
      message.textContent = 'Некорректный формат телефона.\nПример: +7 (999) 123-45-67';
      message.style.color = 'red';
      return;
    }

    // Проверка согласия
    if (!agree) {
      message.textContent = 'Необходимо дать согласие на обработку персональных данных.';
      message.style.color = 'red';
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('fullname', fullname);

    try {
      const response = await fetch('../PHP/register.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      message.textContent = result.message;
      message.style.color = result.status === 'success' ? 'green' : 'red';
    } catch (err) {
      message.textContent = 'Ошибка соединения с сервером.';
      message.style.color = 'red';
    }
  });
})();
