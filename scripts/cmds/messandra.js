 const axios = require('axios');

module.exports.config = {
  name: 'messandra',
  version: '1.0.0',
  hasPermission: 0,
  usePrefix: false,
  aliases: ['gpt', 'openai'],
  description: "An AI command powered by GPT-4o & Gemini Vision",
  usages: "ai [prompt]",
  credits: 'LorexAi',
  cooldowns: 0,
  dependencies: {
    "axios": ""
  }
};

// Function to get the current time in the Philippines
function getCurrentTimeInPhilippines() {
  const options = { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  return new Date().toLocaleTimeString('en-US', options);
}

// Function to create a time box message
function getTimeBoxMessage() {
  const currentTime = getCurrentTimeInPhilippines();
  return `
🕒 ━━━━━━━━━━━━━━━━━━━━━ 🕒
   🌸 𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗧𝗜𝗠𝗘 𝗣𝗛𝗜𝗟𝗜𝗣𝗣𝗜𝗡𝗘𝗦 🌸
   ⏰ ${currentTime}
🕒 ━━━━━━━━━━━━━━━━━━━━━ 🕒
  `;
}

// Function to handle the command when invoked
module.exports.onStart = async function({ api, event, args }) {
  const input = args.join(' ');
  const timeBox = getTimeBoxMessage();

  // Check if input is empty
  if (!input) {
    return api.sendMessage(
      `🌟 Greetings! I am 𝗠𝗲𝘀𝘀𝗮𝗻𝗱𝗿𝗮, your gateway to GPT-4 intelligence. I am here to assist you.\n\n` +
      `${timeBox}\n` +
      `👤 Please tell me your name and Facebook details!`,
      event.threadID,
      event.messageID
    );
  }

  // Check if the message is a reply and contains a photo
  const isPhoto = event.type === "message_reply" && event.messageReply.attachments[0]?.type === "photo";
  if (isPhoto) {
    const photoUrl = event.messageReply.attachments[0].url;

    api.sendMessage("🔄 Analyzing Image...", event.threadID, event.messageID);

    try {
      const { data } = await axios.get('https://daikyu-api.up.railway.app/api/gemini-flash-vision', {
        params: {
          prompt: input,
          imageUrl: photoUrl
        }
      });

      // Check if the response contains the expected data
      if (data && data.response) {
        const responseMessage = `✅ 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗:\n${data.response}\n\n${timeBox}`;
        return api.sendMessage(responseMessage, event.threadID, (err) => {
          if (err) {
            console.error("Error sending message:", err);
          }
        }, event.messageID);
      } else {
        return api.sendMessage("Unexpected response format from the photo analysis API.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error("Error processing photo analysis request:", error.message || error);
      api.sendMessage("An error occurred while processing the photo. Please try again.", event.threadID, event.messageID);
    }

    return; // Exit early if processing a photo
  }

  // Indicate that a response is being generated
  api.sendMessage("🔄 Generating response...", event.threadID, event.messageID);

  try {
    const { data } = await axios.get('https://daikyu-api.up.railway.app/api/gpt-4o', {
      params: {
        query: input,
        uid: event.senderID
      }
    });

    // Check if the response contains the expected data
    if (data && data.response) {
      const responseMessage = `✅ 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗:\n${data.response}\n\n${timeBox}`;
      return api.sendMessage(responseMessage, event.threadID, (err) => {
        if (err) {
          console.error("Error sending message:", err);
        }
      }, event.messageID);
    } else {
      return api.sendMessage("Unexpected response format from the API.", event.threadID, event.messageID);
    }

  } catch (error) {
    console.error("Error processing request:", error.message || error);
    api.sendMessage("An error occurred while processing your request. Please try again.", event.threadID, event.messageID);
  }

  // Listen for the user to send their name and Facebook details
  api.listen((response) => {
    const userName = response.body; // Assuming the user sends their name/details in response
    const userFacebookDetails = `👤 𝗡𝗮𝗺𝗲: ${userName}\n\n${timeBox}`;
    
    api.sendMessage(userFacebookDetails, event.threadID, event.messageID);
  });
};
