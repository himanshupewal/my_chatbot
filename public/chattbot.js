function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    input.value = '';

    showTypingIndicator();

    fetch("/api/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
        hideTypingIndicator();
        addMessage(data.response, 'bot');
    })
    .catch(() => {
        hideTypingIndicator();
        addMessage("⚠ Server offline. Try again later.", "bot");
    });
}
