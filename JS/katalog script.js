(async function() {
  const scriptTag = document.currentScript;
  const phpUrl = scriptTag.getAttribute('data-php-url');
  const gallery = document.getElementById('gallery');
  const searchInput = document.getElementById('searchInput');

  if (!phpUrl || !gallery) {
    console.error('Не найден URL PHP или элемент #gallery');
    return;
  }

  try {
    const response = await fetch(phpUrl);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const products = await response.json();

    
    function renderProducts(list) {
      gallery.innerHTML = ''; 

      list.forEach((product) => {
        const item = document.createElement('div');
        item.className = 'item';

        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = `${product.title.split(' ')[0]} ${product.price} руб.`;

        const img = document.createElement('img');
        img.src = product.image_path;
        img.alt = product.title;

        const link = document.createElement('a');
        link.href = product.href;
        link.textContent = 'Подробнее';

        item.append(title, img, link);
        gallery.appendChild(item);
      });
    }

    renderProducts(products);

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();

        if (query === '') {   
          renderProducts(products);
        } else {       
          const filtered = products.filter(p =>
            p.title.toLowerCase().startsWith(query)
          );
          renderProducts(filtered);
        }
      });
    }

  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
})();
