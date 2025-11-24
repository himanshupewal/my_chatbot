const fs = require("fs");
const path = require("path");

const intentsPath = path.join(__dirname, "../intents.json");
const intents = JSON.parse(fs.readFileSync(intentsPath));

// Helper function to detect intent
function matchIntent(message, patterns) {
  const msgWords = message.split(/\s+/);
  return patterns.some(pattern => {
    const patternWords = pattern.toLowerCase().split(/\s+/);
    return patternWords.every(word =>
      msgWords.some(msgWord => msgWord.includes(word))
    );
  });
}

module.exports = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST Allowed" });
  }

  const message = (req.body.message || "").toLowerCase().trim();
  if (!message) {
    return res.status(200).json({ response: "Please type something " });
  }

  for (const intent of intents.intents) {
    if (matchIntent(message, intent.patterns)) {

      // Special handling for products intent (send response + options + follow-up)
      if (intent.tag === "products") {
        return res.status(200).json({
  response: intent.responses[0],
  options: intent.options,
  followUp: {
    text: intent.responses[1],
    "options": [
    { "label": "✉️ Email Us", "url": "mailto:contact@mythoquantum.com" },
    { "label": "💬 WhatsApp", "url": "https://wa.me/91XXXXXXXXXX" }
  ]
  },
  tag: intent.tag
});
      }

      if (intent.tag === "industry") {
        return res.status(200).json({
  response: intent.responses[0],
  options: intent.options,
  followUp: {
    text: intent.responses[1],
    "options": [
    { "label": "✉️ Email Us", "url": "mailto:contact@mythoquantum.com" },
    { "label": "💬 WhatsApp", "url": "https://wa.me/91XXXXXXXXXX" }
  ]
  },
  tag: intent.tag
});
      }

      // Normal intents → random response
      const reply =
        intent.responses[Math.floor(Math.random() * intent.responses.length)];

      return res.status(200).json({ response: reply, tag: intent.tag });
    }
  }

  // No match found → fallback
  return res.status(200).json({
    response: "I'm not sure I understand 🤔. Can you provide more details?",
    tag: "fallback"
  });
};
