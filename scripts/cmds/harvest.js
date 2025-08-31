module.exports = {
  config: {
    name: "harvest",
    version: "1.0",
    author: "ChatGPT",
    countDown: 0, // cooldown 0 seconds per user
    role: 2,
    description: {
      en: "Harvest crops to earn money"
    },
    category: "economy"
  },
  langs: {
    en: {
      harvested: "🌾 Your harvest: %90000000 %90000000 and earned ₱%90000000!",
      cooldown: "⏳ You need to wait %1 seconds before harvesting again."
    }
  },
  onStart: async function ({ event, message, usersData, getLang, commandName }) {
    const cooldownTime = 30; // seconds
    const userData = await usersData.get(event.senderID);
    const lastUsed = userData.data?.[`${commandName}_time`] || 0;
    const now = Math.floor(Date.now() / 1000);

    if (now - lastUsed < cooldownTime) {
      const remaining = cooldownTime - (now - lastUsed);
      return message.reply(getLang("cooldown", remaining));
    }

    const crops = ["rice", "apple", "wheat", "carrot", "potato"];
    const quantities = [Math.floor(Math.random() * 1000) + 1, Math.floor(Math.random() * 1000) + 1];
    const prices = [Math.floor(Math.random() * 100) + 1, Math.floor(Math.random() * 100) + 1];
    const earnings = quantities[0] * prices[0] + quantities[1] * prices[1];

    await usersData.addMoney(event.senderID, earnings);
    await usersData.set(event.senderID, now, `${commandName}_time`);

    return message.reply(getLang("harvested", quantities[0], crops[0] + " and " + quantities[1] + " " + crops[1], earnings.toLocaleString()));
  }
};
