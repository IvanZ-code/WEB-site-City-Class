(function() {
const scriptTag = document.currentScript;
const txtUrl = scriptTag.getAttribute('data-txt-url');

document.addEventListener('DOMContentLoaded', () => {



document.querySelectorAll('.privacy-link').forEach(link => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();

    
    const modal = document.getElementById('privacy-modal');
    const policyText = document.getElementById('policy-text');

   
    policyText.textContent = 'Загрузка политики конфиденциальности...';
    modal.style.display = 'block';

    try {
      const response = await fetch(txtUrl);
      if (!response.ok) throw new Error('Ошибка загрузки файла');

      const text = await response.text();
      policyText.textContent = text;
    } catch (err) {
      policyText.textContent = 'Не удалось загрузить политику. Попробуйте позже.';
    }
  });
});


document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('privacy-modal').style.display = 'none';
});

});
})();