module.exports.config = {
  name: "\n",
  version: "30.0.0",
  hasPermssion: 0,
  credits: "Choru",
  description: "Nothing special here",
  commandCategory: "called",
  usages: "nothing, only call prefix",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const fs = require('fs');
  const path = require('path');
  const { commands } = global.client;
  const commandName = (args[0] || "").toLowerCase();
  const command = commands.get(commandName);

  const filePath = path.join(__dirname, "privatecache", "text", "quote.sql");

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    const words = data.split('\n').filter(quote => quote.trim() !== '');
    const random = words[Math.floor(Math.random() * words.length)];

    const commandNames = Array.from(commands.values()).map(cmd => cmd.config.name);
    const randomCommandName = commandNames[Math.floor(Math.random() * commandNames.length)];

    api.sendMessage(`${random}\n\nThis is the list of module cmds that you might want command ->\n${global.config.PREFIX}help ${randomCommandName}`, event.threadID, event.messageID);
  });
};
