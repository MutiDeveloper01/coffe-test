let cart = [];

function addToCart(name, price, emoji) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, emoji, quantity: 1 });
  }
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cart-list");
  const totalEl = document.getElementById("total");
  list.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.emoji} ${item.name} x${item.quantity}`;
    list.appendChild(li);
    total += item.price * item.quantity;
  });

  totalEl.textContent = `💰 مجموع: ${total.toLocaleString()} تومان`;
}

function checkout() {
  if (cart.length === 0) {
    alert("سبد خرید خالی است!");
    return;
  }

  fetch("/api/send-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cart }),
  })
    .then((res) => {
      if (res.ok) {
        alert("✅ سفارش شما ارسال شد!");
        cart = [];
        renderCart();
      } else {
        alert("❌ خطا در ارسال سفارش.");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("❌ خطای ارتباط با سرور.");
    });
}
