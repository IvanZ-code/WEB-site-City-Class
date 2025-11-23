(async function() {
  const widget = document.getElementById('cart-widget');
  const countSpan = document.getElementById('cart-count');
  const scriptTag = document.currentScript;
  const checkAuthUrl = scriptTag.getAttribute("data-check_auth-url");
  const cartUrl = scriptTag.getAttribute("data-cart-url");

  async function updateCartCount() {
    try {
      const cartResponse = await fetch(checkAuthUrl.replace("check_auth.php", "get_user_cart.php"));
      const cartData = await cartResponse.json();

      if (cartData.cart) {
        const totalCount = cartData.cart.reduce((sum, item) => sum + item.quantity, 0);
        countSpan.textContent = `Товаров (${totalCount})`;
      } else {
        countSpan.textContent = `Товаров (0)`;
      }
    } catch (err) {
      console.error("Ошибка при обновлении количества товаров:", err);
      countSpan.textContent = `Товаров (?)`;
    }
  }

  try {
    const authResponse = await fetch(checkAuthUrl);
    const authData = await authResponse.json();

    if (authData.loggedIn) {
      widget.style.display = "block";

      widget.addEventListener("click", () => {
        window.location.href = cartUrl;
      });

      // Сразу обновляем счетчик
      await updateCartCount();

      // Подписываемся на изменения корзины
      window.addEventListener("cartUpdated", async () => {
        await updateCartCount();
      });
    } else {
      widget.style.display = "none";
    }

  } catch (err) {
    console.error("Ошибка при загрузке корзины:", err);
    widget.style.display = "none";
  }
})();
