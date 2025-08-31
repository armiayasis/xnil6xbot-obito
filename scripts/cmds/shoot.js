module.exports = {
  config: {
    name: "shoot",
    version: "1.0",
    author: "ChatGPT",
    countDown: 0,
    role: 0,
    description: {
      en: "Shoot All-In to win or lose big money!"
    },
    category: "economy"
  },

  langs: {
    en: {
      win: "🎯 Bang! You hit the target and won ₱%1!\n🔥 You're lucky today!",
      lose: "💥 Missed! You lost ₱%1!\n😢 Better luck next time.",
      noMoney: "❌ You have no money to shoot all-in!",
      help: "🎮 Shoot Game: \nUse /shoot to go all-in!\nYou have a 50/50 chance to win or lose all your money."
    }
  },

  onStart: async function ({ event, message, usersData, getLang }) {
    const userID = event.senderID;
    const user = await usersData.get(userID);
    const currentMoney = user.money || 0;

    if (currentMoney <= 0) {
      return message.reply(getLang("noMoney"));
    }

    // 50/50 win or lose
    const win = Math.random() < 0.5;

    if (win) {
      const reward = currentMoney;
      await usersData.addMoney(userID, reward);
      return message.reply(getLang("win", (reward * 2).toLocaleString()));
    } else {
      await usersData.set(userID, 0, "money");
      return message.reply(getLang("lose", currentMoney.toLocaleString()));
    }
  }
};
