const axios = require('axios');

const API_BASE_URL = "https://bkapi.vercel.app";

module.exports = {
  config: {
    name: "bank",
    version: "8.0",
    author: "GoatMart",
    countDown: 0,
    role: 0,
    longDescription: {
      en: "Complete Financial Ecosystem.",
    },
    category: "economy",
    guide: {
      en: "Enhanced banking system with comprehensive financial features!",
    },
  },

  onStart: async function ({ args, message, event, usersData, api }) {
    const { getPrefix } = global.utils;
    const p = getPrefix(event.threadID);
    const userMoney = await usersData.get(event.senderID, "money");
    const user = event.senderID;
    const bankHeader = "🏦 𝗚𝗼𝗮𝘁𝗠𝗮𝗿𝘁 𝗕𝗮𝗻𝗸\n━━━━━━━━━━━━━";

    let currentUserName = "Player";
    try {
      const userData = await usersData.get(event.senderID);
      currentUserName = userData.name || await getUserInfo(api, event.senderID) || "Player";
    } catch (error) {
      console.log('Could not get user name:', error.message);
    }

    const getUserInfo = async (api, userID) => {
      try {
        const name = await api.getUserInfo(userID);
        return name[userID].firstName || "User";
      } catch (error) {
        return "User";
      }
    };

    const getUserNameFromAPI = async (userID) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/name/${userID}`);
        if (response.data.success) {
          return response.data.userName;
        }
        return await getUserInfo(api, userID) || `Player${userID.slice(-4)}`;
      } catch (error) {
        return await getUserInfo(api, userID) || `Player${userID.slice(-4)}`;
      }
    };

    const callBankAPI = async (endpoint, method = 'GET', data = {}) => {
      try {
        const config = {
          method: method,
          url: `${API_BASE_URL}/${endpoint}`,
          data: method === 'POST' ? { userId: user.toString(), ...data } : undefined
        };

        if (method === 'GET' && endpoint.includes(':userId')) {
          config.url = `${API_BASE_URL}/${endpoint.replace(':userId', user.toString())}`;
        }

        const response = await axios(config);
        return response.data;
      } catch (error) {
        console.error(`API Error for ${endpoint}:`, error.message);
        return { success: false, message: "🚨 Banking services temporarily unavailable." };
      }
    };

    

    const getUserNameFromBot = async (userID) => {
      try {
        if (userID === user) {
          return currentUserName;
        }
        
        const userData = await usersData.get(userID);
        if (userData && userData.name) {
          return userData.name;
        }
        
        const userInfo = await getUserInfo(api, userID);
        return userInfo || `Player${userID.slice(-4)}`;
      } catch (error) {
        return `Player${userID.slice(-4)}`;
      }
    };

    const command = args[0]?.toLowerCase();
    const amount = parseInt(args[1]);
    const target = args[1];
    const subCommand = args[2]?.toLowerCase();

    if (!command || command === "help" || command === "info") {
      const helpMsg = `${bankHeader}\n\n` +

      `💰 𝗕𝗔𝗦𝗜𝗖 𝗕𝗔𝗡𝗞𝗜𝗡𝗚:\n• ${p}bank balance [@user] • deposit <amt>\n• withdraw <amt> • transfer <amt> @user\n• top • history • prestige\n\n` +

      `💳 𝗔𝗖𝗖𝗢𝗨𝗡𝗧 & 𝗖𝗔𝗥𝗗:\n• card create/deposit/withdraw/balance\n• credit-score • settings\n\n` +

      `📊 𝗜𝗡𝗩𝗘𝗦𝗧𝗠𝗘𝗡𝗧 & 𝗔𝗡𝗔𝗟𝗬𝗧𝗜𝗖𝗦:\n• portfolio • investment-summary\n• analytics • stocks • crypto\n\n` +

      `🎮 𝗚𝗔𝗠𝗘𝗦 & 𝗘𝗡𝗧𝗘𝗥𝗧𝗔𝗜𝗡𝗠𝗘𝗡𝗧:\n• slots <amt> • dice <amt> <high/low>\n• bet <type> <amt> <val> • wheel <amt>\n• blackjack <amt> • horse <amt> <1-5>\n• hunt • bingo <amt> • lottery\n\n` +

      `🎰 𝗖𝗔𝗦𝗜𝗡𝗢 & 𝗠𝗜𝗡𝗜𝗚𝗔𝗠𝗘𝗦:\n• casino roulette <bet> <type> [val]\n• casino scratch <type>\n\n` +

      `⛏️ 𝗠𝗜𝗡𝗜𝗡𝗚 & 𝗙𝗔𝗥𝗠𝗜𝗡𝗚 (𝗡𝗘𝗪!):\n• mining start <type> • mining collect\n• mining status • farming plant <crop>\n• farming harvest • farming status\n\n` +

      `🌤️ 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 & 𝗘𝗩𝗘𝗡𝗧𝗦 (𝗡𝗘𝗪!):\n• weather • events • season\n• quest daily • quest claim\n\n` +

      `🐾 𝗩𝗜𝗥𝗧𝗨𝗔𝗟 𝗣𝗘𝗧𝗦:\n• pets adopt <type> • pets feed <id>\n• pets list • pets play <id>\n\n` +

      `🎨 𝗡𝗙𝗧 𝗠𝗔𝗥𝗞𝗘𝗧𝗣𝗟𝗔𝗖𝗘:\n• nft mint <name> <rarity>\n• nft marketplace • nft collection\n\n` +

      `🗺️ 𝗧𝗥𝗘𝗔𝗦𝗨𝗥𝗘 𝗛𝗨𝗡𝗧𝗜𝗡𝗚:\n• treasure buy <type> • treasure use <id>\n• treasure list\n\n` +

      `🏢 𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦 𝗘𝗠𝗣𝗜𝗥𝗘:\n• empire start <type> <name>\n• empire list • empire collect\n\n` +

      `📱 𝗦𝗢𝗖𝗜𝗔𝗟 𝗠𝗘𝗗𝗜𝗔:\n• social post <content> • social feed\n• social stats\n\n` +

      `🏆 𝗔𝗖𝗛𝗜𝗘𝗩𝗘𝗠𝗘𝗡𝗧 𝗛𝗨𝗡𝗧𝗜𝗡𝗚:\n• achievements list\n• achievements claim\n• achievements\n• daily\n\n` +

      `🤝 𝗖𝗢𝗡𝗧𝗥𝗜𝗕𝗨𝗧𝗜𝗢𝗡 𝗦𝗬𝗦𝗧𝗘𝗠:\n• contrib create <title> <goal> <days>\n• contrib list [category] • contrib join <id> <amt>\n• contrib details <id> • contrib stats\n• contrib update <id> <message>\n\n` +

      `💎 𝗩𝗜𝗣 & 𝗣𝗥𝗘𝗠𝗜𝗨𝗠:\n• vip buy <tier> • vip-store • vip-item <id>\n\n` +

      `📈 𝗔𝗗𝗩𝗔𝗡𝗖𝗘𝗗 𝗔𝗡𝗔𝗟𝗬𝗧𝗜𝗖𝗦 (𝗡𝗘𝗪!):\n• analytics comprehensive\n• profile detailed\n\n` +

      `🏦 𝗔𝗗𝗩𝗔𝗡𝗖𝗘𝗗:\n• loan apply/repay • rob @user\n• business buy/collect • insurance`;

      return message.reply(helpMsg);
    }

    if (command === "balance" || command === "bal") {
      const targetUser = Object.keys(event.mentions)[0] || user;
      const endpoint = targetUser === user ? `balance/${user}` : `balance/${user}/${targetUser}`;
      const result = await callBankAPI(endpoint, 'GET');

      if (result.success) {
        const userData = result.data;
        const targetName = await getUserNameFromBot(targetUser);

        let balanceMsg = `${bankHeader}\n\n`;
        balanceMsg += `👤 ${targetName}'s Complete Financial Profile\n\n`;
        balanceMsg += `💰 𝗖𝗮𝘀𝗵: $${userData.cash.toLocaleString()}\n`;
        balanceMsg += `🏦 𝗕𝗮𝗻𝗸: $${userData.bank.toLocaleString()}\n`;
        balanceMsg += `💳 𝗖𝗮𝗿𝗱: $${userData.card.toLocaleString()}\n`;
        balanceMsg += `📈 𝗜𝗻𝘃𝗲𝘀𝘁𝗺𝗲𝗻𝘁𝘀: $${userData.investments.toLocaleString()}\n`;
        balanceMsg += `🏠 𝗥𝗲𝗮𝗹 𝗘𝘀𝘁𝗮𝘁𝗲: $${userData.realEstate.toLocaleString()}\n`;
        balanceMsg += `🚗 𝗩𝗲𝗵𝗶𝗰𝗹𝗲𝘀: $${userData.vehicles.toLocaleString()}\n`;
        balanceMsg += `💎 𝗖𝗼𝗹𝗹𝗲𝗰𝘁𝗶𝗯𝗹𝗲𝘀: $${userData.collectibles.toLocaleString()}\n`;
        balanceMsg += `💰 𝗧𝗼𝘁𝗮𝗹 𝗪𝗲𝗮𝗹𝘁𝗵: $${userData.totalAssets.toLocaleString()}\n\n`;
        balanceMsg += `🎯 𝗟𝗲𝘃𝗲𝗹: ${userData.level}`;
        if (userData.prestige > 0) balanceMsg += ` ⭐ Prestige: ${userData.prestige}`;
        balanceMsg += ` (${userData.experience} XP)\n`;
        balanceMsg += `📊 𝗜𝗻𝘁𝗲𝗿𝗲𝘀𝘁: ${userData.interestRate}%\n💳 𝗖𝗿𝗲𝗱𝗶𝘁: ${userData.creditScore}\n`;
        balanceMsg += `🔥 𝗦𝘁𝗿𝗲𝗮𝗸: ${userData.dailyStreak} days\n💎 ${userData.vipStatus.toUpperCase()}`;
        if (userData.loanDebt > 0) balanceMsg += `\n💳 𝗟𝗼𝗮𝗻 𝗗𝗲𝗯𝘁: $${userData.loanDebt.toLocaleString()}`;

        return message.reply(balanceMsg);
      } else {
        return message.reply(`${bankHeader}\n\n❌ Error: ${result.message}`);
      }
    }

    if (command === "deposit") {
      if (!amount || amount < 1) {
        return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank deposit <amount>\nMinimum: $1`);
      }

      if (userMoney < amount) {
        return message.reply(`${bankHeader}\n\n❌ Insufficient cash!\nYou have: $${userMoney.toLocaleString()}\nTrying to deposit: $${amount.toLocaleString()}`);
      }

      await usersData.set(event.senderID, { money: userMoney - amount });
      const result = await callBankAPI('deposit', 'POST', { amount });

      if (result.success) {
        let depositMsg = `${bankHeader}\n\n✅ 𝗗𝗲𝗽𝗼𝘀𝗶𝘁 𝗦𝘂𝗰𝗰𝗲𝘀𝘀!\n\n💰 Deposited: $${amount.toLocaleString()}\n🏦 New Balance: $${result.newBalance.toLocaleString()}\n📈 Interest Rate: ${result.interestRate}%`;
        if (result.experienceGained) {
          depositMsg += `\n⭐ XP Gained: +${result.experienceGained}`;
        }
        return message.reply(depositMsg);
      } else {
        await usersData.set(event.senderID, { money: userMoney });
        return message.reply(`${bankHeader}\n\n❌ Deposit failed: ${result.message}`);
      }
    }

    if (command === "withdraw") {
      if (!amount || amount < 1) {
        return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank withdraw <amount>`);
      }

      const result = await callBankAPI('withdraw', 'POST', { amount });

      if (result.success) {
        await usersData.set(event.senderID, { money: userMoney + amount });
        return message.reply(`${bankHeader}\n\n✅ 𝗪𝗶𝘁𝗵𝗱𝗿𝗮𝘄𝗮𝗹 𝗦𝘂𝗰𝗰𝗲𝘀𝘀!\n\n💵 Withdrawn: $${amount.toLocaleString()}\n🏦 Remaining: $${result.remainingBalance.toLocaleString()}\n📈 Interest Earned: $${result.interestEarned.toLocaleString()}`);
      } else {
        return message.reply(`${bankHeader}\n\n❌ ${result.message || 'Withdrawal failed'}`);
      }
    }

    if (command === "top") {
      const result = await callBankAPI('top-users', 'GET');

      if (result.success) {
        let topMsg = `${bankHeader}\n\n🏆 𝗧𝗼𝗽 𝟭𝟱 𝗥𝗶𝗰𝗵𝗲𝘀𝘁 𝗨𝘀𝗲𝗿𝘀 𝗟𝗲𝗮𝗱𝗲𝗿𝗯𝗼𝗮𝗿𝗱\n\n`;

        for (let i = 0; i < Math.min(15, result.topUsers.length); i++) {
          const userInfo = result.topUsers[i];
          const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : 
                      i < 10 ? `${i + 1}.` : `${i + 1}.`;

          let displayName = userInfo.userName;
          try {
            const properName = await getUserNameFromAPI(userInfo.userId);
            if (properName && !properName.startsWith('Player') && !properName.startsWith('User')) {
              displayName = properName;
            }
          } catch (error) {
            displayName = userInfo.userName || `Player${userInfo.userId.slice(-4)}`;
          }

          topMsg += `${medal} ${displayName}\n`;
          topMsg += `   💎 Net Worth: $${(userInfo.totalAssets || 0).toLocaleString()}\n`;
          topMsg += `   💰 Cash: $${(userInfo.cash || 0).toLocaleString()} | 🏦 Bank: $${(userInfo.bank || 0).toLocaleString()}\n`;
          topMsg += `   📈 Investments: $${(userInfo.investments || 0).toLocaleString()}\n`;
          topMsg += `   🎯 Level: ${userInfo.level || 1}`;
          if ((userInfo.prestige || 0) > 0) topMsg += ` ⭐${userInfo.prestige}`;
          topMsg += ` | 💳 Credit: ${userInfo.creditScore || 650}\n`;
          topMsg += `   🔥 Streak: ${userInfo.dailyStreak || 0} | 🎮 Games: ${userInfo.gamesPlayed || 0} (${userInfo.winRate || 0}% win)\n`;
          topMsg += `   💎 VIP: ${(userInfo.vipStatus || 'none').toUpperCase()} | 🏢 Businesses: ${userInfo.businesses || 0}\n`;
          topMsg += `   🏆 Achievements: ${userInfo.achievements || 0} | 📊 Rank: #${userInfo.rank || i + 1}\n\n`;
        }

        topMsg += `💡 Want to climb the ranks? Try the new Mining & Farming systems!`;
        return message.reply(topMsg);
      } else {
        return message.reply(`${bankHeader}\n\n❌ Unable to fetch leaderboard: ${result.message || 'Service temporarily unavailable'}`);
      }
    }

    if (command === "transfer" || command === "send") {
      const recipient = Object.keys(event.mentions)[0];

      if (!amount || !recipient) {
        return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank ${command} <amount> @user\nMinimum: $1`);
      }

      if (userMoney < amount) {
        return message.reply(`${bankHeader}\n\n❌ Insufficient funds!\n\nYou have: $${userMoney.toLocaleString()}\nTrying to send: $${amount.toLocaleString()}`);
      }

      const recipientName = await getUserInfo(api, recipient);
      const result = await callBankAPI('transfer', 'POST', { amount, recipientId: recipient });

      if (result.success) {
        await usersData.set(event.senderID, { money: userMoney - amount });
        return message.reply(`${bankHeader}\n\n✅ 𝗠𝗼𝗻𝗲𝘆 𝗦𝗲𝗻𝘁!\n\n💸 Sent to: ${recipientName}\n💰 Amount: $${amount.toLocaleString()}\n💵 New Balance: $${result.newBalance.toLocaleString()}`);
      } else {
        return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
      }
    }

    if (command === "daily") {
      const result = await callBankAPI('daily/claim', 'POST');

      if (result.success) {
        await usersData.set(event.senderID, { money: userMoney + result.reward });
        return message.reply(`${bankHeader}\n\n🎁 𝗗𝗮𝗶𝗹𝘆 𝗥𝗲𝘄𝗮𝗿𝗱 𝗖𝗹𝗮𝗶𝗺𝗲𝗱!\n\n💰 Reward: $${result.reward.toLocaleString()}\n🔥 Streak: ${result.streak} days\n💵 New Balance: $${result.newBalance.toLocaleString()}`);
      } else {
        return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
      }
    }

    if (command === "slots") {
      if (!amount || amount < 5) {
        return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank slots <amount>\nMinimum bet: $5`);
      }

      if (userMoney < amount) {
        return message.reply(`${bankHeader}\n\n❌ Insufficient funds!\n\nYou have: $${userMoney.toLocaleString()}\nBet amount: $${amount.toLocaleString()}`);
      }

      await usersData.set(event.senderID, { money: userMoney - amount });
      const result = await callBankAPI('games/slots', 'POST', { betAmount: amount });

      if (result.success) {
        await usersData.set(event.senderID, { money: result.newBalance });

        let slotsMsg = `${bankHeader}\n\n🎰 𝗦𝗟𝗢𝗧 𝗠𝗔𝗖𝗛𝗜𝗡𝗘\n\n`;
        slotsMsg += `🎯 Reels: [ ${result.reels ? result.reels.join(' | ') : '🍒 🍒 🍒'} ]\n\n`;

        if (result.won) {
          slotsMsg += `🎉 ${result.result || 'WIN'}!\n`;
          slotsMsg += `💰 Win: $${result.winAmount.toLocaleString()}\n`;
          slotsMsg += `📈 Net Gain: +$${result.netGain.toLocaleString()}\n`;
        } else {
          slotsMsg += `💸 No win this time!\n`;
          slotsMsg += `📉 Net Loss: -$${amount.toLocaleString()}\n`;
        }

        slotsMsg += `💵 New Balance: $${result.newBalance.toLocaleString()}`;

        return message.reply(slotsMsg);
      } else {
        await usersData.set(event.senderID, { money: userMoney });
        return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
      }
    }

    if (command === "dice") {
      const prediction = args[2]?.toLowerCase();

      if (!amount || !prediction || (prediction !== 'high' && prediction !== 'low') || amount < 5) {
        return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank dice <amount> <high/low>\nMinimum bet: $5\nHigh = 4-6, Low = 1-3`);
      }

      if (userMoney < amount) {
        return message.reply(`${bankHeader}\n\n❌ Insufficient funds!\n\nYou have: $${userMoney.toLocaleString()}\nBet amount: $${amount.toLocaleString()}`);
      }

      await usersData.set(event.senderID, { money: userMoney - amount });
      const result = await callBankAPI('games/dice', 'POST', { betAmount: amount, prediction });

      if (result.success) {
        await usersData.set(event.senderID, { money: result.newBalance });

        let diceMsg = `${bankHeader}\n\n🎲 𝗗𝗜𝗖𝗘 𝗥𝗢𝗟𝗟\n\n`;
        diceMsg += `🎯 Your Prediction: ${result.prediction}\n`;
        diceMsg += `🎲 Dice Result: ${result.roll}\n\n`;

        if (result.won) {
          diceMsg += `🎉 CORRECT PREDICTION!\n`;
          diceMsg += `💰 Won: $${result.winAmount.toLocaleString()}\n`;
          diceMsg += `📈 Net Gain: +$${result.netGain.toLocaleString()}\n`;
        } else {
          diceMsg += `💸 Better luck next time!\n`;
          diceMsg += `📉 Net Loss: -$${amount.toLocaleString()}\n`;
        }

        diceMsg += `💵 New Balance: $${result.newBalance.toLocaleString()}`;

        return message.reply(diceMsg);
      } else {
        await usersData.set(event.senderID, { money: userMoney });
        return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
      }
    }

    if (command === "bet") {
      const betType = args[1]?.toLowerCase();
      const betValue = args[3];

      if (!amount || !betType || !betValue) {
        return message.reply(`${bankHeader}\n\n💡 Betting Types:\n\nCoinflip: ${p}bank bet coinflip <amount> <heads/tails>\nNumber: ${p}bank bet number <amount> <1-10>\nColor: ${p}bank bet color <amount> <red/green/blue>`);
      }

      if (userMoney < amount) {
        return message.reply(`${bankHeader}\n\n❌ Insufficient funds!\n\nYou have: $${userMoney.toLocaleString()}\nBet amount: $${amount.toLocaleString()}`);
      }

      await usersData.set(event.senderID, { money: userMoney - amount });
      const result = await callBankAPI('games/bet', 'POST', { betAmount: amount, betType, betValue });

      if (result.success) {
        await usersData.set(event.senderID, { money: result.newBalance });

        let betMsg = `${bankHeader}\n\n🎯 ${betType.toUpperCase()} 𝗕𝗘𝗧\n\n`;
        betMsg += `🎲 Your Bet: ${betValue}\n`;

        if (betType === 'coinflip') betMsg += `📊 Result: ${result.flip}\n\n`;
        if (betType === 'number') betMsg += `📊 Result: ${result.randomNumber}\n\n`;
        if (betType === 'color') betMsg += `📊 Result: ${result.randomColor}\n\n`;

        if (result.won) {
          betMsg += `🎉 YOU WON!\n`;
          betMsg += `💰 Payout: $${result.winAmount.toLocaleString()}\n`;
          betMsg += `📈 Net Gain: +$${result.netGain.toLocaleString()}\n`;
        } else {
          betMsg += `💸 You lost this round!\n`;
          betMsg += `📉 Net Loss: -$${amount.toLocaleString()}\n`;
        }

        betMsg += `💵 New Balance: $${result.newBalance.toLocaleString()}`;

        return message.reply(betMsg);
      } else {
        await usersData.set(event.senderID, { money: userMoney });
        return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
      }
    }

    if (command === "wheel") {
      if (!amount || amount < 10) {
        return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank wheel <amount>\nMinimum bet: $10`);
      }

      if (userMoney < amount) {
        return message.reply(`${bankHeader}\n\n❌ Insufficient funds!\n\nYou have: $${userMoney.toLocaleString()}\nBet amount: $${amount.toLocaleString()}`);
      }

      await usersData.set(event.senderID, { money: userMoney - amount });
      const result = await callBankAPI('games/wheel', 'POST', { amount });

      if (result.success) {
        await usersData.set(event.senderID, { money: result.newBalance });

        let wheelMsg = `${bankHeader}\n\n🎡 𝗙𝗢𝗥𝗧𝗨𝗡𝗘 𝗪𝗛𝗘𝗘𝗟\n\n`;
        wheelMsg += `🎯 Result: ${result.result}\n`;
        wheelMsg += `💰 Bet: $${result.betAmount.toLocaleString()}\n\n`;

        if (result.winAmount > 0) {
          wheelMsg += `🎉 ${result.result}!\n`;
          wheelMsg += `💰 Won: $${result.winAmount.toLocaleString()} (${result.multiplier}x)\n`;
          wheelMsg += `📈 Net Gain: +$${result.netGain.toLocaleString()}\n`;
        } else {
          wheelMsg += `💸 Better luck next time!\n`;
          wheelMsg += `📉 Net Loss: -$${amount.toLocaleString()}\n`;
        }

        wheelMsg += `💵 New Balance: $${result.newBalance.toLocaleString()}`;

        return message.reply(wheelMsg);
      }
    }

    if (command === "blackjack") {
      if (!amount || amount < 10) {
        return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank blackjack <amount>\nMinimum bet: $10`);
      }

      if (userMoney < amount) {
        return message.reply(`${bankHeader}\n\n❌ Insufficient funds!\n\nYou have: $${userMoney.toLocaleString()}\nBet amount: $${amount.toLocaleString()}`);
      }

      await usersData.set(event.senderID, { money: userMoney - amount });
      const result = await callBankAPI('games/blackjack', 'POST', { amount });

      if (result.success) {
        await usersData.set(event.senderID, { money: result.newBalance });

        let bjMsg = `${bankHeader}\n\n🃏 𝗕𝗟𝗔𝗖𝗞𝗝𝗔𝗖𝗞\n\n`;
        bjMsg += `👤 Your Cards: [${result.playerCards.join(', ')}] = ${result.playerScore}\n`;
        bjMsg += `🏠 Dealer Cards: [${result.dealerCards.join(', ')}] = ${result.dealerScore}\n\n`;

        const resultMessages = {
          'blackjack': '🎉 BLACKJACK! Natural 21!',
          'win': '🎉 YOU WIN! Beat the dealer!',
          'dealer_bust': '🎉 DEALER BUST! You win!',
          'bust': '💥 BUST! You went over 21!',
          'push': '🤝 PUSH! Tie game!',
          'lose': '😔 DEALER WINS! Better luck next time!'
        };

        bjMsg += `${resultMessages[result.result]}\n`;

        if (result.winAmount > 0) {
          bjMsg += `💰 Won: $${result.winAmount.toLocaleString()}\n`;
          bjMsg += `📈 Net Gain: +$${result.netGain.toLocaleString()}\n`;
        } else if (result.result === 'push') {
          bjMsg += `💰 Bet Returned: $${amount.toLocaleString()}\n`;
        } else {
          bjMsg += `📉 Net Loss: -$${amount.toLocaleString()}\n`;
        }

        bjMsg += `💵 New Balance: $${result.newBalance.toLocaleString()}`;

        return message.reply(bjMsg);
      }
    }

    if (command === "horse") {
      const horseNumber = parseInt(args[2]);

      if (!amount || !horseNumber || horseNumber < 1 || horseNumber > 5 || amount < 5) {
        return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank horse <amount> <1-5>\nMinimum bet: $5\n\n🐎 Horses:\n1. Lightning Bolt (3x)\n2. Thunder Strike (4x)\n3. Wind Runner (5x)\n4. Fire Storm (6x)\n5. Ice Breaker (8x)`);
      }

      if (userMoney < amount) {
        return message.reply(`${bankHeader}\n\n❌ Insufficient funds!\n\nYou have: $${userMoney.toLocaleString()}\nBet amount: $${amount.toLocaleString()}`);
      }

      await usersData.set(event.senderID, { money: userMoney - amount });
      const result = await callBankAPI('games/horse', 'POST', { amount, horseNumber });

      if (result.success) {
        await usersData.set(event.senderID, { money: result.newBalance });

        let raceMsg = `${bankHeader}\n\n🏇 𝗛𝗢𝗥𝗦𝗘 𝗥𝗔𝗖𝗜𝗡𝗚\n\n`;
        raceMsg += `🎯 Your Horse: #${result.selectedHorse} ${result.selectedHorseName}\n`;
        raceMsg += `🏆 Winner: #${result.winningHorse} ${result.winningHorseName}\n\n`;

        if (result.won) {
          raceMsg += `🎉 YOUR HORSE WON!\n`;
          raceMsg += `💰 Payout: $${result.winAmount.toLocaleString()} (${result.odds}x)\n`;
          raceMsg += `📈 Net Gain: +$${result.netGain.toLocaleString()}\n`;
        } else {
          raceMsg += `😔 Your horse didn't win this time!\n`;
          raceMsg += `📉 Net Loss: -$${amount.toLocaleString()}\n`;
        }

        raceMsg += `💵 New Balance: $${result.newBalance.toLocaleString()}`;

        return message.reply(raceMsg);
      }
    }

    if (command === "hunt") {
      const result = await callBankAPI('games/hunt', 'POST');

      if (result.success) {
        await usersData.set(event.senderID, { money: result.newBalance });

        return message.reply(`${bankHeader}\n\n🗺️ 𝗧𝗥𝗘𝗔𝗦𝗨𝗥𝗘 𝗛𝗨𝗡𝗧\n\n🎉 You found: ${result.treasure}!\n💰 Reward: $${result.reward.toLocaleString()}\n🏆 Total Hunts: ${result.totalHunts}\n⏰ Next Hunt: ${result.nextHuntTime}\n💵 New Balance: $${result.newBalance.toLocaleString()}`);
      } else {
        return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
      }
    }

    if (command === "bingo") {
      if (!amount || amount < 5) {
        return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank bingo <amount>\nMinimum card cost: $5`);
      }

      if (userMoney < amount) {
        return message.reply(`${bankHeader}\n\n❌ Insufficient funds!\n\nYou have: $${userMoney.toLocaleString()}\nCard cost: $${amount.toLocaleString()}`);
      }

      await usersData.set(event.senderID, { money: userMoney - amount });
      const result = await callBankAPI('games/bingo', 'POST', { amount });

      if (result.success) {
        await usersData.set(event.senderID, { money: result.newBalance });

        let bingoMsg = `${bankHeader}\n\n🎱 𝗕𝗜𝗡𝗚𝗢 𝗚𝗔𝗠𝗘\n\n`;
        bingoMsg += `🎯 Lines Completed: ${result.lines}\n`;
        bingoMsg += `📞 Called Numbers: ${result.calledNumbers.join(', ')}...\n\n`;

        if (result.winAmount > 0) {
          bingoMsg += `🎉 WINNER!\n`;
          bingoMsg += `💰 Payout: $${result.winAmount.toLocaleString()}\n`;
          bingoMsg += `📈 Net Gain: +$${result.netGain.toLocaleString()}\n`;
        } else {
          bingoMsg += `😔 No lines completed this time!\n`;
          bingoMsg += `📉 Net Loss: -$${amount.toLocaleString()}\n`;
        }

        bingoMsg += `💵 New Balance: $${result.newBalance.toLocaleString()}`;

        return message.reply(bingoMsg);
      }
    }

    if (command === "lottery") {
      const action = args[1]?.toLowerCase();

      if (!action || action === "info") {
        const result = await callBankAPI(`lottery/info/${user}`, 'GET');
        if (result.success) {
          return message.reply(`${bankHeader}\n\n🎰 𝗟𝗢𝗧𝗧𝗘𝗥𝗬 𝗦𝗬𝗦𝗧𝗘𝗠\n\n🏆 Prize Pool: $${result.prizePool.toLocaleString()}\n💎 Current Jackpot: $${result.jackpot.toLocaleString()}\n\n🎫 Your Tickets: ${result.userTickets}\n🎯 Win Chance: ${result.winChance}%\n⏰ Next Draw: ${result.nextDraw}\n\n💰 Ticket Price: $1,000\n💡 Choose numbers 1-100: ${p}bank lottery buy <number>`);
        }
      } else if (action === "buy") {
        const number = parseInt(args[2]);
        if (!number || number < 1 || number > 100) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank lottery buy <1-100>\nTicket Cost: $1,000`);
        }

        if (userMoney < 1000) {
          return message.reply(`${bankHeader}\n\n❌ Need $1,000 for lottery ticket!`);
        }

        const result = await callBankAPI('lottery/buy', 'POST', { number });
        if (result.success) {
          await usersData.set(event.senderID, { money: userMoney - 1000 });
          return message.reply(`${bankHeader}\n\n🎫 𝗟𝗢𝗧𝗧𝗘𝗥𝗬 𝗧𝗜𝗖𝗞𝗘𝗧!\n\n🎯 Your Lucky Number: ${number}\n🆔 Ticket ID: ${result.ticketId}\n🏆 Prize Pool: $${result.prizePool.toLocaleString()}\n💎 Jackpot: $${result.jackpot.toLocaleString()}\n📅 Draw Date: ${result.drawDate}\n\n🍀 Good luck!`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      }
    }

    if (command === "card") {
      const action = args[1]?.toLowerCase();

      if (!action) {
        return message.reply(`${bankHeader}\n\n💳 𝗖𝗔𝗥𝗗 𝗦𝗬𝗦𝗧𝗘𝗠:\n\n• ${p}bank card create - Get debit card\n• ${p}bank card deposit <amount>\n• ${p}bank card withdraw <amount>\n• ${p}bank card balance - View details`);
      }

      if (action === "create") {
        const result = await callBankAPI('card/create', 'POST');
        if (result.success) {
          return message.reply(`${bankHeader}\n\n💳 𝗗𝗘𝗕𝗜𝗧 𝗖𝗔𝗥𝗗 𝗖𝗥𝗘𝗔𝗧𝗘𝗗!\n\n💳 Number: **** **** **** ${result.cardNumber.slice(-4)}\n💰 Daily Limit: $${result.dailyLimit.toLocaleString()}\n💎 Cashback Rate: ${result.cashbackRate}%`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "deposit") {
        if (!amount) return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank card deposit <amount>`);

        if (userMoney < amount) {
          return message.reply(`${bankHeader}\n\n❌ Insufficient cash!`);
        }

        const result = await callBankAPI('card/deposit', 'POST', { amount });
        if (result.success) {
          await usersData.set(event.senderID, { money: userMoney - amount });
          return message.reply(`${bankHeader}\n\n✅ 𝗖𝗔𝗥𝗗 𝗗𝗘𝗣𝗢𝗦𝗜𝗧!\n\n💳 Deposited: $${amount.toLocaleString()}\n💰 Card Balance: $${result.newBalance.toLocaleString()}`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "withdraw") {
        if (!amount) return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank card withdraw <amount>`);

        const result = await callBankAPI('card/withdraw', 'POST', { amount });
        if (result.success) {
          await usersData.set(event.senderID, { money: userMoney + amount });
          return message.reply(`${bankHeader}\n\n✅ 𝗖𝗔𝗥𝗗 𝗪𝗜𝗧𝗛𝗗𝗥𝗔𝗪𝗔𝗟!\n\n💵 Withdrawn: $${amount.toLocaleString()}\n💳 Card Balance: $${result.newBalance.toLocaleString()}`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "balance") {
        const result = await callBankAPI(`card/balance/${user}`, 'GET');
        if (result.success) {
          return message.reply(`${bankHeader}\n\n💳 𝗖𝗔𝗥𝗗 𝗗𝗘𝗧𝗔𝗜𝗟𝗦\n\n💳 Number: ${result.cardNumber}\n💰 Balance: $${result.balance.toLocaleString()}\n💰 Daily Limit: $${result.dailyLimit.toLocaleString()}\n💎 Cashback Rate: ${result.cashbackRate}\n📅 Expires: ${result.expiryDate}`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      }
    }

    if (command === "rob") {
      const targetId = Object.keys(event.mentions)[0];

      if (!targetId) {
        return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank rob @user\n\n⚠️ Robbery system with VIP protection\n⏰ 1 hour cooldown\n🛡️ Success varies by VIP status`);
      }

      const targetName = await getUserInfo(api, targetId);
      const result = await callBankAPI('rob', 'POST', { targetId });

      if (result.success) {
        await usersData.set(event.senderID, { money: userMoney + result.amountStolen });
        return message.reply(`${bankHeader}\n\n🔫 𝗥𝗢𝗕𝗕𝗘𝗥𝗬 𝗦𝗨𝗖𝗖𝗘𝗦𝗦!\n\n💰 Stolen: $${result.amountStolen.toLocaleString()} from ${targetName}\n💵 New Balance: $${result.newBalance.toLocaleString()}`);
      } else {
        return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
      }
    }

    if (command === "loan") {
      const action = args[1]?.toLowerCase();

      if (action === "apply") {
        const result = await callBankAPI('loan/apply', 'POST');

        if (result.success) {
          await usersData.set(event.senderID, { money: userMoney + result.loanAmount });
          return message.reply(`${bankHeader}\n\n✅ 𝗟𝗼𝗮𝗻 𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱!\n\n💰 Amount: $${result.loanAmount.toLocaleString()}\n📈 Interest: ${result.interestRate * 100}%\n⏰ Due: ${result.dueDate}\n💵 New Balance: $${result.newBalance.toLocaleString()}`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "repay") {
        const result = await callBankAPI('loan/repay', 'POST');

        if (result.success) {
          await usersData.set(event.senderID, { money: userMoney - result.amountRepaid });
          return message.reply(`${bankHeader}\n\n✅ 𝗟𝗼𝗮𝗻 𝗥𝗲𝗽𝗮𝗶𝗱!\n\n💰 Paid: $${result.amountRepaid.toLocaleString()}\n💵 New Balance: $${result.newBalance.toLocaleString()}\n🎉 Loan cleared!`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else {
        return message.reply(`${bankHeader}\n\n🏦 𝗟𝗢𝗔𝗡 𝗦𝗬𝗦𝗧𝗘𝗠:\n\n• ${p}bank loan apply - Get a loan\n• ${p}bank loan repay - Pay back loan`);
      }
    }

    if (command === "history") {
      const result = await callBankAPI(`history/${user}`, 'GET');

      if (result.success) {
        let historyMsg = `${bankHeader}\n\n📋 𝗧𝗿𝗮𝗻𝘀𝗮𝗰𝘁𝗶𝗼𝗻 𝗛𝗶𝘀𝘁𝗼𝗿𝘆\n\n`;

        if (result.transactions.length === 0) {
          historyMsg += "📭 No transactions yet.";
        } else {
          result.transactions.slice(0, 10).forEach((tx, index) => {
            const sign = tx.amount >= 0 ? '+' : '';
            historyMsg += `${index + 1}. ${tx.type}: ${sign}$${tx.amount.toLocaleString()}\n`;
            historyMsg += `   📅 ${tx.date}\n\n`;
          });
        }

        return message.reply(historyMsg);
      }
    }

    if (command === "stocks" || command === "stock") {
      const action = args[1]?.toLowerCase();

      if (!action || action === "prices") {
        const result = await callBankAPI('stocks/prices', 'GET');
        if (result.success) {
          let stocksMsg = `${bankHeader}\n\n📊 𝗦𝗧𝗢𝗖𝗞 𝗠𝗔𝗥𝗞𝗘𝗧\n\n`;
          result.stocks.forEach(stock => {
            stocksMsg += `📈 ${stock.symbol}: $${stock.price.toLocaleString()}\n`;
            stocksMsg += `   📊 Volatility: ${(stock.volatility * 100).toFixed(1)}%\n\n`;
          });
          stocksMsg += `💡 Buy: ${p}bank stocks buy <shares> <symbol>`;
          return message.reply(stocksMsg);
        }
      } else if (action === "buy") {
        const shares = parseInt(args[2]);
        const symbol = args[3]?.toUpperCase();

        if (!shares || !symbol) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank stocks buy <shares> <symbol>\n\nAvailable: TECH, HEALTH, ENERGY, FINANCE, CRYPTO, AI`);
        }

        const result = await callBankAPI('stocks/buy', 'POST', { symbol, shares });
        if (result.success) {
          await usersData.set(event.senderID, { money: userMoney - result.totalCost });
          return message.reply(`${bankHeader}\n\n📈 𝗦𝗧𝗢𝗖𝗞 𝗣𝗨𝗥𝗖𝗛𝗔𝗦𝗘!\n\n📊 ${symbol}: ${shares} shares\n💰 Price: $${result.price.toLocaleString()}\n💳 Total: $${result.totalCost.toLocaleString()}\n💵 Balance: $${result.newBalance.toLocaleString()}`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "sell") {
        const shares = parseInt(args[2]);
        const symbol = args[3]?.toUpperCase();

        if (!shares || !symbol) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank stocks sell <shares> <symbol>`);
        }

        const result = await callBankAPI('stocks/sell', 'POST', { symbol, shares });
        if (result.success) {
          await usersData.set(event.senderID, { money: userMoney + result.totalValue });
          return message.reply(`${bankHeader}\n\n📉 𝗦𝗧𝗢𝗖𝗞 𝗦𝗔𝗟𝗘!\n\n📊 ${symbol}: ${shares} shares\n💰 Price: $${result.price.toLocaleString()}\n💳 Total: $${result.totalValue.toLocaleString()}\n💵 Balance: $${result.newBalance.toLocaleString()}`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "portfolio") {
        const result = await callBankAPI(`stocks/portfolio/${user}`, 'GET');
        if (result.success) {
          let portfolioMsg = `${bankHeader}\n\n📊 𝗦𝗧𝗢𝗖𝗞 𝗣𝗢𝗥𝗧𝗙𝗢𝗟𝗜𝗢\n\n`;
          if (result.portfolio.length === 0) {
            portfolioMsg += "📭 No stocks owned.";
          } else {
            let totalValue = 0;
            result.portfolio.forEach(stock => {
              portfolioMsg += `📈 ${stock.symbol}: ${stock.holdings} shares\n`;
              portfolioMsg += `   💰 Value: $${stock.totalValue.toLocaleString()}\n\n`;
              totalValue += stock.totalValue;
            });
            portfolioMsg += `💎 Total Value: $${totalValue.toLocaleString()}`;
          }
          return message.reply(portfolioMsg);
        }
      }
    }

    if (command === "crypto") {
      const action = args[1]?.toLowerCase();

      if (!action || action === "prices") {
        const result = await callBankAPI('crypto/prices', 'GET');
        if (result.success) {
          let cryptoMsg = `${bankHeader}\n\n💎 𝗖𝗥𝗬𝗣𝗧𝗢 𝗠𝗔𝗥𝗞𝗘𝗧\n\n`;
          result.cryptos.forEach(crypto => {
            cryptoMsg += `💰 ${crypto.symbol}: $${crypto.price.toLocaleString()}\n`;
            cryptoMsg += `   📊 Volatility: ${(crypto.volatility * 100).toFixed(1)}%\n\n`;
          });
          cryptoMsg += `💡 Buy: ${p}bank crypto buy <amount> <crypto>`;
          return message.reply(cryptoMsg);
        }
      } else if (action === "buy") {
        const cryptoAmount = parseFloat(args[2]);
        const cryptoName = args[3]?.toLowerCase();

        if (!cryptoAmount || !cryptoName) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank crypto buy <amount> <crypto>\n\nAvailable: bitcoin, ethereum, dogecoin, litecoin`);
        }

        const result = await callBankAPI('crypto/buy', 'POST', { cryptoName, amount: cryptoAmount });
        if (result.success) {
          await usersData.set(event.senderID, { money: userMoney - result.totalCost });
          return message.reply(`${bankHeader}\n\n💎 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗨𝗥𝗖𝗛𝗔𝗦𝗘!\n\n🪙 ${result.cryptoName.toUpperCase()}: ${result.amount}\n💰 Price: $${result.price.toLocaleString()}\n💳 Total: $${result.totalCost.toLocaleString()}\n💵 Balance: $${result.newBalance.toLocaleString()}`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "portfolio") {
        const result = await callBankAPI(`crypto/portfolio/${user}`, 'GET');
        if (result.success) {
          let portfolioMsg = `${bankHeader}\n\n💎 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗢𝗥𝗧𝗙𝗢𝗟𝗜𝗢\n\n`;
          if (result.portfolio.length === 0) {
            portfolioMsg += "📭 No crypto holdings.";
          } else {
            let totalValue = 0;
            result.portfolio.forEach(crypto => {
              cryptoMsg += `💎 ${crypto.symbol}: ${crypto.holdings}\n`;
              cryptoMsg += `   💰 Value: $${crypto.totalValue.toLocaleString()}\n\n`;
              totalValue += crypto.totalValue;
            });
            portfolioMsg += `💎 Total Value: $${totalValue.toLocaleString()}`;
          }
          return message.reply(portfolioMsg);
        }
      }
    }

    if (command === "vip") {
      const action = args[1]?.toLowerCase();

      if (action === "buy") {
        const plan = args[2]?.toLowerCase();

        if (!plan) {
          return message.reply(`${bankHeader}\n\n💎 𝗩𝗜𝗣 𝗣𝗟𝗔𝗡𝗦:\n\n🥉 Bronze: $10k (1 month)\n🥈 Silver: $25k (3 months)\n🥇 Gold: $50k (6 months)\n💎 Platinum: $100k (1 year)\n💎 Diamond: $250k (2 years)\n⭐ Elite: $500k (3 years)\n🌟 Legend: $1M (5 years)\n👑 God: $5M (10 years)\n\nUsage: ${p}bank vip buy <tier>`);
        }

        const result = await callBankAPI('vip/purchase', 'POST', { plan });

        if (result.success) {
          const planCosts = {
            bronze: 10000, silver: 25000, gold: 50000, platinum: 100000,
            diamond: 250000, elite: 500000, legend: 1000000, god: 5000000
          };
          await usersData.set(event.senderID, { money: userMoney - planCosts[plan] });

          return message.reply(`${bankHeader}\n\n💎 𝗩𝗜𝗣 𝗔𝗖𝗧𝗜𝗩𝗔𝗧𝗘𝗗!\n\n✨ Plan: ${plan.toUpperCase()}\n⏰ Valid until: ${result.expiryDate}\n🎁 Benefits: Enhanced rewards & protection!`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else {
        return message.reply(`${bankHeader}\n\n💎 𝗩𝗜𝗣 𝗦𝗬𝗦𝗧𝗘𝗠\n\nUsage: ${p}bank vip buy <tier>\n\n🔥 Higher tiers = Better benefits!\n• Interest bonuses\n• Rob protection\n• Daily reward multipliers\n• Exclusive features`);
      }
    }

    if (command === "portfolio") {
      const result = await callBankAPI(`investment/summary/${user}`, 'GET');

      if (result.success) {
        const summary = result.summary;
        let portfolioMsg = `${bankHeader}\n\n📊 𝗜𝗡𝗩𝗘𝗦𝗧𝗠𝗘𝗡𝗧 𝗣𝗢𝗥𝗧𝗙𝗢𝗟𝗜𝗢\n\n`;
        portfolioMsg += `💎 Total Value: $${summary.totalValue.toLocaleString()}\n`;
        portfolioMsg += `💰 Invested: $${summary.totalInvested.toLocaleString()}\n`;
        portfolioMsg += `📈 P&L: ${summary.totalProfit >= 0 ? '+' : ''}$${summary.totalProfit.toLocaleString()}\n`;
        portfolioMsg += `📊 Return: ${summary.profitPercentage}%\n\n`;
        portfolioMsg += `📈 Stocks: $${summary.breakdown.stocks.value.toLocaleString()}\n`;
        portfolioMsg += `💎 Crypto: $${summary.breakdown.crypto.value.toLocaleString()}\n`;
        portfolioMsg += `🏛️ Bonds: $${summary.breakdown.bonds.value.toLocaleString()}`;

        return message.reply(portfolioMsg);
      }
    }

    if (command === "analytics") {
      const result = await callBankAPI(`analytics/portfolio/${user}`, 'GET');

      if (result.success) {
        const analytics = result.analytics;
        let analyticsMsg = `${bankHeader}\n\n📊 𝗣𝗢𝗥𝗧𝗙𝗢𝗟𝗜𝗢 𝗔𝗡𝗔𝗟𝗬𝗧𝗜𝗖𝗦\n\n`;
        analyticsMsg += `💰 Value: $${analytics.totalValue.toLocaleString()}\n`;
        analyticsMsg += `📈 Stocks: ${analytics.stockAllocation}%\n`;
        analyticsMsg += `💎 Crypto: ${analytics.cryptoAllocation}%\n`;
        analyticsMsg += `🎯 Diversity: ${analytics.diversityScore}/100\n`;
        analyticsMsg += `📊 Assets: ${analytics.assets} | Risk: ${analytics.riskLevel}`;

        return message.reply(analyticsMsg);
      }
    }

    if (command === "pets" || command === "pet") {
      const action = args[1]?.toLowerCase();

      if (!action || action === "list") {
        const result = await callBankAPI(`pets/${user}`, 'GET');
        if (result.success) {
          let petsMsg = `${bankHeader}\n\n🐾 𝗩𝗜𝗥𝗧𝗨𝗔𝗟 𝗣𝗘𝗧𝗦\n\n`;
          
          if (result.pets.length === 0) {
            petsMsg += `No pets yet! Adopt one with ${p}bank pets adopt <type>\n\n`;
            petsMsg += `Available pets: cat ($5k), dog ($7.5k), dragon ($50k), unicorn ($100k), phoenix ($250k)`;
          } else {
            result.pets.forEach((pet, index) => {
              petsMsg += `${index + 1}. ${pet.name} (${pet.type})\n`;
              petsMsg += `   🆙 Level: ${pet.level} | ❤️ Health: ${pet.health}%\n`;
              petsMsg += `   😊 Happiness: ${pet.happiness}% | 🍖 Hunger: ${pet.hunger}%\n`;
              petsMsg += `   📅 Adopted: ${new Date(pet.adoptedDate).toLocaleDateString()}\n\n`;
            });
          }
          return message.reply(petsMsg);
        }
      } else if (action === "adopt") {
        const petType = args[2]?.toLowerCase();
        if (!petType) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank pets adopt <type>\n\nAvailable: cat, dog, dragon, unicorn, phoenix`);
        }

        const result = await callBankAPI('pets/adopt', 'POST', { petType });
        if (result.success) {
          return message.reply(`${bankHeader}\n\n🐾 𝗣𝗘𝗧 𝗔𝗗𝗢𝗣𝗧𝗘𝗗!\n\n🎉 You adopted: ${result.pet.name}\n💰 Cost: $${result.cost.toLocaleString()}\n🐾 Total Pets: ${result.totalPets}`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "feed") {
        const petId = args[2];
        if (!petId) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank pets feed <pet_id>\n\nUse ${p}bank pets list to see your pets and their IDs`);
        }

        const result = await callBankAPI('pets/feed', 'POST', { petId });
        if (result.success) {
          let feedMsg = `${bankHeader}\n\n🍖 𝗣𝗘𝗧 𝗙𝗘𝗗!\n\n`;
          feedMsg += `🐾 Pet: ${result.pet.name}\n`;
          feedMsg += `❤️ Health: ${result.pet.health}%\n`;
          feedMsg += `😊 Happiness: ${result.pet.happiness}%\n`;
          feedMsg += `🍖 Hunger: ${result.pet.hunger}%\n`;
          feedMsg += `🆙 Level: ${result.pet.level}`;
          if (result.levelUp) feedMsg += ` (LEVEL UP! 🎉)`;
          feedMsg += `\n💰 Cost: $${result.cost}`;
          return message.reply(feedMsg);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      }
    }

    if (command === "nft") {
      const action = args[1]?.toLowerCase();

      if (!action || action === "help") {
        return message.reply(`${bankHeader}\n\n🎨 𝗡𝗙𝗧 𝗠𝗔𝗥𝗞𝗘𝗧𝗣𝗟𝗔𝗖𝗘\n\n• ${p}bank nft mint <name> <rarity>\n• ${p}bank nft marketplace\n• ${p}bank nft collection\n\nRarities: common ($10k), rare ($25k), epic ($50k), legendary ($100k), mythic ($250k)`);
      } else if (action === "mint") {
        const nftName = args[2];
        const rarity = args[3]?.toLowerCase();
        
        if (!nftName || !rarity) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank nft mint <name> <rarity>\n\nRarities: common, rare, epic, legendary, mythic`);
        }

        const result = await callBankAPI('nft/mint', 'POST', { nftName, rarity });
        if (result.success) {
          let mintMsg = `${bankHeader}\n\n🎨 𝗡𝗙𝗧 𝗠𝗜𝗡𝗧𝗘𝗗!\n\n`;
          mintMsg += `🖼️ NFT: ${result.nft.name}\n`;
          mintMsg += `⭐ Rarity: ${result.nft.rarity.toUpperCase()}\n`;
          mintMsg += `✨ Traits: ${result.nft.traits.join(', ')}\n`;
          mintMsg += `💰 Cost: $${result.cost.toLocaleString()}\n`;
          mintMsg += `🎨 Total NFTs: ${result.totalNFTs}`;
          return message.reply(mintMsg);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "marketplace") {
        const result = await callBankAPI('nft/marketplace', 'GET');
        if (result.success) {
          let marketMsg = `${bankHeader}\n\n🛒 𝗡𝗙𝗧 𝗠𝗔𝗥𝗞𝗘𝗧𝗣𝗟𝗔𝗖𝗘\n\n`;
          
          if (result.marketplace.length === 0) {
            marketMsg += "No NFTs for sale right now!";
          } else {
            result.marketplace.slice(0, 10).forEach((nft, index) => {
              marketMsg += `${index + 1}. ${nft.name} (${nft.rarity})\n`;
              marketMsg += `   💰 Price: $${nft.salePrice.toLocaleString()}\n`;
              marketMsg += `   👤 Seller: ${nft.sellerName}\n\n`;
            });
          }
          return message.reply(marketMsg);
        }
      }
    }

    if (command === "treasure" || command === "maps") {
      const action = args[1]?.toLowerCase();

      if (!action || action === "help") {
        return message.reply(`${bankHeader}\n\n🗺️ 𝗧𝗥𝗘𝗔𝗦𝗨𝗥𝗘 𝗠𝗔𝗣𝗦\n\n• ${p}bank treasure buy <type>\n• ${p}bank treasure use <map_id>\n• ${p}bank treasure list\n\nTypes: basic ($5k), rare ($15k), legendary ($50k), mythic ($100k)`);
      } else if (action === "buy") {
        const mapType = args[2]?.toLowerCase();
        if (!mapType) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank treasure buy <type>\n\nTypes: basic, rare, legendary, mythic`);
        }

        const result = await callBankAPI('treasure/maps/buy', 'POST', { mapType });
        if (result.success) {
          let mapMsg = `${bankHeader}\n\n🗺️ 𝗧𝗥𝗘𝗔𝗦𝗨𝗥𝗘 𝗠𝗔𝗣 𝗣𝗨𝗥𝗖𝗛𝗔𝗦𝗘𝗗!\n\n`;
          mapMsg += `📜 Map Type: ${result.map.type.toUpperCase()}\n`;
          mapMsg += `💰 Cost: $${result.map.cost.toLocaleString()}\n`;
          mapMsg += `🔍 Map ID: ${result.map.id}\n`;
          mapMsg += `🗺️ Total Maps: ${result.totalMaps}\n\n`;
          mapMsg += `Use ${p}bank treasure use ${result.map.id} to find treasure!`;
          return message.reply(mapMsg);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "use") {
        const mapId = args[2];
        if (!mapId) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank treasure use <map_id>`);
        }

        const result = await callBankAPI('treasure/maps/use', 'POST', { mapId });
        if (result.success) {
          let treasureMsg = `${bankHeader}\n\n💰 𝗧𝗥𝗘𝗔𝗦𝗨𝗥𝗘 𝗙𝗢𝗨𝗡𝗗!\n\n`;
          treasureMsg += `🎉 ${result.treasure}\n`;
          treasureMsg += `🗺️ Map: ${result.mapType.toUpperCase()}\n`;
          treasureMsg += `💰 Reward: $${result.reward.toLocaleString()}\n\n`;
          treasureMsg += `🔍 Clues followed:\n`;
          result.clues.forEach((clue, index) => {
            treasureMsg += `${index + 1}. ${clue}\n`;
          });
          return message.reply(treasureMsg);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      }
    }

    if (command === "empire" || command === "business") {
      const action = args[1]?.toLowerCase();

      if (!action || action === "help") {
        return message.reply(`${bankHeader}\n\n🏢 𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦 𝗘𝗠𝗣𝗜𝗥𝗘\n\n• ${p}bank empire start <type> <name>\n• ${p}bank empire list\n• ${p}bank empire collect\n\nTypes: lemonade ($1k), restaurant ($50k), tech ($250k), bank ($1M), casino ($5M)`);
      } else if (action === "start") {
        const businessType = args[2]?.toLowerCase();
        const businessName = args.slice(3).join(' ');
        
        if (!businessType || !businessName) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank empire start <type> <name>\n\nTypes: lemonade, restaurant, tech, bank, casino`);
        }

        const result = await callBankAPI('business/empire/start', 'POST', { businessType, businessName });
        if (result.success) {
          let businessMsg = `${bankHeader}\n\n🏢 𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦 𝗦𝗧𝗔𝗥𝗧𝗘𝗗!\n\n`;
          businessMsg += `🏪 Business: ${result.business.name}\n`;
          businessMsg += `🏷️ Type: ${result.business.type.toUpperCase()}\n`;
          businessMsg += `💰 Cost: $${result.business.cost.toLocaleString()}\n`;
          businessMsg += `📈 Daily Income: $${result.business.dailyIncome.toLocaleString()}\n`;
          businessMsg += `👥 Employees: ${result.business.employees}\n\n`;
          businessMsg += `🏆 Empire Stats:\n`;
          businessMsg += `🏢 Total Businesses: ${result.empire.totalBusinesses}\n`;
          businessMsg += `💎 Total Value: $${result.empire.totalValue.toLocaleString()}\n`;
          businessMsg += `💰 Daily Income: $${result.empire.totalDailyIncome.toLocaleString()}`;
          return message.reply(businessMsg);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      }
    }

    if (command === "casino") {
      const action = args[1]?.toLowerCase();

      if (!action || action === "help") {
        return message.reply(`${bankHeader}\n\n🎰 𝗖𝗔𝗦𝗜𝗡𝗢 𝗚𝗔𝗠𝗘𝗦\n\n• ${p}bank casino roulette <bet> <type> [value]\n• ${p}bank casino scratch <type>\n\nRoulette: red/black/even/odd/number\nScratch cards: bronze, silver, gold, diamond`);
      } else if (action === "roulette") {
        const betAmount = parseInt(args[2]);
        const betType = args[3]?.toLowerCase();
        const betValue = args[4];

        if (!betAmount || !betType || betAmount < 10) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank casino roulette <bet> <type> [value]\n\nTypes: red, black, even, odd, number\nFor number bets: ${p}bank casino roulette 1000 number 17\nMin bet: $10`);
        }

        const result = await callBankAPI('casino/roulette', 'POST', { betAmount, betType, betValue });
        if (result.success) {
          let rouletteMsg = `${bankHeader}\n\n🎰 𝗥𝗢𝗨𝗟𝗘𝗧𝗧𝗘\n\n`;
          rouletteMsg += `🎯 Winning Number: ${result.winningNumber} (${result.color})\n`;
          rouletteMsg += `🎲 Your Bet: ${result.betType}`;
          if (result.betValue) rouletteMsg += ` (${result.betValue})`;
          rouletteMsg += `\n💰 Bet Amount: $${result.betAmount.toLocaleString()}\n\n`;
          
          if (result.won) {
            rouletteMsg += `🎉 YOU WON!\n`;
            rouletteMsg += `💰 Winnings: $${result.winAmount.toLocaleString()}\n`;
            rouletteMsg += `📈 Net Gain: +$${result.netGain.toLocaleString()}\n`;
          } else {
            rouletteMsg += `💸 Better luck next time!\n`;
            rouletteMsg += `📉 Net Loss: -$${result.betAmount.toLocaleString()}\n`;
          }
          
          rouletteMsg += `💵 New Balance: $${result.newBalance.toLocaleString()}`;
          return message.reply(rouletteMsg);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "scratch") {
        const cardType = args[2]?.toLowerCase();
        if (!cardType) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank casino scratch <type>\n\nTypes: bronze ($1k), silver ($5k), gold ($10k), diamond ($25k)`);
        }

        const result = await callBankAPI('casino/scratch-card', 'POST', { cardType });
        if (result.success) {
          let scratchMsg = `${bankHeader}\n\n🎫 𝗦𝗖𝗥𝗔𝗧𝗖𝗛 𝗖𝗔𝗥𝗗\n\n`;
          scratchMsg += `🎰 Card: ${result.cardType.toUpperCase()}\n`;
          scratchMsg += `💰 Cost: $${result.cost.toLocaleString()}\n\n`;
          scratchMsg += `🎯 Results:\n`;
          
          for (let i = 0; i < 9; i += 3) {
            scratchMsg += `${result.scratchResults.slice(i, i + 3).join(' ')} `;
            if (i < 6) scratchMsg += `\n`;
          }
          
          scratchMsg += `\n\n`;
          
          if (result.winAmount > 0) {
            scratchMsg += `🎉 WINNER!\n`;
            scratchMsg += `🏆 Pattern: ${result.winPattern}\n`;
            scratchMsg += `💰 Won: $${result.winAmount.toLocaleString()}\n`;
            scratchMsg += `📈 Net Gain: +$${result.netGain.toLocaleString()}\n`;
          } else {
            scratchMsg += `💸 No winning pattern!\n`;
            scratchMsg += `📉 Net Loss: -$${result.cost.toLocaleString()}\n`;
          }
          
          scratchMsg += `💵 New Balance: $${result.newBalance.toLocaleString()}`;
          return message.reply(scratchMsg);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      }
    }

    if (command === "social") {
      const action = args[1]?.toLowerCase();

      if (!action || action === "help") {
        return message.reply(`${bankHeader}\n\n📱 𝗦𝗢𝗖𝗜𝗔𝗟 𝗠𝗘𝗗𝗜𝗔\n\n• ${p}bank social post <content>\n• ${p}bank social feed\n• ${p}bank social stats\n\nEarn money from engagement!`);
      } else if (action === "post") {
        const content = args.slice(2).join(' ');
        if (!content) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank social post <your message>`);
        }

        const result = await callBankAPI('social/post', 'POST', { content, postType: 'text' });
        if (result.success) {
          return message.reply(`${bankHeader}\n\n📱 𝗣𝗢𝗦𝗧 𝗣𝗨𝗕𝗟𝗜𝗦𝗛𝗘𝗗!\n\n📝 Content: "${content}"\n💰 Engagement Reward: $${result.engagementReward.toLocaleString()}\n📊 Total Posts: ${result.totalPosts}`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "feed") {
        const result = await callBankAPI(`social/feed/${user}`, 'GET');
        if (result.success) {
          let feedMsg = `${bankHeader}\n\n📱 𝗦𝗢𝗖𝗜𝗔𝗟 𝗙𝗘𝗘𝗗\n\n`;
          
          if (result.feed.length === 0) {
            feedMsg += "No posts in your feed yet!";
          } else {
            result.feed.slice(0, 5).forEach((post, index) => {
              feedMsg += `${index + 1}. @${post.authorName}\n`;
              feedMsg += `   "${post.content}"\n`;
              feedMsg += `   ❤️ ${post.likes} | 🔄 ${post.shares}\n`;
              feedMsg += `   📅 ${new Date(post.timestamp).toLocaleDateString()}\n\n`;
            });
          }
          return message.reply(feedMsg);
        }
      }
    }

    if (command === "contrib" || command === "contribution") {
      const action = args[1]?.toLowerCase();

      if (!action || action === "help") {
        return message.reply(`${bankHeader}\n\n🤝 𝗖𝗢𝗡𝗧𝗥𝗜𝗕𝗨𝗧𝗜𝗢𝗡 𝗦𝗬𝗦𝗧𝗘𝗠\n\nGroup savings with automatic interest distribution!\n\n• ${p}bank contrib create <title> <goal> <days> [interest%] [category]\n• ${p}bank contrib list [category]\n• ${p}bank contrib join <id> <amount> [message]\n• ${p}bank contrib details <id>\n• ${p}bank contrib stats\n• ${p}bank contrib update <id> <message>\n• ${p}bank contrib categories\n\n💡 When goal is reached, all contributors automatically get their money back + interest!`);
      } else if (action === "create") {
        const title = args[2];
        const goalAmount = parseInt(args[3]);
        const duration = parseInt(args[4]);
        const interestRate = parseFloat(args[5]) || 5;
        const category = args[6] || 'general';

        if (!title || !goalAmount || !duration || goalAmount < 1000 || duration < 1) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank contrib create <title> <goal> <days> [interest%] [category]\n\nExample: ${p}bank contrib create "Vacation Fund" 50000 30 6 vacation\n\nMin goal: $1,000 | Min duration: 1 day`);
        }

        const result = await callBankAPI('contribution/create', 'POST', {
          title: title.replace(/"/g, ''),
          goalAmount,
          duration,
          interestRate: interestRate / 100,
          category,
          description: `Group contribution for ${title}`,
          isPublic: true
        });

        if (result.success) {
          let createMsg = `${bankHeader}\n\n🤝 𝗖𝗢𝗡𝗧𝗥𝗜𝗕𝗨𝗧𝗜𝗢𝗡 𝗖𝗥𝗘𝗔𝗧𝗘𝗗!\n\n`;
          createMsg += `📋 Title: ${result.contribution.title}\n`;
          createMsg += `🎯 Goal: $${result.contribution.goalAmount.toLocaleString()}\n`;
          createMsg += `📈 Interest Rate: ${(result.contribution.interestRate * 100).toFixed(1)}%\n`;
          createMsg += `⏰ Duration: ${result.contribution.duration} days\n`;
          createMsg += `🏷️ Category: ${result.contribution.category}\n`;
          createMsg += `🆔 ID: ${result.contribution.id}\n\n`;
          createMsg += `💡 Share this ID for others to join!\nUse: ${p}bank contrib join ${result.contribution.id} <amount>`;
          return message.reply(createMsg);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "list") {
        const category = args[2];
        const queryParams = category ? `?category=${category}&status=active` : '?status=active';
        const result = await callBankAPI(`contribution/list${queryParams}`, 'GET');

        if (result.success) {
          let listMsg = `${bankHeader}\n\n🤝 𝗔𝗖𝗧𝗜𝗩𝗘 𝗖𝗢𝗡𝗧𝗥𝗜𝗕𝗨𝗧𝗜𝗢𝗡𝗦\n\n`;
          
          if (result.contributions.length === 0) {
            listMsg += "No active contributions found.";
          } else {
            result.contributions.slice(0, 10).forEach((contrib, index) => {
              listMsg += `${index + 1}. **${contrib.title}**\n`;
              listMsg += `   🎯 Goal: $${contrib.goalAmount.toLocaleString()}\n`;
              listMsg += `   💰 Raised: $${contrib.currentAmount.toLocaleString()} (${contrib.progress}%)\n`;
              listMsg += `   📈 Interest: ${(contrib.interestRate * 100).toFixed(1)}% | 🔥 Bonus: ${contrib.bonusMultiplier.toFixed(1)}x\n`;
              listMsg += `   👥 Contributors: ${contrib.totalContributors} | ⏰ ${contrib.daysLeft} days left\n`;
              listMsg += `   👤 Creator: ${contrib.creatorName}\n`;
              listMsg += `   🆔 ID: ${contrib.id}\n\n`;
            });
            listMsg += `💡 Join: ${p}bank contrib join <id> <amount>`;
          }
          return message.reply(listMsg);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "join") {
        const contributionId = args[2];
        const contributionAmount = parseInt(args[3]);
        const contributionMessage = args.slice(4).join(' ');

        if (!contributionId || !contributionAmount || contributionAmount < 10) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank contrib join <id> <amount> [message]\n\nMin contribution: $10`);
        }

        if (userMoney < contributionAmount) {
          return message.reply(`${bankHeader}\n\n❌ Insufficient funds!\n\nYou have: $${userMoney.toLocaleString()}\nTrying to contribute: $${contributionAmount.toLocaleString()}`);
        }

        const result = await callBankAPI('contribution/contribute', 'POST', {
          contributionId,
          amount: contributionAmount,
          message: contributionMessage
        });

        if (result.success) {
          await usersData.set(event.senderID, { money: userMoney - contributionAmount });
          
          let joinMsg = `${bankHeader}\n\n🤝 𝗖𝗢𝗡𝗧𝗥𝗜𝗕𝗨𝗧𝗜𝗢𝗡 𝗦𝗨𝗖𝗖𝗘𝗦𝗦!\n\n`;
          joinMsg += `📋 Contribution: ${result.contributionTitle}\n`;
          joinMsg += `💰 Your Contribution: $${contributionAmount.toLocaleString()}\n`;
          joinMsg += `📊 Total Raised: $${result.totalAmount.toLocaleString()} / $${result.goalAmount.toLocaleString()}\n`;
          joinMsg += `📈 Progress: ${result.progress}%\n`;
          joinMsg += `🔥 Bonus Multiplier: ${result.bonusMultiplier.toFixed(1)}x\n`;
          
          if (result.isCompleted) {
            joinMsg += `\n🎉 GOAL ACHIEVED! Automatic payout processing...\n`;
            joinMsg += `💰 You'll receive your contribution + interest shortly!`;
          }
          
          joinMsg += `\n💵 New Balance: $${result.newBalance.toLocaleString()}`;
          return message.reply(joinMsg);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "details") {
        const contributionId = args[2];
        if (!contributionId) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank contrib details <id>`);
        }

        const result = await callBankAPI(`contribution/${contributionId}`, 'GET');
        if (result.success) {
          const contrib = result.contribution;
          let detailsMsg = `${bankHeader}\n\n🤝 ${contrib.title}\n\n`;
          detailsMsg += `📝 Description: ${contrib.description}\n`;
          detailsMsg += `👤 Creator: ${contrib.creatorName}\n`;
          detailsMsg += `🎯 Goal: $${contrib.goalAmount.toLocaleString()}\n`;
          detailsMsg += `💰 Raised: $${contrib.currentAmount.toLocaleString()} (${contrib.progress}%)\n`;
          detailsMsg += `📈 Interest Rate: ${(contrib.interestRate * 100).toFixed(1)}%\n`;
          detailsMsg += `🔥 Bonus Multiplier: ${contrib.bonusMultiplier.toFixed(1)}x\n`;
          detailsMsg += `👥 Contributors: ${contrib.totalContributors}\n`;
          detailsMsg += `💎 Estimated Payout: $${contrib.estimatedPayout.toLocaleString()}\n`;
          detailsMsg += `⏰ Days Left: ${contrib.daysLeft}\n`;
          detailsMsg += `📅 Created: ${new Date(contrib.createdDate).toLocaleDateString()}\n`;
          detailsMsg += `🏷️ Category: ${contrib.category}\n`;
          detailsMsg += `📊 Status: ${contrib.status.toUpperCase()}\n\n`;
          
          if (contrib.milestones.length > 0) {
            detailsMsg += `🏆 Milestones Achieved:\n`;
            contrib.milestones.forEach(milestone => {
              detailsMsg += `   ✅ ${milestone.percent}% - Bonus unlocked!\n`;
            });
            detailsMsg += `\n`;
          }
          
          if (contrib.updates.length > 0) {
            detailsMsg += `📢 Recent Updates:\n`;
            contrib.updates.slice(-3).forEach(update => {
              detailsMsg += `   • ${update.userName}: ${update.message}\n`;
            });
          }
          
          return message.reply(detailsMsg);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "stats") {
        const result = await callBankAPI(`contribution/stats/${user}`, 'GET');
        if (result.success) {
          const stats = result.stats;
          let statsMsg = `${bankHeader}\n\n📊 𝗬𝗢𝗨𝗥 𝗖𝗢𝗡𝗧𝗥𝗜𝗕𝗨𝗧𝗜𝗢𝗡 𝗦𝗧𝗔𝗧𝗦\n\n`;
          statsMsg += `🤝 Contributions Joined: ${stats.contributionsJoined}\n`;
          statsMsg += `🏗️ Contributions Created: ${stats.contributionsCreated}\n`;
          statsMsg += `💰 Total Contributed: $${stats.totalContributed.toLocaleString()}\n`;
          statsMsg += `💎 Total Earned (Interest): $${stats.totalEarned.toLocaleString()}\n`;
          statsMsg += `🔥 Active Contributions: ${stats.activeContributions}\n`;
          statsMsg += `✅ Completed Contributions: ${stats.completedContributions}\n`;
          statsMsg += `📈 Success Rate: ${stats.successRate}%\n`;
          statsMsg += `📊 Average Contribution: $${stats.averageContribution.toLocaleString()}\n`;
          statsMsg += `🏆 Rank: ${stats.rank}`;
          return message.reply(statsMsg);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "update") {
        const contributionId = args[2];
        const updateMessage = args.slice(3).join(' ');

        if (!contributionId || !updateMessage) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank contrib update <id> <message>\n\nPost updates for your contribution to keep contributors informed!`);
        }

        const result = await callBankAPI('contribution/update', 'POST', {
          contributionId,
          message: updateMessage,
          type: 'update'
        });

        if (result.success) {
          return message.reply(`${bankHeader}\n\n📢 𝗨𝗣𝗗𝗔𝗧𝗘 𝗣𝗢𝗦𝗧𝗘𝗗!\n\n✅ Your update has been posted and all contributors have been notified!\n\n💡 Keep contributors engaged with regular updates!`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "categories") {
        const result = await callBankAPI('contribution/categories', 'GET');
        if (result.success) {
          let catMsg = `${bankHeader}\n\n🏷️ 𝗖𝗢𝗡𝗧𝗥𝗜𝗕𝗨𝗧𝗜𝗢𝗡 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗜𝗘𝗦\n\n`;
          result.categories.forEach(cat => {
            catMsg += `${cat.icon} **${cat.name}**\n`;
            catMsg += `   📝 ${cat.description}\n`;
            catMsg += `   🔑 ID: ${cat.id}\n\n`;
          });
          catMsg += `💡 Use category ID when creating contributions!`;
          return message.reply(catMsg);
        }
      }
    }

    if (command === "achievements" || command === "achieve") {
      const action = args[1]?.toLowerCase();

      if (!action || action === "list") {
        const result = await callBankAPI(`achievements/hunting/${user}`, 'GET');
        if (result.success) {
          let achieveMsg = `${bankHeader}\n\n🏆 𝗔𝗖𝗛𝗜𝗘𝗩𝗘𝗠𝗘𝗡𝗧 𝗛𝗨𝗡𝗧𝗜𝗡𝗚\n\n`;
          achieveMsg += `🎯 Progress: ${result.completedCount}/${result.totalPossible}\n`;
          achieveMsg += `🎁 Available Rewards: ${result.availableRewards}\n\n`;

          Object.entries(result.achievements).forEach(([key, achievement]) => {
            const status = achievement.completed ? '✅' : '❌';
            achieveMsg += `${status} ${achievement.title}\n`;
            achieveMsg += `   📝 ${achievement.description}\n`;
            achieveMsg += `   💰 Reward: $${achievement.reward.toLocaleString()}\n`;
            if (achievement.completed && !result.completedAchievements?.includes(key)) {
              achieveMsg += `   🎁 Use: ${p}bank achievements claim ${key}\n`;
            }
            achieveMsg += `\n`;
          });

          return message.reply(achieveMsg);
        }
      } else if (action === "claim") {
        const achievementKey = args[2];
        if (!achievementKey) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank achievements claim <achievement_key>\n\nUse ${p}bank achievements list to see available rewards`);
        }

        const result = await callBankAPI('achievements/claim', 'POST', { achievementKey });
        if (result.success) {
          return message.reply(`${bankHeader}\n\n🏆 𝗔𝗖𝗛𝗜𝗘𝗩𝗘𝗠𝗘𝗡𝗧 𝗖𝗟𝗔𝗜𝗠𝗘𝗗!\n\n🎉 Achievement: ${result.achievement}\n💰 Reward: $${result.reward.toLocaleString()}\n💵 New Balance: $${result.newBalance.toLocaleString()}`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      }
    }

    if (command === "prestige") {
      const result = await callBankAPI('prestige', 'POST');
      if (result.success) {
        await usersData.set(event.senderID, { money: result.bonus });
        return message.reply(`${bankHeader}\n\n⭐ 𝗣𝗥𝗘𝗦𝗧𝗜𝗚𝗘 𝗔𝗖𝗛𝗜𝗘𝗩𝗘𝗗!\n\n🎉 Level: ${result.prestigeLevel}\n💰 Bonus: $${result.bonus.toLocaleString()}\n\n🚀 Ultimate achievement unlocked!`);
      } else {
        return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
      }
    }

    // NEW MINING SYSTEM
    if (command === "mining") {
      const action = args[1]?.toLowerCase();

      if (!action || action === "help") {
        return message.reply(`${bankHeader}\n\n⛏️ 𝗠𝗜𝗡𝗜𝗡𝗚 𝗦𝗬𝗦𝗧𝗘𝗠\n\n• ${p}bank mining start <type>\n• ${p}bank mining collect\n• ${p}bank mining status\n\nTypes: bitcoin ($10k), ethereum ($7.5k), litecoin ($5k)\n💡 Start mining and collect rewards hourly!`);
      } else if (action === "start") {
        const miningType = args[2]?.toLowerCase();
        if (!miningType) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank mining start <type>\n\nAvailable: bitcoin, ethereum, litecoin`);
        }

        const result = await callBankAPI('mining/start', 'POST', { miningType });
        if (result.success) {
          return message.reply(`${bankHeader}\n\n⛏️ 𝗠𝗜𝗡𝗜𝗡𝗚 𝗦𝗧𝗔𝗥𝗧𝗘𝗗!\n\n🔥 Mining: ${miningType.toUpperCase()}\n💰 Equipment Cost: $${result.cost.toLocaleString()}\n⚡ Hashrate: ${result.hashrate} H/s\n\n⏰ Come back in an hour to collect rewards!`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "collect") {
        const result = await callBankAPI('mining/collect', 'POST');
        if (result.success) {
          return message.reply(`${bankHeader}\n\n💎 𝗠𝗜𝗡𝗜𝗡𝗚 𝗥𝗘𝗪𝗔𝗥𝗗𝗦!\n\n⛏️ Type: ${result.miningType.toUpperCase()}\n💰 Earned: $${result.earnings.toLocaleString()}\n⏱️ Mining Time: ${result.hoursElapsed} hours\n💎 Total Earned: $${result.totalEarnings.toLocaleString()}`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "status") {
        const result = await callBankAPI(`mining/status/${user}`, 'GET');
        if (result.success) {
          if (!result.mining) {
            return message.reply(`${bankHeader}\n\n⛏️ 𝗠𝗜𝗡𝗜𝗡𝗚 𝗦𝗧𝗔𝗧𝗨𝗦\n\n❌ No active mining operation\n💡 Start mining: ${p}bank mining start <type>`);
          }
          return message.reply(`${bankHeader}\n\n⛏️ 𝗠𝗜𝗡𝗜𝗡𝗚 𝗦𝗧𝗔𝗧𝗨𝗦\n\n🔥 Mining: ${result.miningType.toUpperCase()}\n⏱️ Time: ${result.hoursElapsed} hours\n⚡ Hashrate: ${result.hashrate} H/s\n💰 Estimated: $${result.estimatedEarnings.toLocaleString()}\n💎 Total: $${result.totalEarnings.toLocaleString()}`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      }
    }

    if (command === "farming" || command === "farm") {
      const action = args[1]?.toLowerCase();

      if (!action || action === "help") {
        return message.reply(`${bankHeader}\n\n🌱 𝗙𝗔𝗥𝗠𝗜𝗡𝗚 𝗦𝗬𝗦𝗧𝗘𝗠\n\n• ${p}bank farming plant <crop>\n• ${p}bank farming harvest\n• ${p}bank farming status\n\nCrops:\n🌾 Wheat (1h, $100 profit)\n🌽 Corn (2h, $250 profit)\n🌾 Gold Wheat (4h, $1000 profit)`);
      } else if (action === "plant") {
        const cropType = args[2]?.toLowerCase();
        if (!cropType) {
          return message.reply(`${bankHeader}\n\n💡 Usage: ${p}bank farming plant <crop>\n\nAvailable: wheat, corn, gold_wheat`);
        }

        const result = await callBankAPI('farming/plant', 'POST', { cropType });
        if (result.success) {
          return message.reply(`${bankHeader}\n\n🌱 𝗖𝗥𝗢𝗣 𝗣𝗟𝗔𝗡𝗧𝗘𝗗!\n\n🌾 Crop: ${cropType.replace('_', ' ').toUpperCase()}\n💰 Seeds Cost: $${result.cost.toLocaleString()}\n⏰ Harvest Time: ${result.harvestTime}\n💰 Expected Profit: $${result.expectedProfit.toLocaleString()}`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "harvest") {
        const result = await callBankAPI('farming/harvest', 'POST');
        if (result.success) {
          return message.reply(`${bankHeader}\n\n🌾 𝗛𝗔𝗥𝗩𝗘𝗦𝗧 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘!\n\n💰 Earnings: $${result.earnings.toLocaleString()}\n🌱 Farms Harvested: ${result.farmsHarvested}\n🌤️ Weather Bonus: ${result.weatherBonus}`);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      } else if (action === "status") {
        const result = await callBankAPI(`farming/status/${user}`, 'GET');
        if (result.success) {
          if (result.totalFarms === 0) {
            return message.reply(`${bankHeader}\n\n🌱 𝗙𝗔𝗥𝗠𝗜𝗡𝗚 𝗦𝗧𝗔𝗧𝗨𝗦\n\n❌ No active farms\n💡 Plant crops: ${p}bank farming plant <crop>`);
          }
          let statusMsg = `${bankHeader}\n\n🌱 𝗙𝗔𝗥𝗠𝗜𝗡𝗚 𝗦𝗧𝗔𝗧𝗨𝗦\n\n`;
          statusMsg += `🌾 Total Farms: ${result.totalFarms}\n`;
          statusMsg += `✅ Ready to Harvest: ${result.readyCount}\n\n`;
          
          result.farms.slice(0, 5).forEach((farm, index) => {
            statusMsg += `${index + 1}. ${farm.cropType.replace('_', ' ').toUpperCase()}\n`;
            if (farm.ready) {
              statusMsg += `   ✅ Ready to harvest!\n`;
            } else {
              const hours = Math.ceil(farm.timeLeft / (60 * 60 * 1000));
              statusMsg += `   ⏰ ${hours} hours remaining\n`;
            }
          });
          
          return message.reply(statusMsg);
        } else {
          return message.reply(`${bankHeader}\n\n❌ ${result.message}`);
        }
      }
    }

    if (command === "weather") {
      const result = await callBankAPI('weather/current', 'GET');
      if (result.success) {
        const weatherEmojis = {
          sunny: '☀️',
          rainy: '🌧️',
          stormy: '⛈️',
          snowy: '❄️'
        };
        
        let weatherMsg = `${bankHeader}\n\n🌤️ 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 𝗦𝗬𝗦𝗧𝗘𝗠\n\n`;
        weatherMsg += `${weatherEmojis[result.weather]} Current: ${result.weather.toUpperCase()}\n\n`;
        weatherMsg += `📈 Effects:\n`;
        
        Object.entries(result.effects).forEach(([key, value]) => {
          const effectName = key.replace(/([A-Z])/g, ' $1').toLowerCase();
          weatherMsg += `• ${effectName}: +${(value * 100).toFixed(0)}%\n`;
        });
        
        weatherMsg += `\n🕐 Last Update: ${result.lastUpdate}`;
        weatherMsg += `\n🔄 Next Update: ${result.nextUpdate}`;
        
        return message.reply(weatherMsg);
      } else {
        return message.reply(`${bankHeader}\n\n❌ Unable to fetch weather information`);
      }
    }

    if (command === "events") {
      const result = await callBankAPI('events/current', 'GET');
      if (result.success) {
        let eventsMsg = `${bankHeader}\n\n🎉 𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗘𝗩𝗘𝗡𝗧𝗦\n\n`;
        
        eventsMsg += `🌤️ Weather: ${result.weather.current.toUpperCase()}\n`;
        eventsMsg += `🍂 Season: ${result.season.current.toUpperCase()}\n`;
        eventsMsg += `📊 Economy Multiplier: ${result.economyMultiplier}x\n\n`;
        
        if (result.economyEvent) {
          eventsMsg += `🎊 Active Event: ${result.economyEvent.name.toUpperCase()}\n`;
          eventsMsg += `📈 Multiplier: ${result.economyEvent.multiplier}x\n`;
          eventsMsg += `📝 ${result.economyEvent.description}\n\n`;
        }
        
        eventsMsg += `💡 Weather affects all activities - take advantage!`;
        
        return message.reply(eventsMsg);
      } else {
        return message.reply(`${bankHeader}\n\n❌ Unable to fetch events information`);
      }
    }

    if (command === "quest" || command === "quests") {
      const action = args[1]?.toLowerCase();

      if (!action || action === "daily") {
        const result = await callBankAPI(`quests/daily/${user}`, 'GET');
        if (result.success) {
          let questMsg = `${bankHeader}\n\n🎯 𝗗𝗔𝗜𝗟𝗬 𝗤𝗨𝗘𝗦𝗧𝗦\n\n`;
          
          result.quests.forEach((quest, index) => {
            questMsg += `${index + 1}. ${quest.title}\n`;
            questMsg += `   📝 ${quest.description}\n`;
            questMsg += `   💰 Reward: $${quest.reward.toLocaleString()}\n`;
            questMsg += `   📊 Progress: ${quest.progress}/${quest.target}\n\n`;
          });
          
          questMsg += `🔄 Refreshes: ${result.refreshTime}`;
          
          return message.reply(questMsg);
        } else {
          return message.reply(`${bankHeader}\n\n❌ Unable to fetch daily quests`);
        }
      }
    }

    if (command === "analytics") {
      const action = args[1]?.toLowerCase();

      if (action === "comprehensive") {
        const result = await callBankAPI(`analytics/comprehensive/${user}`, 'GET');
        if (result.success) {
          const stats = result.analytics;
          let analyticsMsg = `${bankHeader}\n\n📊 𝗖𝗢𝗠𝗣𝗥𝗘𝗛𝗘𝗡𝗦𝗜𝗩𝗘 𝗔𝗡𝗔𝗟𝗬𝗧𝗜𝗖𝗦\n\n`;
          
          analyticsMsg += `💎 Total Assets: $${stats.totalAssets.toLocaleString()}\n`;
          analyticsMsg += `💰 Liquid Cash: $${stats.liquidCash.toLocaleString()}\n`;
          analyticsMsg += `🏦 Bank: $${stats.bankBalance.toLocaleString()}\n`;
          analyticsMsg += `💳 Card: $${stats.cardBalance.toLocaleString()}\n`;
          analyticsMsg += `📈 Investments: $${stats.investments.toLocaleString()}\n\n`;
          
          analyticsMsg += `🎯 Level: ${stats.level} (${stats.experience} XP)\n`;
          analyticsMsg += `💎 VIP: ${stats.vipStatus.toUpperCase()}\n`;
          analyticsMsg += `🔥 Daily Streak: ${stats.dailyStreak}\n\n`;
          
          analyticsMsg += `🎮 Gaming Stats:\n`;
          analyticsMsg += `• Games Played: ${stats.gamesPlayed}\n`;
          analyticsMsg += `• Win Rate: ${stats.winRate}%\n`;
          analyticsMsg += `• Biggest Win: $${stats.biggestWin.toLocaleString()}\n\n`;
          
          analyticsMsg += `🏢 Assets:\n`;
          analyticsMsg += `• Businesses: ${stats.businesses}\n`;
          analyticsMsg += `• Real Estate: ${stats.realEstate}\n`;
          analyticsMsg += `• NFTs: ${stats.nfts}\n`;
          analyticsMsg += `• Pets: ${stats.pets}\n\n`;
          
          analyticsMsg += `📋 Total Transactions: ${stats.totalTransactions}`;
          
          return message.reply(analyticsMsg);
        } else {
          return message.reply(`${bankHeader}\n\n❌ Unable to fetch comprehensive analytics`);
        }
      } else {
        const result = await callBankAPI(`analytics/portfolio/${user}`, 'GET');
        if (result.success) {
          const analytics = result.analytics;
          let analyticsMsg = `${bankHeader}\n\n📊 𝗣𝗢𝗥𝗧𝗙𝗢𝗟𝗜𝗢 𝗔𝗡𝗔𝗟𝗬𝗧𝗜𝗖𝗦\n\n`;
          analyticsMsg += `💰 Value: $${analytics.totalValue.toLocaleString()}\n`;
          analyticsMsg += `📈 Stocks: ${analytics.stockAllocation}%\n`;
          analyticsMsg += `💎 Crypto: ${analytics.cryptoAllocation}%\n`;
          analyticsMsg += `🎯 Diversity: ${analytics.diversityScore}/100\n`;
          analyticsMsg += `📊 Assets: ${analytics.assets} | Risk: ${analytics.riskLevel}`;
          return message.reply(analyticsMsg);
        }
      }
    }

    return message.reply(`${bankHeader}\n\n❌ Unknown command: "${command}"\n\n💡 Use "${p}bank help" for all available commands.`);
  },
};
