module.exports = {
  config: {
    name: "work",
    version: "1.0",
    author: "ChatGPT",
    countDown: 0, // cooldown 0 seconds per user
    role: 0,
    description: {
      en: "Work to earn money"
    },
    category: "economy"
  },

  langs: {
    en: {
      worked: "👷 You worked as a %1 and earned ₱%2!\n💼 Keep working to get rich!",
      cooldown: "⏳ You need to wait %1 seconds before working again.",
      help: "ℹ️ Work Commands:\n/work - Start working to earn money. You can earn between ₱5,000 to ₱98,000 per job.\n\n𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: 60 seconds before you can work again."
    }
  },

  onStart: async function ({ event, message, usersData, getLang, commandName }) {
    const cooldownTime = 60; // seconds
    const userData = await usersData.get(event.senderID);
    const lastUsed = userData.data?.[`${commandName}_time`] || 0;
    const now = Math.floor(Date.now() / 1000);

    if (now - lastUsed < cooldownTime) {
      const remaining = cooldownTime - (now - lastUsed);
      return message.reply(getLang("cooldown", remaining));
    }

    const jobs = [
      "🧹 Janitor",
      "🛠️ Mechanic",
      "👨‍🍳 Chef",
      "🧑‍🏫 Teacher",
      "👮 Police Officer",
      "🚗 Driver",
      "👨‍💻 Programmer",
      "🧑‍🎨 Designer",
      "🧑‍🌾 Farmer",
      "📦 Delivery Guy"
    ];

    const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
    const earnings = Math.floor(Math.random() * (98000 - 5000 + 1)) + 5000; // ₱5,000 to ₱98,000

    await usersData.addMoney(event.senderID, earnings);
    await usersData.set(event.senderID, now, `${commandName}_time`);

    return message.reply(getLang("worked", randomJob, earnings.toLocaleString()));
  }
};
