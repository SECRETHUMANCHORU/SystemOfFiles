module.exports.config = {
    name: "test",
    version: "30.0.0",
    hasPermssion: 0,
    credits: "Choru",
    description: "Find Id with Link",
    commandCategory: "Other",
    usages: "query",
    prefix: "off",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args, stalk }) => {
    try {
        const query = args.join(" ");
        const id = await stalk(query);
        api.sendMessage(id.name, event.threadID, event.messageID);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}
