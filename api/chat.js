const fs = require("fs");
const path = require("path");

const intentsPath = path.join(__dirname, "../intents.json");
const intents = JSON.parse(fs.readFileSync(intentsPath));

// Small NLP intent matcher
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
    return res.status(200).json({ response: "Please type something 🙂" });
  }

  for (const intent of intents.intents) {
    if (matchIntent(message, intent.patterns)) {

      // ✔ Special case: Intents that have buttons + follow up
      if (intent.options && intent.responses.length > 1) {
        return res.status(200).json({
          response: intent.responses[0],   // main message
          options: intent.options,        // clickable options
          followUp: intent.responses[1],  // message after options
          tag: intent.tag
        });
      }

      // ✔ If intent has only options but no follow-up
      if (intent.options) {
        return res.status(200).json({
          response: intent.responses[0],
          options: intent.options,
          tag: intent.tag
        });
      }

      // ✔ Normal Intent → random text response only
      const reply = intent.responses[
        Math.floor(Math.random() * intent.responses.length)
      ];

      return res.status(200).json({
        response: reply,
        tag: intent.tag
      });
    }
  }

  // ❌ No intent matched → fallback
  return res.status(200).json({
    response: "I'm not sure I understand 🤔. Can you provide more details?",
    tag: "fallback"
  });
};
