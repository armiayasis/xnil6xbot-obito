module.exports = {
  config: {
    name: "rob",
    version: "1.0",
    author: "ChatGPT",
    countDown: 60, // 60s cooldown per user
    role: 0,
    description: {
      en: "Rob another user's balance"
    },
    category: "economy"
  },

  langs: {
    en: {
      noMention: "❗ Mention someone to rob.",
      selfRob: "🤨 You can't rob yourself!",
      noBalance: "❌ That user has no money to rob.",
      victimProtected: "🛡️ %1 is protected by %2!\n🚨 Robbery blocked!",
      success: "💸 You successfully robbed ₱%1 from %2!",
      fail: "🪙 You failed to rob %1. Try again later!",
    }
  },

  onStart: async function ({ event, message, usersData, getLang }) {
    const senderID = event.senderID;
    const mentionID = Object.keys(event.mentions || {})[0];

    if (!mentionID) return message.reply(getLang("noMention"));
    if (mentionID === senderID) return message.reply(getLang("selfRob"));

    const robber = await usersData.get(senderID);
    const victim = await usersData.get(mentionID);

    const victimBalance = victim.money || 0;
    if (victimBalance <= 0) return message.reply(getLang("noBalance"));

    // 🛡️ Check protection
    const protection = victim.data?.protection;
    const now = Date.now();
    const maxDuration = 6 * 60 * 60 * 1000; // 6 hours in ms

    if (protection?.active && now - protection.timestamp < maxDuration) {
      // Disable protection after use
      await usersData.set(mentionID, { active: false }, "protection");
      return message.reply(getLang("victimProtected", victim.name, protection.name));
    } else if (protection?.active) {
      // Expired protection
      await usersData.set(mentionID, null, "protection");
    }

    // Robbing success chance (e.g., 70% success)
    const success = Math.random() < 0.7;
    const amount = Math.floor(Math.random() * (victimBalance * 0.3)) + 1; // steal 1% - 30%

    if (!success) {
      return message.reply(getLang("fail", victim.name));
    }

    await usersData.addMoney(senderID, amount);
    await usersData.addMoney(mentionID, -amount);

    return message.reply(getLang("success", amount.toLocaleString(), victim.name));
  }
};
