const config = {
  name: "meta",
  aliases: ["metai"],
  description: "Interact with Meta AI",
  usage: "<query>",
  cooldown: 3,
  permissions: [0],
  credits: "Keijo"
};

const axios = require("axios");

async function onStart({ message, args, event }) {
  const query = args.join(" ");
  if (!query) return message.reply("
I'm Meta AI, your digital companion! I'm here to assist, inform, and chat. What can I help you with today? 🤖💬 Let's get the conversation started!.");

  try {
    const response = await axios.get(`https://jer-ai.gleeze.com/meta?senderid=${encodeURIComponent(event.senderID)}&message=${encodeURIComponent(query)}`);
    const metaResponse = response.data.response || "Meta AI didn't respond.";
    return message.reply(metaResponse);
  } catch (error) {
    console.error(error);
    return message.reply("Error interacting with Meta AI. Try again later.");
  }
}

module.exports = {
  config,
  onStart
};
