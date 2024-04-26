module.exports.config = {
  name: "fbid",
  version: "30.0.0",
  hasPermssion: 0,
  credits: "Choru Tiktokers",
  description: "Get id with mention or sender",
  commandCategory: "Other",
  usages: "query",
  prefix: "off",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args, getID }) => {
  const query = args.join(" ");

  if (query.startsWith("https")) {
    const id = await getID(query);
    return api.sendMessage(id, event.threadID, event.messageID);
  }

  if (event.type == "message_reply") { 
    const uid = event.messageReply.senderID;
    return api.sendMessage(uid, event.threadID, event.messageID);
  }

  if (Object.keys(event.mentions).length == 0) {
    return api.sendMessage(event.senderID, event.threadID, event.messageID);
  } else {
    for (const mention in event.mentions) {
      api.sendMessage(mention, event.threadID);
    }
    return;
  }
};
