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
       
        addToCartBtn.disabled = false;
          addToCartBtn.textContent = "В корзину";
          let cartData = JSON.parse(localStorage.getItem("cart")) || {};
          const userCart = cartData[username] || [];

          const alreadyAdded = userCart.some(p => p.id === product.id);

          if (alreadyAdded) {
            addToCartBtn.textContent = "Уже в корзине";
            addToCartBtn.disabled = true;
          } else {
            addToCartBtn.textContent = "В корзину";
          }

          addToCartBtn.addEventListener("click", () => {
            
            cartData = JSON.parse(localStorage.getItem("cart")) || {};
            if (!cartData[username]) cartData[username] = [];

            const alreadyAdded = cartData[username].some(p => p.id === product.id);
            if (!alreadyAdded) {
              cartData[username].push({ id: product.id, quantity: 1 });
              localStorage.setItem("cart", JSON.stringify(cartData));
              window.dispatchEvent(new Event("cartUpdated"));

              addToCartBtn.textContent = "Уже в корзине";
              addToCartBtn.disabled = true;

              alert("Товар добавлен в корзину!");
            } else {
              addToCartBtn.textContent = "Уже в корзине";
              addToCartBtn.disabled = true;
              alert("Этот товар уже в корзине.");
            }
          });
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