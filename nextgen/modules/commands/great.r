const fs = require('fs');
const path = require('path'); 

module.exports.config = {
  name: "quotes",
  version: "30.0.0",
  hasPermssion: 0,
  credits: "Choru TikTokers",
  description: "Random quotes",
  commandCategory: "great",
  usages: "simple",
  cooldowns: 5
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  const filePath = path.join(__dirname, "privatecache", "text", "quote.sql");

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    const quotes = data.split('\n').filter(quote => quote.trim() !== '');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const words = ["Hi", "hi"]
    const foundWord = words.find(word => event.body.indexOf(word) === 0);
    if (foundWord) {
      api.sendMessage(randomQuote, event.threadID, event.messageID);
      api.setMessageReaction("❤️", event.messageID, (err) => {}, true);
    }
  });
}

module.exports.run = function({ api, event, client, __GLOBAL }) {

}
