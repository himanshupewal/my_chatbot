const fs = require("fs");
const path = require("path");

// Load intents.json from file system
const intentsPath = path.join(__dirname, "../intents.json");
const intents = JSON.parse(fs.readFileSync(intentsPath));

module.exports = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST Allowed" });
  }

  const message = (req.body.message || "").toLowerCase();

  // Iterate through each intent & match patterns
  for (const intent of intents.intents) {
    for (const pattern of intent.patterns) {
      if (message.includes(pattern.toLowerCase())) {
        const responses = intent.responses;
        const reply =
          responses[Math.floor(Math.random() * responses.length)];

        return res.status(200).json({
          response: reply,
          intent: intent.tag
        });
      }
    }
  }

  // Default fallback response when nothing matches
  return res.status(200).json({
    response:
      "I'm not sure I understand 🤔. Can you provide more details?",
    intent: "unknown"
  });
};
