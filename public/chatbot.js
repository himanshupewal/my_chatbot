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
  if (!isVisible) {
    badge.style.display = "none";
  }
}

chatIcon.addEventListener("click", toggleChat);

// Send message handler
function sendMsg() {
  const text = userMsg.value.trim();
  if (!text) return;

  addUserBubble(text);
  userMsg.value = "";

  // Show temporary "typing…" bubble
  const typingId = addTypingBubble();

  // Call backend API
  fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
    .then((res) => res.json())
    .then((data) => {
      // remove typing bubble
      removeBubble(typingId);
      addBotBubble(data.response || "I’m not sure what you mean 🤔");
    })
    .catch(() => {
      removeBubble(typingId);
      addBotBubble("⚠️ Sorry, something went wrong. Please try again.");
    });
}

// Add user bubble
function addUserBubble(text) {
  const div = document.createElement("div");
  div.className = "message user-msg";
  div.textContent = text;
  chatBody.appendChild(div);
  scrollToBottom();
}

// Add bot bubble
function addBotBubble(text) {
  const div = document.createElement("div");
  div.className = "message bot-msg";
  div.textContent = text;
  chatBody.appendChild(div);
  scrollToBottom();
}

// Add typing bubble
let bubbleCounter = 0;
function addTypingBubble() {
  const id = `typing-${bubbleCounter++}`;
  const div = document.createElement("div");
  div.className = "typing-indicator";
  div.dataset.id = id;

  // Create 3 dots
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

// Send on Enter key
userMsg.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMsg();
  }
});
