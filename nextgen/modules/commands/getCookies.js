module.exports.config = {
    name: "getcookie",
    version: "30.0.0",
    hasPermssion: 0,
    credits: "Choru",
    description: "getCookies on appstate",
    commandCategory: "Other",
    usages: "query",
    prefix: "off",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args, cookies }) => {
    try {
  if (![global.config.OWNER].includes(event.senderID)) 
return api.sendMessage("You tried this command, sorry, only the owner is not allowed to use it", event.threadID, event.messageID);
        const id = await cookies();
        api.sendMessage(id, event.threadID, event.messageID);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}
