export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { cart } = req.body;

  if (!cart || !Array.isArray(cart)) {
    return res.status(400).json({ message: "Invalid cart data" });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderText = cart
    .map((item) => `${item.emoji || ""} ${item.name} x${item.quantity}`)
    .join("\n");

  const message = `
📥 سفارش جدید:

${orderText}

💰 مجموع: ${total.toLocaleString()} تومان
🕒 زمان: ${new Date().toLocaleString("fa-IR")}
`;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  try {
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      }
    );

    if (!telegramRes.ok) {
      return res.status(500).json({ message: "Telegram API error" });
    }

    return res.status(200).json({ message: "Order sent" });
  } catch (error) {
    console.error("Telegram error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
