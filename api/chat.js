const intents = require("../intents.json");

module.exports = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const message = (req.body.message || "").toLowerCase();

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  // Simple pattern matching
  for (const intent of intents.intents) {
    for (const pattern of intent.patterns) {
      if (message.includes(pattern.toLowerCase())) {
        const responses = intent.responses;
        const reply = responses[Math.floor(Math.random() * responses.length)];
        return res.status(200).json({ response: reply, tag: intent.tag });
      }
    }
  }

  // Fallback if nothing matched
  return res.status(200).json({
    response: "Hmm, I'm not sure I understand 🤔. Could you rephrase that?"
  });
};
