// Toggle Chat Visibility
const windowEl = document.getElementById("chatWindow");
const iconEl = document.getElementById("chatIcon");
const badgeEl = document.getElementById("badge");
const bodyEl = document.getElementById("chatBody");
const inputEl = document.getElementById("userMsg");

iconEl.onclick = toggleChat;

function toggleChat() {
    windowEl.style.display = windowEl.style.display === "flex" ? "none" : "flex";
    badgeEl.style.display = "none";
}

// Display message in UI only (no backend yet)
function sendMsg(){
    const text = inputEl.value.trim();
    if(!text) return;
    addUserMsg(text);
    inputEl.value = "";
}

function addUserMsg(text){
    const msg = document.createElement("div");
    msg.className = "user-msg";
    msg.innerText = text;
    bodyEl.appendChild(msg);
    bodyEl.scrollTop = bodyEl.scrollHeight;
}
