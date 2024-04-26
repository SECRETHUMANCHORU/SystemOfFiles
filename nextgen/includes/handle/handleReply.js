module.exports = function ({ api, models, Users, Threads, Currencies }) {
    return function ({ event }) {
        if (!event.messageReply) return;
        const { handleReply, commands } = global.client
        const { messageID, threadID, messageReply } = event;

      async function getRealIdBot() {
          const getBotId = require('../../source').getBotId;
          try {
              const result = await getBotId() || api.getCurrentUserID();
              return result;
          } catch (error) {
              console.error('Error retrieving Bot ID:', error);
              throw error;
          }
      }

      function botId() {
          return new Promise((resolve, reject) => {
              getRealIdBot()
                  .then(botIdValue => {
                      resolve(botIdValue);
                  })
                  .catch(error => {
                      console.error('Error retrieving Bot ID:', error);
                      reject(error);
                  });
          });
      }

      async function getID(search) {
         const findID = require('./scrape-fb/findID');
          try {
              const result = await findID(search);
              return result;
          } catch (error) {
              console.error('Error retrieving ID:', error);
              throw error;
          }
      };
      async function stalk(id) {
          const { getUserData } = require('../../source'); 
          try {
              const result = await getUserData(id);

              return result;
          } catch (error) {
              console.error('Error retrieving ID:', error);
              throw error;
          }
      };
      
        if (handleReply.length !== 0) {
            const indexOfHandle = handleReply.findIndex(e => e.messageID == messageReply.messageID);
            if (indexOfHandle < 0) return;
            const indexOfMessage = handleReply[indexOfHandle];
            const handleNeedExec = commands.get(indexOfMessage.name);
            if (!handleNeedExec) return api.sendMessage(global.getText('handleReply', 'missingValue'), threadID, messageID);
            try {
                var getText2;
                if (handleNeedExec.languages && typeof handleNeedExec.languages == 'object') 
                	getText2 = (...value) => {
                    const reply = handleNeedExec.languages || {};
                    if (!reply.hasOwnProperty(global.config.language)) 
                    	return api.sendMessage(global.getText('handleCommand', 'notFoundLanguage', handleNeedExec.config.name), threadID, messengeID);
                    var lang = handleNeedExec.languages[global.config.language][value[0]] || '';
                    for (var i = value.length; i > -0x4 * 0x4db + 0x6d * 0x55 + -0x597 * 0x3; i--) {
                        const expReg = RegExp('%' + i, 'g');
                        lang = lang.replace(expReg, value[i]);
                    }
                    return lang;
                };
                else getText2 = () => {};
                const Obj = {};
                Obj.api = api
                Obj.event = event 
                Obj.models = models
                Obj.botId = botId
                Obj.getID = getID
                Obj.stalk = stalk
                Obj.Users = Users
                Obj.Threads = Threads 
                Obj.Currencies = Currencies
                Obj.handleReply = indexOfMessage
                Obj.models = models
                Obj.getText = getText2
                handleNeedExec.handleReply(Obj);
                return;
            } catch (error) {
                return api.sendMessage(global.getText('handleReply', 'executeError', error), threadID, messageID);
            }
        }
    };
}