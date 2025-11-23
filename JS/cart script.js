(async function () {
  const cartContainer = document.getElementById("cart-items");

  try {
    // 1. Проверка авторизации
    const authResponse = await fetch("../PHP/check_auth.php");
    const authData = await authResponse.json();

    if (!authData.loggedIn) {
      cartContainer.innerHTML = `
        <p>Пожалуйста, <a href="../Pages/Login.html">войдите</a>, чтобы просмотреть корзину.</p>
      `;
      return;
    }

    const username = authData.username;

    // 2. Получаем корзину с сервера
    const cartResponse = await fetch("../PHP/get_user_cart.php");
    const cartData = await cartResponse.json();

    if (!cartData.cart || cartData.cart.length === 0) {
      cartContainer.innerHTML = "<p>Ваша корзина пуста.</p>";
      return;
    }

    const ids = cartData.cart.map(item => item.product_id);

    // 3. Получаем информацию о товарах
    const productsResponse = await fetch(`../PHP/get_products_by_ids.php?ids=${ids.join(',')}`);
    const productsFromDb = await productsResponse.json();

    const groupedCart = {};
    cartData.cart.forEach(item => {
      const prod = productsFromDb.find(p => p.id == item.product_id);
      if (!prod) return;
      groupedCart[prod.id] = { ...prod, quantity: item.quantity };
    });

    const list = document.createElement("div");
    list.className = "cart-list";

    const totalBlock = document.createElement("div");
    totalBlock.className = "cart-total";

    // Функция пересчёта итого
    function updateTotal() {
      const total = Object.values(groupedCart).reduce((sum, p) => sum + p.price * p.quantity, 0);
      totalBlock.innerHTML = `<strong>Итого: ${total} руб.</strong>`;
      if (Object.keys(groupedCart).length === 0) {
        cartContainer.innerHTML = "<p>Ваша корзина пуста.</p>";
      }
    }

    // 4. Отрисовка товаров
    Object.values(groupedCart).forEach(product => {
      const item = document.createElement("div");
      item.className = "cart-item";

      const imageSrc = product.image_path || "../Pictures/no-image.png";

      item.innerHTML = `
        <div class="cart-item-left">
          <img src="${imageSrc}" alt="${product.title}" class="cart-image">
        </div>
        <div class="cart-item-right">
          <span class="cart-title">${product.title}</span>
          <span class="cart-price">${product.price} руб.</span>
          <div class="quantity-controls">
            <button class="quantity-btn minus">−</button>
            <span class="quantity-count">${product.quantity}</span>
            <button class="quantity-btn plus">+</button>
          </div>
        </div>
      `;

      const minusBtn = item.querySelector(".minus");
      const plusBtn = item.querySelector(".plus");
      const quantityCount = item.querySelector(".quantity-count");

      plusBtn.addEventListener("click", async () => {
          product.quantity++;
          quantityCount.textContent = product.quantity;

          // Отправка на сервер
          await fetch("../PHP/update_user_cart.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ product_id: product.id, quantity: product.quantity })
          });

      updateTotal();
      window.dispatchEvent(new Event("cartUpdated"));
      });

      minusBtn.addEventListener("click", async () => {
          if (product.quantity === 1) {
                if (confirm("Вы уверены, что хотите удалить этот товар из корзины?")) {
                    await fetch("../PHP/remove_product_from_cart.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `product_id=${product.id}`
                    });

                    delete groupedCart[product.id];
                    item.remove();
                    updateTotal();
                    window.dispatchEvent(new Event("cartUpdated"));
                }
          } else {
                product.quantity--;
                quantityCount.textContent = product.quantity;

    
                await fetch("../PHP/update_user_cart.php", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ product_id: product.id, quantity: product.quantity })
                });

                updateTotal();
                window.dispatchEvent(new Event("cartUpdated"));
          }
      });


      list.appendChild(item);
    });

    // 5. Очистить корзину
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Очистить корзину";
    clearBtn.className = "clear-cart-btn";
    clearBtn.addEventListener("click", async () => {
      if (confirm("Вы уверены, что хотите очистить корзину?")) {
        // Удаляем все товары
        await Promise.all(Object.keys(groupedCart).map(id =>
          fetch("../PHP/remove_product_from_cart.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `product_id=${id}`
          })
        ));
        cartContainer.innerHTML = "<p>Корзина очищена.</p>";
        window.dispatchEvent(new Event("cartUpdated"));
      }
    });

    const checkoutBtn = document.createElement("button");
    checkoutBtn.className = "checkout-btn";
    checkoutBtn.textContent = "Оформить заказ";

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "btns-container";
    buttonsContainer.appendChild(clearBtn);
    buttonsContainer.appendChild(checkoutBtn);

    cartContainer.appendChild(list);
    cartContainer.appendChild(totalBlock);
    cartContainer.appendChild(buttonsContainer);

    updateTotal();

  } catch (err) {
    cartContainer.innerHTML = `<p>Ошибка загрузки корзины: ${err}</p>`;
  }
})();
