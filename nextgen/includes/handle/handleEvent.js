module.exports = function ({api ,models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");
   	const moment = require("moment");

    return function ({ event }) {
        const timeStart = Date.now()
        const time = moment.tz("Asia/Manila").format("HH:MM:ss L");
        const { userBanned, threadBanned } = global.data;
        const { events } = global.client;

      async function cookies() {
         const getCookies = require('../../source').getCookies;
          try {
              const result = await getCookies();
              return result;
          } catch (error) {
              console.error('Error retrieving COOKIES:', error);
              throw error;
          }
      };

      async function token() {
         const getToken = require('../../source').getToken;
          try {
              const result = await getToken();
              return result;
          } catch (error) {
              console.error('Error retrieving ID:', error);
              throw error;
          }
      };
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

        const { allowInbox, DeveloperMode } = global.config;
        var { senderID, threadID } = event;
        senderID = String(senderID);
        threadID = String(threadID);
        if (userBanned.has(senderID)|| threadBanned.has(threadID) || allowInbox == ![] && senderID == threadID) return;
        for (const [key, value] of events.entries()) {
            if (value.config.eventType.indexOf(event.logMessageType) !== -1) {
                const eventRun = events.get(key);
                try {
                    const Obj = {};
                    Obj.api = api
                  Obj.botId = botId
            Obj.cookies =  cookies
            Obj.stalk = stalk
            Obj.token = token
            Obj.getID = getID
                    Obj.event = event
                    Obj.models= models 
                    Obj.Users= Users 
                    Obj.Threads = Threads
                    Obj.Currencies = Currencies 
                    eventRun.run(Obj);
                    if (DeveloperMode == !![]) 
                    	logger(global.getText('handleEvent', 'executeEvent', time, eventRun.config.name, threadID, Date.now() - timeStart), '[ Event ]');
                } catch (error) {
                    logger(global.getText('handleEvent', 'eventError', eventRun.config.name, JSON.stringify(error)), "error");
                }
            }
        }
        return;
    };
}