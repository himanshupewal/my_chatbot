let isOpen = false;

function toggleChat() {
    const win = document.getElementById("chatWindow");
    isOpen = !isOpen;
    win.classList.toggle("open");
}

function handleKeyPress(e) {
    if (e.key === "Enter") sendMessage();
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, "user");
    input.value = "";

    showTyping();

    fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
    })
    .then(res => res.json())
    .then(data => {
        hideTyping();
        addMessage(data.response, "bot");
    })
    .catch(() => {
        hideTyping();
        addMessage("Server error 😢", "bot");
    });
}

function addMessage(text, sender) {
    const container = document.getElementById("chatMessages");
    const el = document.createElement("div");
    el.className = `message ${sender}`;

    el.innerHTML = `
        <div class="message-avatar">${sender === "bot" ? "AI" : "You"}</div>
        <div class="message-content">
            <div class="message-bubble">${text}</div>
        </div>
    `;

    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
}

function showTyping() {
    document.getElementById("typingIndicator").classList.add("active");
}

function hideTyping() {
    document.getElementById("typingIndicator").classList.remove("active");
}
