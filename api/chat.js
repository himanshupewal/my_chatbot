const fs = require("fs");
const path = require("path");

const intentsPath = path.join(__dirname, "../intents.json");
const intents = JSON.parse(fs.readFileSync(intentsPath));

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
      
      let responseObj = {
        response: intent.responses[0],
        tag: intent.tag
      };

      if (intent.options) responseObj.options = intent.options;
      if (intent.followUp) responseObj.followUp = intent.followUp;

      return res.status(200).json(responseObj);
    }
  }

  return res.status(200).json({
    response: "I'm not sure I understand 🤔. Can you provide more details?",
    tag: "fallback"
  });
};
