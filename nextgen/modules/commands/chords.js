module.exports.config = {
  name: "chords",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Choru Tikokers",
  description: "Get the Guitar Chords",
  commandCategory: "Other",
  usages: "query",
  prefix: "off",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const query = args.join(" ");
  const tabs = require("ultimate-guitar");

  if (!query) {
    return api.sendMessage("Please provide a search query.", event.threadID, event.messageID);
  }

  try {
    let data = await tabs.firstData(query);

    if (!data) {
      return api.sendMessage("No chords found for this query.", event.threadID, event.messageID);
    }


    api.sendMessage(
      `
      Title: ${data.title}
      Artist: ${data.artist}
      Key: ${data.key}

      Chords: 
      ${data.chords}
      `, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
