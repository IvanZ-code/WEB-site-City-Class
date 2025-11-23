(function() {
const scriptTag = document.currentScript;
const productId = scriptTag.getAttribute("data-id");
const check_authUrl = scriptTag.getAttribute("data-check_auth-url");

document.addEventListener("DOMContentLoaded", async () => {
  
  const productContainer = document.getElementById("product");
  const addToCartBtn = document.getElementById("add-to-cart-btn");

  if (!productId) {
    productContainer.innerHTML = "<p>Ошибка: не задан ID товара.</p>";
    return;
  }

  try {

      const authResponse = await fetch("../../../PHP/check_auth.php");
      const authData = await authResponse.json();

      const isAuthenticated = authData.loggedIn === true;
      const username = authData.username || null;

      const response = await fetch(`../../../PHP/get_product_by_id.php?id=${productId}`);
      const product = await response.json();

      if (product.error) {
        productContainer.innerHTML = `<p>${product.error}</p>`;
        return;
      }

      const formattedFullDescription = product.full_description.trim();

      productContainer.innerHTML = `
        <img src="../../${product.image_path}" style="width:200px; margin-top:16px; margin-right:50px;">
        <div>
            <h2>${product.title}</h2><div id="short" ><p>${product.short_description}${product.price} руб.</p></div><h2>Характеристики:</h2><div id="info"><p style="margin-top: 0px;">${formattedFullDescription}</p></div>
        </div>
      `;


      if (isAuthenticated) {
          addToCartBtn.disabled = true; // пока не узнаем статус
          addToCartBtn.textContent = "Загрузка...";

          try {
              // Получаем корзину пользователя с сервера
              const cartResponse = await fetch("../../../PHP/get_user_cart.php");
              const cartData = await cartResponse.json();
              const userCart = cartData.cart || [];

              const alreadyAdded = userCart.some(p => p.product_id === product.id);

              if (alreadyAdded) {
                  addToCartBtn.textContent = "Уже в корзине";
                  addToCartBtn.disabled = true;
              } else {
                    addToCartBtn.textContent = "В корзину";
                    addToCartBtn.disabled = false;
              }

              addToCartBtn.addEventListener("click", async () => {
                  const response = await fetch("../../../PHP/add_product_to_cart.php", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ product_id: product.id })
                  });

                  const result = await response.json();

                  if (result.error === "not_authenticated") {
                      alert("Войдите в аккаунт!");
                      return;
                  }

                  if (result.status === "already_exists") {
                      addToCartBtn.textContent = "Уже в корзине";
                      addToCartBtn.disabled = true;
                      alert("Этот товар уже в корзине.");
                      return;
                  }

                  if (result.status === "added") {
                      addToCartBtn.textContent = "Уже в корзине";
                      addToCartBtn.disabled = true;
                      alert("Товар добавлен в корзину!");
                      window.dispatchEvent(new Event("cartUpdated"));
                      return;
                  }

                  alert("Ошибка добавления.");
              });

            } catch (err) {
                  addToCartBtn.textContent = "Ошибка";
                  addToCartBtn.disabled = true;
            }

      } else {
                addToCartBtn.textContent = "Войдите, чтобы добавить в корзину";
                addToCartBtn.disabled = true;
          }


      
  } catch (err) {
      productContainer.innerHTML = `<p>Ошибка загрузки данных: ${err}</p>`;
      addToCartBtn.disabled = true;
    }
  

});

})();