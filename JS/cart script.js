(async function () {
  const cartContainer = document.getElementById("cart-items");

  try {
    
    const authResponse = await fetch("../PHP/check_auth.php");
    const authData = await authResponse.json();

    if (!authData.loggedIn) {
      cartContainer.innerHTML = `
        <p>Пожалуйста, <a href="../Pages/Login.html">войдите</a>, чтобы просмотреть корзину.</p>
      `;
      return;
    }

    const username = authData.username;
    const cartData = JSON.parse(localStorage.getItem("cart")) || {};
    const userCart = cartData[username] || [];

    
    if (userCart.length === 0) {
      cartContainer.innerHTML = "<p>Ваша корзина пуста.</p>";
      return;
    }

    const ids = [...new Set(userCart.map(item => item.id))];

    const response = await fetch(`../PHP/get_products_by_ids.php?ids=${ids.join(',')}`);
    const productsFromDb = await response.json();

    const groupedCart = {};
    console.log(userCart);
    userCart.forEach((product) => {
      const prod = productsFromDb.find(p => p.id == product.id);
      if (!prod) return;
      groupedCart[prod.id] = { ...prod, quantity: product.quantity || 1};
    });

    const list = document.createElement("div");
    list.className = "cart-list";

    const totalBlock = document.createElement("div");
    totalBlock.className = "cart-total";

    
    function updateStorageAndTotal() {
      const newCart = [];
      Object.values(groupedCart).forEach((p) => {
        newCart.push({ id: p.id, quantity: p.quantity });
      });
      cartData[username] = newCart;
      localStorage.setItem("cart", JSON.stringify(cartData));
      window.dispatchEvent(new Event("cartUpdated"));

      const total = Object.values(groupedCart).reduce((sum, p) => sum + p.price * p.quantity, 0);
      totalBlock.innerHTML = `<strong>Итого: ${total} руб.</strong>`;

      if (newCart.length === 0) {
        cartContainer.innerHTML = "<p>Ваша корзина пуста.</p>";
      }
    }

    Object.values(groupedCart).forEach((product) => {
      const item = document.createElement("div");
      item.className = "cart-item";

      const imageSrc = product.image_path ? `${product.image_path}` : "../Pictures/no-image.png";

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

      plusBtn.addEventListener("click", () => {
        product.quantity++;
        quantityCount.textContent = product.quantity;
        updateStorageAndTotal();
      });

      minusBtn.addEventListener("click", () => {
        if(product.quantity === 1) {
          if(confirm("Вы уверены, что хотите удалить этот товар из корзины?"))
          {
            delete groupedCart[product.id];
            item.remove();
            updateStorageAndTotal();
          }
        } else {
          product.quantity--;
          quantityCount.textContent = product.quantity;
          updateStorageAndTotal();
        }
      });

      list.appendChild(item);
    });

    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Очистить корзину";
    clearBtn.className = "clear-cart-btn";
    clearBtn.addEventListener("click", () => {
      if (confirm("Вы уверены, что хотите очистить корзину?")) {
        delete cartData[username];
        localStorage.setItem("cart", JSON.stringify(cartData));
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

    updateStorageAndTotal();
  } catch (err) {
    cartContainer.innerHTML = `<p>Ошибка загрузки корзины: ${err}</p>`;
  }
})();
