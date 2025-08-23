const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "data", "minecraft.json");
let gameData = {};

if (fs.existsSync(dataPath)) {
  gameData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
} else {
  fs.writeFileSync(dataPath, "{}");
}

function saveData() {
  fs.writeFileSync(dataPath, JSON.stringify(gameData, null, 2));
}

module.exports = {
  config: {
    name: "minecraft",
    aliases: ["mc"],
    version: "2.2",
    author: "YourName",
    shortDescription: { en: "⛏️ Minecraft mini-game with save system" },
    longDescription: { en: "Mine blocks, craft pickaxes, and collect resources. Now with saving!" },
    category: "game",
    role: 0,
    cooldowns: 2,
  },

  onStart: async function ({ message, event, args }) {
    const command = args[0]?.toLowerCase();
    const uid = event.senderID;

    // Load player data or initialize
    if (!gameData[uid]) {
      gameData[uid] = {
        inventory: {
          wood: 5,
          cobblestone: 0,
          coal: 0,
          iron: 0,
          gold: 0,
          diamond: 0,
        },
        tool: {
          name: "wooden",
          durability: 10,
        },
        stats: {
          xp: 0,
          level: 1,
          fights: 0,
          mined: 0,
        }
      };
    }

    const player = gameData[uid];

    const tools = {
      wooden: { next: "stone", needs: { wood: 5 }, durability: 15, emoji: "🪵" },
      stone: { next: "iron", needs: { cobblestone: 10 }, durability: 25, emoji: "🪨" },
      iron: { next: "gold", needs: { iron: 5 }, durability: 35, emoji: "⛓️" },
      gold: { next: "diamond", needs: { gold: 5 }, durability: 50, emoji: "🟡" },
      diamond: { next: null, needs: {}, durability: 100, emoji: "💎" },
    };

    const lootTable = [
      { item: "coal", base: 40, emoji: "⚫" },
      { item: "iron", base: 25, emoji: "⛓️" },
      { item: "gold", base: 15, emoji: "🟡" },
      { item: "diamond", base: 8, emoji: "💎" },
      { item: "nothing", base: 12, emoji: "❌" },
    ];

    if (command === "mine") {
      const tool = player.tool;
      if (tool.durability <= 0) {
        return message.reply(`🛠️ Your ${tools[tool.name].emoji} ${tool.name} pickaxe is broken!\n🔧 Use \`mc craft\` to build a new one.`);
      }

      tool.durability--;
      player.stats.mined++;

      let found = "nothing";
      const bonus = Object.keys(tools).indexOf(tool.name) * 1.2;
      const roll = Math.random() * 100;

      let sum = 0;
      for (const entry of lootTable) {
        sum += entry.base + bonus;
        if (roll <= sum) {
          found = entry.item;
          break;
        }
      }

      if (found === "nothing") {
        saveData();
        return message.reply(`🪓 You mined... but found ❌ nothing!\n🔧 Pickaxe durability: ${tool.durability}`);
      }

      player.inventory[found]++;
      player.stats.xp += 5;
      const emoji = lootTable.find(e => e.item === found)?.emoji || "📦";

      saveData();
      return message.reply(`⛏️ You found ${emoji} **${found.toUpperCase()}**!\n🔧 Durability: ${tool.durability} | 🧪 XP: ${player.stats.xp}`);
    }

    if (["inv", "inventory"].includes(command)) {
      const invText = Object.entries(player.inventory)
        .map(([k, v]) => `📦 ${k.toUpperCase()}: ${v}`)
        .join("\n");
      return message.reply(
        `🎒 Inventory:\n${invText}\n\n🛠️ ${tools[player.tool.name].emoji} ${player.tool.name.toUpperCase()} Pickaxe (${player.tool.durability} durability)`
      );
    }

    if (command === "craft") {
      const current = player.tool.name;
      const nextTool = tools[current].next;

      if (!nextTool) return message.reply("💎 You already have the best pickaxe!");

      const recipe = tools[current].needs;
      const canCraft = Object.entries(recipe).every(([item, qty]) => player.inventory[item] >= qty);

      if (!canCraft) {
        const needed = Object.entries(recipe)
          .map(([i, q]) => `🔹 ${i.toUpperCase()}: ${q}`)
          .join("\n");
        return message.reply(`❌ Not enough resources to craft ${tools[nextTool].emoji} **${nextTool.toUpperCase()}** Pickaxe.\n\n🧱 Needed:\n${needed}`);
      }

      for (const [item, qty] of Object.entries(recipe)) {
        player.inventory[item] -= qty;
      }

      player.tool.name = nextTool;
      player.tool.durability = tools[nextTool].durability;

      saveData();
      return message.reply(`✅ Crafted: ${tools[nextTool].emoji} **${nextTool.toUpperCase()}** Pickaxe!\n🔧 Durability: ${player.tool.durability}`);
    }

    if (command === "stats") {
      return message.reply(
        `📊 Player Stats:\n` +
        `🧪 XP: ${player.stats.xp}\n` +
        `🔼 Level: ${player.stats.level}\n` +
        `⛏️ Blocks mined: ${player.stats.mined}\n` +
        `⚔️ Fights: ${player.stats.fights}`
      );
    }

    if (command === "reset") {
      delete gameData[uid];
      saveData();
      return message.reply("🔄 Your Minecraft progress has been reset!");
    }

    return message.reply(
      `🧱 Minecraft Commands:\n\n` +
      `⛏️ mc mine – Mine random blocks\n` +
      `🎒 mc inventory – View your inventory\n` +
      `🛠️ mc craft – Upgrade your pickaxe\n` +
      `📊 mc stats – View your XP & level\n` +
      `🔄 mc reset – Reset your data`
    );
  }
};
