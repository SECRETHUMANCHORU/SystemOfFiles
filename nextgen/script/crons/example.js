const fs = require('fs');
const request = require('request');
const cron = require('node-cron');
//video 
//scroll up/down if you want see another
module.exports = function ({ api, botmodels }) {
  cron.schedule('*/1 * * * *', async () => {
    try {
      const list = await api.getThreadList(100, null, ["INBOX"]);
      list.forEach(thread => {
        if (thread.isGroup && thread.threadID != list.threadID) {
          const link = "https://drive.google.com/uc?id=1cU1QQ3W1fYO5tjvxYo8lFAyjZ4Bel1xQ";
          const callback = () => {
            api.sendMessage({
              body: 'Check out this video!',
              attachment: fs.createReadStream(__dirname + "/video.mp4")
            }, thread.threadID, () => fs.unlinkSync(__dirname + "/video.mp4"));
          };
          request(encodeURI(link)).pipe(fs.createWriteStream(__dirname + "/video.mp4")).on("close", callback);
        }
      });
    } catch (err) {
      console.error('Error in video cron job:', err);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });
};

//audio
const fs = require('fs');
const request = require('request');
const cron = require('node-cron');

module.exports = function ({ api, botmodels }) {
  cron.schedule('*/1 * * * *', async () => {
    try {
      const list = await api.getThreadList(100, null, ["INBOX"]);
      list.forEach(thread => {
        if (thread.isGroup && thread.threadID != list.threadID) {
          const link = "https://drive.google.com/uc?id=1ilSBkrxlpRAZiHGdnuqFhYAloEsqmYTP";
          const callback = () => {
            api.sendMessage({
              body: 'Check out this audio!',
              attachment: fs.createReadStream(__dirname + "/audio.mp3")
            }, thread.threadID, () => fs.unlinkSync(__dirname + "/audio.mp3"));
          };
          request(encodeURI(link)).pipe(fs.createWriteStream(__dirname + "/audio.mp3")).on("close", callback);
        }
      });
    } catch (err) {
      console.error('Error in audio cron job:', err);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });
};


//image
const fs = require('fs');
const request = require('request');
const cron = require('node-cron');

module.exports = function ({ api, botmodels }) {
  cron.schedule('*/1 * * * *', async () => {
    try {
      const list = await api.getThreadList(100, null, ["INBOX"]);
      list.forEach(thread => {
        if (thread.isGroup && thread.threadID != list.threadID) {
          const link = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRky365Df5u_CCvDCNpH24mp1aOLJ4jvIUqCEWwYoXhbIz1nBxSSbUbJd0&s=10";
          const callback = () => {
            api.sendMessage({
              body: 'Son Goku!',
              attachment: fs.createReadStream(__dirname + "/text.jpg")
            }, thread.threadID, () => fs.unlinkSync(__dirname + "/text.jpg"));

          request(encodeURI(link)).pipe(fs.createWriteStream(__dirname + "/text.jpg")).on("close", callback);
        }
      });
    } catch (err) {
      console.error('Error in text cron job:', err);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });
};


//text only
const fs = require('fs');
const request = require('request');
const cron = require('node-cron');

module.exports = function ({ api, botmodels }) {
  cron.schedule('*/1 * * * *', async () => {
    try {
      const list = await api.getThreadList(100, null, ["INBOX"]);
      list.forEach(thread => {
        if (thread.isGroup && thread.threadID != list.threadID) {
api.sendMessage("hello", thread.threadID)
      });
    } catch (err) {
      console.error('Error in text cron job:', err);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });
}; 