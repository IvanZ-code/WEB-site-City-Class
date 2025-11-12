(async function() {
  const widget = document.getElementById('cart-widget');
  const countSpan = document.getElementById('cart-count');
  const scriptTag = document.currentScript;
  const checkAuthUrl = scriptTag.getAttribute("data-check_auth-url");
  const cartUrl = scriptTag.getAttribute("data-cart-url");


  try {
    const authResponse = await fetch(checkAuthUrl);
    const authData = await authResponse.json();

    if (authData.loggedIn) {
      const username = authData.username;
      widget.style.display = "block";

      widget.addEventListener("click", () => {
      window.location.href = cartUrl;
      });

      const cartData = JSON.parse(localStorage.getItem('cart')) || {};
      const userCart = cartData[username] || [];
      const totalCount = userCart.reduce((sum, item) => sum + item.quantity, 0);
      countSpan.textContent = `Товаров (${totalCount})`;

      window.addEventListener("cartUpdated", () => {
        const updated = JSON.parse(localStorage.getItem('cart')) || {};
        const current = updated[username] || [];
        const totalCount = current.reduce((sum, item) => sum + item.quantity, 0);
        countSpan.textContent = `Товаров (${totalCount})`;
      });
    } else {
      widget.style.display = "none";
    }

  } catch (err) {
    console.error("Ошибка при загрузке корзины:", err);
  }
})();
