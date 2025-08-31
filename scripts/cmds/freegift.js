module.exports = {
  config: {
    name: "freegift",
    version: "1.1",
    author: "ChatGPT",
    countDown: 0, // no cooldown
    role: 0,
    description: {
      en: "Claim a free gift of money up to ₱980,000!"
    },
    category: "economy"
  },

  langs: {
    en: {
      claimed: `🎁🎉 𝗙𝗥𝗘𝗘 𝗚𝗜𝗙𝗧 𝗖𝗟𝗔𝗜𝗠𝗘𝗗! 🎉🎁

╔═════════════════════╗
║ 👑 You received ₱%1! ║
║ 💸 Enjoy your money! ║
╚═════════════════════╝`,

      cooldown: "⏳ You need to wait %1 seconds before claiming another gift.",
    }
  },

  onStart: async function ({ event, message, usersData, getLang, commandName }) {
    const cooldownTime = module.exports.config.countDown || 0;
    const senderID = event.senderID;
    const now = Math.floor(Date.now() / 1000);
    const userData = await usersData.get(senderID);
    const lastUsed = userData.data?.[`${commandName}_time`] || 0;

    if (cooldownTime > 0 && now - lastUsed < cooldownTime) {
      const remaining = cooldownTime - (now - lastUsed);
      return message.reply(getLang("cooldown", remaining));
    }

    const giftAmount = Math.floor(Math.random() * 980000) + 1; // 1 to 980,000

    await usersData.addMoney(senderID, giftAmount);
    await usersData.set(senderID, now, `${commandName}_time`);

    return message.reply(getLang("claimed", giftAmount.toLocaleString()));
  }
};
