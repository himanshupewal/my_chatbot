// Grab elements
const chatWindow = document.getElementById("chatWindow");
const chatIcon = document.getElementById("chatIcon");
const badge = document.getElementById("badge");
const chatBody = document.getElementById("chatBody");
const userMsg = document.getElementById("userMsg");

// Open / close chat
function toggleChat() {
  chatWindow.style.display =
    chatWindow.style.display === "flex" ? "none" : "flex";
  badge.style.display = "none";
}

chatIcon.addEventListener("click", toggleChat);

// Send message handler
function sendMsg() {
  const text = userMsg.value.trim();
  if (!text) return;

  addUserBubble(text);
  userMsg.value = "";

  // Show temporary "typing…" bubble (optional)
  const typingId = addBotBubble("Typing…");

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
  div.className = "user-msg";
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Add bot bubble – returns an id so we can remove it if needed
let bubbleCounter = 0;
function addBotBubble(text) {
  const id = `bot-bubble-${bubbleCounter++}`;
  const div = document.createElement("div");
  div.className = "bot-msg";
  div.textContent = text;
  div.dataset.id = id;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
  return id;
}

function removeBubble(id) {
  const bubbles = chatBody.querySelectorAll(".bot-msg");
  bubbles.forEach((b) => {
    if (b.dataset.id === id) b.remove();
  });
}

// Optional: send on Enter key
userMsg.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMsg();
  }
});
