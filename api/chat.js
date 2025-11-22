import intents from "../intents.json" assert { type: "json" };

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const text = req.body.message.toLowerCase();

  for (const item of intents.intents) {
    for (const p of item.patterns) {
      if (text.includes(p.toLowerCase())) {
        return res.status(200).json({
          response: item.responses[
            Math.floor(Math.random() * item.responses.length)
          ]
        });
      }
    }
  }

  res.status(200).json({ response: "Sorry, I didn’t get that 🤖" });
}
