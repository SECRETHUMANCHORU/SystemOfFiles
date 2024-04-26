module.exports.config = {
  name: "leave",
  version: "30.0.0",
  hasPermssion: 2,
  credits: "ChoruTikokers",
  description: "leave box",
  commandCategory: "Admin",
  usages: "leave [tid]",
  prefix: false,
  cooldowns: 3
};

module.exports.run = async function({ api, event, args, botId }) {
  const id = await botId(); 
if (!global.config.ADMINBOT[0].includes(event.senderID)) return api.sendMessage("You don't have permission to use this command", event.threadID, event.messageID);
   /* const tid = args.join(" ")
   let namee = await api.getThreadInfo(tid)*/
  const tid = event.threadID;
  if (!tid) return api.removeUserFromGroup(id, event.threadID);

else return api.removeUserFromGroup(id, tid, () => api.sendMessage("The bot has left this group", event.threadID, event.messageID));

}