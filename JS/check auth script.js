(function() {
    const authContainer = document.getElementById('auth_container');

    const scriptTag = document.currentScript;
    const logoutUrl = scriptTag.getAttribute('data-logout-url');
    const check_authUrl = scriptTag.getAttribute('data-check_auth-url');
    const avatarUrl = scriptTag.getAttribute('data-avatar-url');


    const renderLogoutButton = (username) => {
       const clientUsername = username ? username : 'Пользователь';

       
       authContainer.innerHTML = '';

       const userInfo = document.createElement('div');
       userInfo.classList.add('user-info');

       const avatar = document.createElement('img');
       avatar.src = avatarUrl;  
       avatar.alt = 'Аватар пользователя';
       avatar.classList.add('user-avatar');

       const web_username = document.createElement('p');
       web_username.textContent = clientUsername;
       web_username.classList.add('user-name');
       
       userInfo.appendChild(avatar);
       userInfo.appendChild(web_username);

       const logoutBtn = document.createElement('button');
       logoutBtn.textContent = 'Выйти';
       logoutBtn.id = 'logoutButton';
     
       authContainer.appendChild(userInfo);
       authContainer.appendChild(logoutBtn);

       
       logoutBtn.addEventListener('click', () => {
        if (!confirm("Вы уверены, что хотите выйти?")) return;
        fetch(logoutUrl, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    localStorage.removeItem('cart');
                    location.reload(); 
                }
            })
            .catch(err => console.error(err));
       });
    };

//проверка, авторизован ли пользователь при загрузке страницы
fetch(check_authUrl)
    .then(res => res.json())
    .then(data => {
        if (data.loggedIn) {
            renderLogoutButton(data.username);
        }
    });
})();