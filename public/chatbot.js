function addOptions(options) {
  const wrapper = document.createElement("div");
  wrapper.className = "bot-options";

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt.label;
    
    btn.onclick = () => {
      wrapper.remove();

      if (opt.action === "message") {
        sendPredefinedMessage(opt.value);
      } else if (opt.action === "link") {
        window.open(opt.value, "_blank");
      }
    };

    wrapper.appendChild(btn);
  });

  chatBody.appendChild(wrapper);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function sendPredefinedMessage(text) {
  addUserBubble(text);

  fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, prevIntent: lastIntent })
  })
  .then(res => res.json())
  .then(data => {
    addBotBubble(data.response);
    if (data.tag) lastIntent = data.tag;

    // Show next level options example:
    if (data.tag === "products") {
      addOptions([
        { label: "🤖 AI Chatbots", action: "link", value: "https://example.com/chatbots" },
        { label: "📈 Analytics Tools", action: "link", value: "https://example.com/analytics" },
        { label: "☁️ Cloud Systems", action: "link", value: "https://example.com/cloud" }
      ]);
    }
  });
}
