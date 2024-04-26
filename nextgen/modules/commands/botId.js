module.exports.config = {
  name: "botId",
  version: "30.0.0",
  hasPermssion: 0,
  credits: "Choru",
  description: "get the bot id",
  commandCategory: "Other",
  usages: "query",
  prefix: "off",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args, botId }) => {
  try {
    const id = await botId(); 
    api.sendMessage(`Bot ID: ${id}`, event.threadID); 
  } catch (error) {
    console.error('Error retrieving Bot ID:', error);
    throw error;
  }
}
