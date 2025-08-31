-cmd install rob.js module.exports = {
  config: {
    name: "rob",
    version: "1.0",
    author: "ChatGPT",
    countDown: 0, // no cooldown
    role: 0,
    description: {
      en: "Rob another user and try to steal money!"
    },
    category: "economy"
  },

  langs: {
    en: {
      noReply: "❗ Please reply to someone's message to rob them.",
      noMoney: "❗ You need at least ₱5,000 to attempt a robbery.",
      targetPoor: "❗ This user doesn't have enough money to rob.",
      success: "🕵️ You successfully robbed ₱%1 from %2!",
      fail: "🚨 You got caught trying to rob %1 and lost ₱%2 in fines!",
      selfRob: "😒 You can't rob yourself.",
      cooldown: "⏳ You must wait %1 seconds before trying to rob again.",
    }
  },

  onStart: async function ({ event, message, usersData, getLang, commandName }) {
    const senderID = event.senderID;
    const replyID = event.messageReply?.senderID;

    if (!replyID) return message.reply(getLang("noReply"));
    if (replyID === senderID) return message.reply(getLang("selfRob"));

    const senderData = await usersData.get(senderID);
    const targetData = await usersData.get(replyID);

    const senderMoney = await usersData.getMoney(senderID);
    const targetMoney = await usersData.getMoney(replyID);

    if (senderMoney < 5000) return message.reply(getLang("noMoney"));
    if (targetMoney < 5000) return message.reply(getLang("targetPoor"));

    const success = Math.random() < 0.5; // 50% chance
    const amount = Math.floor(Math.random() * (targetMoney * 0.3)) + 1000; // min ₱1,000

    if (success) {
      const steal = Math.min(amount, targetMoney);
      await usersData.addMoney(senderID, steal);
      await usersData.addMoney(replyID, -steal);

      const name = targetData.name || "the user";
      return message.reply(getLang("success", steal.toLocaleString(), name));
    } else {
      const fine = Math.min(amount, senderMoney);
      await usersData.addMoney(senderID, -fine);

      const name = targetData.name || "the user";
      return message.reply(getLang("fail", name, fine.toLocaleString()));
    }
  }
};
