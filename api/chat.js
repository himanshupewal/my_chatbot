let isOpen = false;

// Toggle Chat Window
function toggleChat() {
    const chatWindow = document.getElementById("chatWindow");
    const chatIcon = document.getElementById("chatIcon");
    const badge = document.getElementById("notificationBadge");

    isOpen = !isOpen;

    if (isOpen) {
        chatWindow.classList.add("open");
        chatIcon.classList.add("active");
        badge.style.display = "none";
        scrollToBottom();
    } else {
        chatWindow.classList.remove("open");
        chatIcon.classList.remove("active");
    }
}

// Send Message when Pressing Enter
function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}

// Send User Message → API → Show Bot Response
function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "user");
    input.value = "";

    showTypingIndicator();

    fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
        hideTypingIndicator();
        addMessage(data.response, "bot");
    })
    .catch(() => {
        hideTypingIndicator();
        addMessage("⚠ Server Error. Try again!", "bot");
    });
}

// Add message to UI
function addMessage(text, sender) {
    const messagesContainer = document.getElementById("chatMessages");

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;

    const timeString = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    messageDiv.innerHTML = `
        <div class="message-avatar">${sender === "bot" ? "AI" : "You"}</div>
        <div class="message-content">
            <div class="message-bubble">${text}</div>
            <div class="message-time">${timeString}</div>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// Typing animation handlers
function showTypingIndicator() {
    document.getElementById("typingIndicator").classList.add("active");
    scrollToBottom();
}

function hideTypingIndicator() {
    document.getElementById("typingIndicator").classList.remove("active");
}

// Scroll to latest message
function scrollToBottom() {
    const messagesContainer = document.getElementById("chatMessages");
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// Show notification badge if not opened in 3s
setTimeout(() => {
    if (!isOpen) {
        document.getElementById("notificationBadge").style.display = "flex";
    }
}, 3000);
