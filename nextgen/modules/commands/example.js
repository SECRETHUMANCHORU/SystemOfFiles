module.exports.config = {
  name: "nameCommand", // Command name, used when calling the command
  version: "version", // Version of this module
  hasPermssion: 0/1/2, // Permission level required to use, with 0 for all members, 1 for admins and above, 2 for admin/owner
  credits: "Name need credit", // Name that needs credit for this module
  description: "say bla bla here", // Detailed description of the command
  commandCategory: "group", // Belongs to which group: system, other, game-sp, game-mp, random-img, edit-img, media, economy, ...
  usages: "[option] [text]", // How to use the command
  cooldowns: 5, // Cooldown time in seconds
  dependencies: {
    "packageName": "version"
  }, //List external package modules here to automatically install when loading the command!
  envConfig: {
    //This is where you will set up the entire module's environment, such as APIKEY, ...
  }
};

module.exports.languages = {
  "vi": {
    //Do whatever you want here ¯\_(ツ)_/¯ 
  },
  "en": {
    //Do whatever you want here ¯\_(ツ)_/¯ 
  }
}

module.exports.run = function({ api, event, args, models, Users, Threads, Currencies, permssion, botId, cookies, token, getID, stalk}) {
  //Do whatever you want here ¯\_(ツ)_/¯ 
}


module.exports.onLoad = function ({ configValue }) {
  //Do whatever you want here ¯\_(ツ)_/¯ 
}

module.exports.handleReaction = function({ api, event, models, Users, Threads, Currencies, handleReaction, models }) {
  //Do whatever you want here ¯\_(ツ)_/¯ 
}

module.exports.handleReply = function({ api, event, models, Users, Threads, Currencies, handleReply, models }) {
  //Do whatever you want here ¯\_(ツ)_/¯ 
}

module.exports.handleEvent = function({ event, api, models, Users, Threads, Currencies }) {
  //Do whatever you want here ¯\_(ツ)_/¯ 
}

module.exports.handleSedule = function({ event, api, models, Users, Threads, Currencies, scheduleItem }) {
  //Do whatever you want here ¯\_(ツ)_/¯ 
}
