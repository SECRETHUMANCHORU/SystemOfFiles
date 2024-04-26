const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "element",
  version: "30.0.0",
  hasPermssion: 0,
  credits: "Choru",
  description: "element random or search",
  commandCategory: "Other",
  usages: "query",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const filePath = path.join(__dirname, "privatecache", "school", "data.json");
  let query = '';

  if (args.length === 0) {
    query = getRandomElementName(filePath);
  } else {
    query = args.join(" ").toLowerCase();
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);

      if (!args.length) {
       
        const elementName = getRandomElementName(filePath);
        const element = jsonData.elements.find(e => e.name.toLowerCase() === elementName.toLowerCase());
        sendMessage(api, event.threadID, element);
      } else {
      
        const element = jsonData.elements.find(e => e.name.toLowerCase() === query || e.name.toLowerCase().includes(query));
        if (element) {
          sendMessage(api, event.threadID, element);
        } else {
          console.log('Element not found:', query);
          api.sendMessage(`Element '${query}' not found.`, event.threadID, event.messageID);
        }
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });
};

function getRandomElementName(filePath) {
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const elements = jsonData.elements.map(e => e.name);
  return elements[Math.floor(Math.random() * elements.length)];
}

function sendMessage(api, threadID, element) {
  let message = 'ℹ️ Element Information ℹ️\n\n';
  for (const [key, value] of Object.entries(element)) {
    if (value && !['xpos', 'ypos', 'shells', 'electron_configuration', 'electron_configuration_semantic', 'electron_affinity', 'electronegativity_pauling', 'ionization_energies', 'cpk-hex'].includes(key)) {
      message += `▶️ ${capitalizeFirstLetter(key)}: ${value}\n`;
    }
  }
  api.sendMessage(message, threadID);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
