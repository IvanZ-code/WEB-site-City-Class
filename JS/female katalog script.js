(async function() {

const scriptTag = document.currentScript;
const phpUrl = scriptTag.getAttribute('data-php-url');


const gallery = document.getElementById('female_gallery');

 try {
    const response = await fetch(phpUrl);
    const products = await response.json();

    products.forEach((product) => {
      const item = document.createElement('div');
      item.className = 'item';

      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = `${product.title.split(' ')[0]} ${product.price} руб.`;;

      const img = document.createElement('img');
      img.src = product.image_path;

      const link = document.createElement('a');
      link.href = product.href;
      link.textContent = 'Подробнее';

      item.appendChild(title);
      item.appendChild(img);
      item.appendChild(link);

      gallery.appendChild(item);
    });

    const searchInputFemale = document.getElementById('searchInputFemale');
    searchInputFemale.addEventListener('input', () => {
      const query = searchInputFemale.value.toLowerCase().trim();
      document.querySelectorAll('#female_gallery .item').forEach((item, index) => {
        const titleText = products[index].title.toLowerCase();
        item.style.display = titleText.startsWith(query) ? '' : 'none';
      });
    });

  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
})();

