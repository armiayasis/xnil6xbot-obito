
const config = {
  name: "help",
  aliases: ["help"],
  description: "Show all available bot commands in stylish design",
  usage: "[page/all]",
  cooldown: 1,
  permissions: [0],
  credits: "messandra team"
};

async function onStart({ message, args }) {
  const allCommands = Array.from(global.GoatBot.commands.values());
  const commandNames = allCommands.map(cmd => `.${cmd.config.name}`).join("\n");

  // Check if a specific page or 'all' was requested
  const requestedPage = args[0] ? args[0].toLowerCase() : 'all';
  let response;

  if (requestedPage === 'all') {
    response = `
❯ 𝙈𝙀𝙎𝙎𝘼𝙉𝘿𝙍𝘼 𝙎𝙔𝙎𝙏𝙀𝙈
━━━━━━━━━━━━━━━

${commandNames}

➥ 𝖳𝗋𝗒 𝗍𝗈 𝙀𝙭𝙥𝙡𝙤𝙧𝙚 𝗆𝗈𝗋𝖾 𝖼𝗈𝗆𝗺𝖺𝗻𝖽𝗌!
➥ 𝖵𝗂𝖾𝗂𝗏 𝖠𝖫𝖫 𝖢𝖮𝖬𝖬𝖠𝖭𝖣𝖲: /𝙝𝙚𝙡𝙥 𝗮𝗹𝗹
➥ 𝖵𝗂𝖾𝗂𝗏 𝖻𝗒 𝗉𝖺𝗀𝖾: /𝙝𝙚𝙡𝙥 <𝗽𝗮𝗴𝗲>
➥ 𝖵𝗂𝖾𝗂𝗏 𝖻𝖺𝗌𝗂𝖼𝗌: /𝙝𝙚𝙡𝙥 𝗯𝗮𝘀𝗶𝗰𝘀

✦ 𝙋𝙊𝙒𝙀𝙍𝙀𝘿 𝘽𝙔 𝘾𝘼𝙎𝙎𝙄𝘿𝙔🎀
━━━━━━━ ✕ ━━━━━━`;
  } else {
    const pageNumber = parseInt(requestedPage);
    if (isNaN(pageNumber) || pageNumber < 1) {
      return message.reply("⚠️ Please specify a valid page number or use 'all' to see all commands.");
    }

    const commandsPerPage = 5; // Number of commands displayed per page
    const startIndex = (pageNumber - 1) * commandsPerPage;
    const endIndex = startIndex + commandsPerPage;
    const commandsOnPage = allCommands.slice(startIndex, endIndex);

    if (commandsOnPage.length === 0) {
      return message.reply(`⚠️ No commands found on page ${pageNumber}.`);
    }

    const pageCommands = commandsOnPage.map(cmd => `.${cmd.config.name}`).join("\n");
    response = `
❯ 𝙈𝙀𝙎𝙎𝘼𝙉𝘿𝙍𝘼 𝙎𝙔𝙎𝙏𝙀𝙈 - Page ${pageNumber}
━━━━━━━━━━━━━━━

${pageCommands}

➥ 𝖳𝗋𝗒 𝗍𝗼 𝙀𝙭𝙥𝙡𝙤𝙧𝙚 𝗆𝗈𝗋𝖾 𝖼𝗈𝗺𝗺𝖺𝗻𝖽𝗌!
➥ 𝖵𝗂𝖾𝗂𝗏 𝖠𝖫𝖫 𝖢𝖮𝖬𝖬𝖠𝖭𝖣𝖲: /𝙝𝙚𝙡𝙥 𝗮𝗹𝗹
➥ 𝖵𝗂𝖾𝗂𝗏 𝖻𝗒 𝗉𝖺𝗀𝖾: /𝙝𝙚𝙡𝙥 <𝗽𝗮𝗴𝗲>
➥ 𝖵𝗂𝖾𝗂𝗏 𝖻𝖺𝗌𝗂𝖼𝗌: /𝙝𝙚𝙡𝙥 𝗯𝗮𝘀𝗶𝗰𝘀

✦ 𝙋𝙊𝙒𝙀𝙍𝙀𝘿 𝘽𝙔 𝘾𝘼𝙎𝙎𝙄𝘿𝙔🎀
━━━━━━━ ✕ ━━━━━━`;
  }

  return message.reply(response);
}

module.exports = {
  config,
  onStart
};
