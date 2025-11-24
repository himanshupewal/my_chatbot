// Grab elements
const chatWindow = document.getElementById("chatWindow");
const chatIcon = document.getElementById("chatIcon");
const badge = document.getElementById("badge");
const chatBody = document.getElementById("chatBody");
const userMsg = document.getElementById("userMsg");

// Open / close chat
function toggleChat() {
  const isVisible = chatWindow.style.display === "flex";
  chatWindow.style.display = isVisible ? "none" : "flex";
  if (!isVisible) badge.style.display = "none";
}

chatIcon.addEventListener("click", toggleChat);

// Send message handler
function sendMsg() {
  const text = userMsg.value.trim();
  if (!text) return;

  addUserBubble(text);
  userMsg.value = "";

  const typingId = addTypingBubble();

  fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
    .then(res => res.json())
    .then(data => {
      removeBubble(typingId);

      // Main bot response
      addBotBubble(data.response);

      // ⬇️ Handle clickable options if present 👇
      if (data.options && Array.isArray(data.options)) {
        showBotOptions(data.options);
      }

      // ⬇️ Handle follow-up message if backend sends it
      if (data.followUp) {
        setTimeout(() => addBotBubble(data.followUp), 800);
      }
    })
    .catch(() => {
      removeBubble(typingId);
      addBotBubble("⚠️ Something went wrong! Try again.");
    });
}

// Message bubbles
function addUserBubble(text) {
  const bubble = document.createElement("div");
  bubble.className = "user-msg";
  bubble.textContent = text;
  chatBody.appendChild(bubble);
  scrollToBottom();
}

function addBotBubble(text) {
  const bubble = document.createElement("div");
  bubble.className = "bot-msg";
  bubble.textContent = text;
  chatBody.appendChild(bubble);
  scrollToBottom();
}

// Clickable product buttons 👇
function showBotOptions(options) {
  const container = document.createElement("div");
  container.className = "bot-options";

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt.label;
    btn.onclick = () => window.open(opt.url, "_blank");
    container.appendChild(btn);
  });

  chatBody.appendChild(container);
  scrollToBottom();
}

// Typing indicator
let bubbleCounter = 0;
function addTypingBubble() {
  const id = `typing-${bubbleCounter++}`;
  const div = document.createElement("div");
  div.className = "typing-indicator";
  div.dataset.id = id;

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.className = "typing-dot";
    div.appendChild(dot);
  }

  chatBody.appendChild(div);
  scrollToBottom();
  return id;
}

function removeBubble(id) {
  const bubble = chatBody.querySelector(`[data-id="${id}"]`);
  if (bubble) bubble.remove();
}

function scrollToBottom() {
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Enter key send
userMsg.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMsg();
  }
});