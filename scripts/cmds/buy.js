module.exports = {
  config: {
    name: "buy",
    version: "1.0",
    author: "ChatGPT",
    countDown: 0,
    role: 0,
    description: {
      en: "Buy items like protection"
    },
    category: "economy"
  },

  langs: {
    en: {
      notEnough: "❌ You don't have enough money to buy %1.",
      bought: "✅ You bought %1 for ₱%2.\n🛡️ You're now protected from robbery!",
      invalid: "❌ That protection item does not exist.",
      already: "🛡️ You already have active protection. Wait until it expires or is used.",
      noArg: "🛒 Please type the item name. Example: `/buy Guard Dog`"
    }
  },

  onStart: async function ({ args, event, message, usersData, getLang }) {
    const userID = event.senderID;
    const input = args.join(" ").trim();
    if (!input) return message.reply(getLang("noArg"));

    const protections = [
      { name: "Basic Shield", price: 10000 },
      { name: "Laser Alarm", price: 25000 },
      { name: "Guard Dog", price: 50000 },
      { name: "Safe Vault", price: 100000 },
      { name: "Electric Fence", price: 200000 },
      { name: "AI Security Drone", price: 500000 }
    ];

    const found = protections.find(item => item.name.toLowerCase() === input.toLowerCase());
    if (!found) return message.reply(getLang("invalid"));

    const user = await usersData.get(userID);
    const balance = user.money || 0;

    // Check if already has protection
    if (user.data?.protection && user.data.protection.active) {
      return message.reply(getLang("already"));
    }

    // Check balance
    if (balance < found.price) {
      return message.reply(getLang("notEnough", found.name));
    }

    // Deduct and set protection
    await usersData.addMoney(userID, -found.price);
    await usersData.set(userID, {
      active: true,
      name: found.name,
      timestamp: Date.now()
    }, "protection");

    return message.reply(getLang("bought", found.name, found.price.toLocaleString()));
  }
};
