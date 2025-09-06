 const fs = require("fs");
const path = require("path");

const LOGS_PATH = path.join(__dirname, "dbbank_logs.json");

// Load logs from file
function loadLogs() {
  try {
    if (!fs.existsSync(LOGS_PATH)) {
      fs.writeFileSync(LOGS_PATH, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(LOGS_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to load dbbank logs:", err);
    return [];
  }
}

// Save logs to file
function saveLogs(logs) {
  try {
    fs.writeFileSync(LOGS_PATH, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error("Failed to save dbbank logs:", err);
  }
}

// Add a log entry
function addLog(uid, action, amount) {
  const logs = loadLogs();
  logs.push({
    uid,
    action,
    amount,
    timestamp: new Date().toISOString()
  });
  saveLogs(logs);
}

module.exports = {
  config: {
    name: "dbbank",
    version: "2.1",
    author: "ChatGPT",
    countDown: 0,
    role: 0,
    description: {
      en: "DB Bank system with deposit, withdraw, protection shop, investment, logs, and gamble."
    },
    category: "economy",
    guide: {
      en: "/dbbank [balance|deposit|withdraw|protection|invest|vault|shop|logs|gamble]"
    }
  },

  langs: {
    en: {
      balance: "🏦 DB Bank:\n💰 Wallet: ₱%1\n🏛️ Bank: ₱%2\n💸 Vault: ₱%3\n🛡️ Protection: %4\n💼 Investment: ₱%5",
      depositSuccess: "✅ You deposited ₱%1 into your DB Bank account!",
      withdrawSuccess: "✅ You withdrew ₱%1 from your DB Bank account!",
      notEnoughWallet: "⚠️ You don't have enough money in your wallet.",
      notEnoughBank: "⚠️ You don't have enough money in your DB Bank account.",
      invalidAmount: "❌ Please enter a valid amount.",
      invalidCommand: "ℹ️ Usage:\n/dbbank balance\n/dbbank deposit [amount]\n/dbbank withdraw [amount]\n/dbbank protection buy [plan]\n/dbbank invest [amount]\n/dbbank vault [amount]\n/dbbank shop\n/dbbank logs\n/dbbank gamble",
      protectionSuccess: "🛡️ %1 protection plan activated! Your bank account is now secured for %2 hours.",
      protectionAlreadyActive: "⚠️ Protection is already active on your DB Bank account.",
      investSuccess: "💸 You successfully invested ₱%1 in your DB Bank account.",
      withdrawLimitExceeded: "⚠️ Withdrawal limit exceeded! Max ₱24,000 at a time.",
      vaultSuccess: "📥 You moved ₱%1 to your vault for extra protection.",
      shopList: "🛒 DB Bank Protection Shop\n1. Basic Shield - ₱5,000 (24h)\n2. Silver Guard - ₱15,000 (48h)\n3. Gold Defender - ₱30,000 (72h)\n4. Platinum Barrier - ₱50,000 (120h)\n5. Diamond Fortress - ₱100,000 (240h)\n6. Champion Ultimate - ₱200,000 (480h)\nUse: /dbbank protection buy [plan_number]",
      invalidPlan: "❌ Invalid protection plan. Use /dbbank shop to see plans.",
      protectionBought: "✅ Purchased %1 protection for ₱%2!",
      logsHeader: "📜 Last 10 DB Bank Logs:",
      noLogs: "ℹ️ No logs found.",
      gambleWin: "🎉 You won ₱%1 from gambling!",
      gambleLose: "😞 You lost ₱%1 from gambling.",
      gambleNoMoney: "⚠️ You need at least ₱100 in your wallet to gamble."
    }
  },

  onStart: async function({ message, event, args, usersData, getLang }) {
    const type = args[0]?.toLowerCase();
    const amount = parseInt(args[1]);
    const planNumber = parseInt(args[2]);
    const sender = event.senderID;
    const user = await usersData.get(sender);
    const wallet = user.money || 0;
    const bank = user.data?.bank || 0;
    const vault = user.data?.vault || 0;
    const protection = user.data?.protection || 0;
    const invested = user.data?.invested || 0;
    const now = Date.now();

    const protectionPlans = [
      { name: "Basic Shield", price: 5000, duration: 24 },
      { name: "Silver Guard", price: 15000, duration: 48 },
      { name: "Gold Defender", price: 30000, duration: 72 },
      { name: "Platinum Barrier", price: 50000, duration: 120 },
      { name: "Diamond Fortress", price: 100000, duration: 240 },
      { name: "Champion Ultimate", price: 200000, duration: 480 }
    ];

    // BALANCE
    if (!type || type === "balance") {
      return message.reply(getLang(
        "balance",
        wallet.toLocaleString(),
        bank.toLocaleString(),
        vault.toLocaleString(),
        protection > now ? "✅ Active" : "❌ None",
        invested.toLocaleString()
      ));
    }

    // SHOP
    if (type === "shop") {
      return message.reply(getLang("shopList"));
    }

    // DEPOSIT
    if (type === "deposit") {
      if (isNaN(amount) || amount <= 0) return message.reply(getLang("invalidAmount"));
      if (wallet < amount) return message.reply(getLang("notEnoughWallet"));

      await usersData.set(sender, wallet - amount, "money");
      await usersData.set(sender, bank + amount, "data.bank");
      addLog(sender, "deposit", amount);

      return message.reply(getLang("depositSuccess", amount.toLocaleString()));
    }

    // WITHDRAW
    if (type === "withdraw") {
      if (isNaN(amount) || amount <= 0) return message.reply(getLang("invalidAmount"));
      if (bank < amount) return message.reply(getLang("notEnoughBank"));
      if (amount > 24000) return message.reply(getLang("withdrawLimitExceeded"));

      await usersData.set(sender, wallet + amount, "money");
      await usersData.set(sender, bank - amount, "data.bank");
      addLog(sender, "withdraw", amount);

      return message.reply(getLang("withdrawSuccess", amount.toLocaleString()));
    }

    // BUY PROTECTION
    if (type === "protection" && args[1]?.toLowerCase() === "buy") {
      if (isNaN(planNumber) || planNumber < 1 || planNumber > 6) {
        return message.reply(getLang("invalidPlan"));
      }
      const plan = protectionPlans[planNumber - 1];
      if (protection > now) {
        return message.reply(getLang("protectionAlreadyActive"));
      }
      if (bank < plan.price) {
        return message.reply(getLang("notEnoughForProtection", plan.price.toLocaleString()));
      }
      await usersData.set(sender, bank - plan.price, "data.bank");
      const protectionEndTime = now + (plan.duration * 60 * 60 * 1000);
      await usersData.set(sender, protectionEndTime, "data.protection");
      return message.reply(getLang("protectionBought", plan.name, plan.price.toLocaleString()) + "\n" + getLang("protectionSuccess", plan.name, plan.duration));
    }

    // VAULT
    if (type === "vault") {
      if (isNaN(amount) || amount <= 0) return message.reply(getLang("invalidAmount"));
      if (bank < amount) return message.reply(getLang("notEnoughBank"));
      await usersData.set(sender, bank - amount, "data.bank");
      await usersData.set(sender, vault + amount, "data.vault");
      return message.reply(getLang("vaultSuccess", amount.toLocaleString()));
    }

    // INVEST
    if (type === "invest") {
      if (isNaN(amount) || amount <= 0) return message.reply(getLang("invalidAmount"));
      if (bank < amount) return message.reply(getLang("notEnoughBank"));
      await usersData.set(sender, bank - amount, "data.bank");
      await usersData.set(sender, invested + amount, "data.invested");
      return message.reply(getLang("investSuccess", amount.toLocaleString()));
    }

    // LOGS - show last 10 logs
    if (type === "logs") {
      const logs = loadLogs();
      if (logs.length === 0) return message.reply(getLang("noLogs"));

      const lastLogs = logs.slice(-10).reverse();

      let logMessage = getLang("logsHeader") + "\n";
      lastLogs.forEach((log, i) => {
        logMessage += `${i + 1}. [${log.timestamp}] UID: ${log.uid} - ${log.action.toUpperCase()} ₱${log.amount.toLocaleString()}\n`;
      });

      return message.reply(logMessage);
    }

    // GAMBLE - simple gamble command
    if (type === "gamble") {
      const minBet = 100;
      if (wallet < minBet) return message.reply(getLang("gambleNoMoney"));

      const bet = isNaN(amount) || amount < minBet ? minBet : amount;
      if (wallet < bet) return message.reply(getLang("notEnoughWallet"));

      const win = Math.random() < 0.5;

      if (win) {
        const winAmount = bet * 2;
        await usersData.set(sender, wallet + winAmount, "money");
        addLog(sender, "gamble_win", winAmount);
        return message.reply(getLang("gambleWin", winAmount.toLocaleString()));
      } else {
        await usersData.set(sender, wallet - bet, "money");
        addLog(sender, "gamble_lose", bet);
        return message.reply(getLang("gambleLose", bet.toLocaleString()));
      }
    }

    // INVALID COMMAND
    return message.reply(getLang("invalidCommand"));
  }
};
