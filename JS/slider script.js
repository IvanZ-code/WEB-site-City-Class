(function() {
  const sliderNumber = 1;
  const sliderContainerId = 'slider';

  // Функция инициализации слайдера
  function initSlider() {
    const slides = document.querySelectorAll('.slider img');

    if (slides.length === 0) return; 

    let current = 0;

    slides.forEach(slide => {
      slide.addEventListener('click', () => {
        if (slide.classList.contains('active')) {
          const url = slide.dataset.link;
          if (url) {
            window.open(url, '_blank'); 
          }
        }
      });
    });

    function showNextSlide() {
      const total = slides.length;
      if (total === 0) return;

      const next = (current + 1) % total;
      const prev = (current - 1 + total) % total;

      slides[current].classList.remove('active');
      slides[current].classList.add('prev');

      slides[next].classList.remove('next');
      slides[next].classList.add('active');

      slides[prev].classList.add('no-transition');

      requestAnimationFrame(() => {
        slides[prev].classList.remove('prev', 'active');
        slides[prev].classList.add('next');
        void slides[prev].offsetWidth;
        slides[prev].classList.remove('no-transition');
      });

      current = next;
    }

    setInterval(showNextSlide, 5000);
  }


  fetch(`PHP/get_slider_images.php?slider=${sliderNumber}`)
    .then(res => res.json())
    .then(slidesData => {
      const slider = document.getElementById(sliderContainerId);
      if (!slider) return console.error(`Контейнер #${sliderContainerId} не найден`);

      slidesData.forEach((slide, index) => {
        const img = document.createElement('img');
        img.src = slide.image_data; // base64 из PHP
        img.dataset.link = slide.link || ''; // если есть ссылка
        if(index === 0) img.classList.add('active');
        else if(index === 1) img.classList.add('next');
        else if(index === slidesData.length - 1) img.classList.add('prev');

        slider.appendChild(img);
      });

      initSlider();
    })
    .catch(err => console.error('Ошибка загрузки слайдов:', err));
})();
