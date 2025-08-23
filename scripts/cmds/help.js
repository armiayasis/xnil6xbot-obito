const config = {
  name: "help",
  aliases: ["help"],
  description: "Show all available bot commands in stylish design",
  usage: "[page/all]",
  cooldown: 3,
  permissions: [0],
  credits: "Liane Cagara"
};

async function onStart({ message }) {
  const allCommands = Array.from(global.GoatBot.commands.values());
  const commandNames = allCommands.map(cmd => `.${cmd.config.name}`).join("\n");
  const design = `
❯ 𝙈𝙀𝙎𝙎𝘼𝙉𝘿𝙍𝘼 𝙎𝙔𝙎𝙏𝙀𝙈🧰 ━━━━━━━━━━━━━━━
${commandNames}
➥ 𝖳𝗋𝗒 𝗍𝗈 𝙀𝙭𝙥𝙡𝙤𝙧𝙚 𝗆𝗈𝗋𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌!
➥ 𝖵𝗂𝖾𝗐 𝖠𝖫𝖫 𝖢𝖮𝖬𝖬𝖠𝖭𝖣𝖲:
/𝙝𝙚𝙡𝙥 𝗮𝗹𝗹
➥ 𝖵𝗂𝖾𝗐 𝖻𝗒 𝗉𝖺𝗀𝖾:
 /𝙝𝙚𝙡𝙥 <𝗽𝗮𝗴𝗲>
➥ 𝖵𝗂𝖾𝗐 𝖻𝖺𝗌𝗂𝖼𝗌: 
/𝙝𝙚𝙡𝙥 𝗯𝗮𝘀𝗶𝗰𝘀
✦ 𝙋𝙊𝙒𝙀𝙍𝙀𝘿 𝘽𝙔 𝘾𝘼𝙎𝙎𝙄𝘿𝙔🎀 ━━━━━━━ ✕ ━━━━━━
`;
  return message.reply(design);
}

module.exports = {
  config,
  onStart
};
