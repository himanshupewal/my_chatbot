const intents = require("../intents.json");

module.exports = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const text = req.body.message?.toLowerCase() || "";

  for (const item of intents.intents) {
    for (const pattern of item.patterns) {
      if (text.includes(pattern.toLowerCase())) {
        return res.status(200).json({
          response: item.responses[
            Math.floor(Math.random() * item.responses.length)
          ]
        });
      }
    }
  }

  return res.status(200).json({
    response: "Sorry, I didn’t get that 🤖"
  });
};
