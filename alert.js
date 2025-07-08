if (!sessionStorage.getItem("alerted")) {
  const payload = {
    chat_id: "6527375296",
    text: `🌾 [Farmer expense App]\n🚜 Someone just opened your site!\n🕒 ${new Date().toLocaleString()}\n📱 ${navigator.userAgent}`
  };

  fetch("https://api.telegram.org/bot8116275358:AAGwL9HeGISFXFu8XkhmuE7GLEnWKT83f6A/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  sessionStorage.setItem("alerted", "yes");
}
