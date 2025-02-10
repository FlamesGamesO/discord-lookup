// api/lookup.js
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId parameter" });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) {
    return res.status(500).json({ error: "BOT_TOKEN environment variable is not set" });
  }

  try {
    const discordResponse = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
      },
    });
    if (!discordResponse.ok) {
      const errText = await discordResponse.text();
      return res.status(discordResponse.status).json({ error: errText });
    }
    const data = await discordResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching from Discord API:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
