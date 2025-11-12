(function() {
const slides = document.querySelectorAll('.slider img');
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
})();