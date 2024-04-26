const chalk = require('chalk');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");
    return async function ({ event }) {
        const { allUserID, allCurrenciesID, allThreadID, userName, threadInfo } = global.data; 
        const { autoCreateDB } = global.config;
        if (autoCreateDB == ![]) return;
        let { senderID, threadID } = event;
        senderID = String(senderID);
        threadID = String(threadID);
        try {
            if (!allThreadID.includes(threadID) && event.isGroup == !![]) {
                const threadIn4 = await Threads.getInfo(threadID);
                const setting = {
                    threadName: threadIn4.threadName,
                    adminIDs: threadIn4.adminIDs,
                    nicknames: threadIn4.nicknames
                };
                const dataThread = setting;
                allThreadID.push(threadID)
                threadInfo.set(threadID, dataThread);

                const setting2 = {
                    threadInfo: dataThread,
                    data: {}
                };
                await Threads.setData(threadID, setting2);
                for (const singleData of threadIn4.userInfo) {
                    userName.set(String(singleData.id), singleData.name);
                    try {
                        if (global.data.allUserID.includes(String(singleData.id))) {
                            await Users.setData(String(singleData.id), {
                                'name': singleData.name
                            });
                            global.data.allUserID.push(singleData.id);
                        } else {
                            await Users.createData(singleData.id, {
                                'name': singleData.name,
                                'data': {}
                            });
                            global.data.allUserID.push(String(singleData.id));
                            global.data.allUserID.push(String(singleData.name));
                            logger(`NewUser:`)
                            logger(`Name: ${singleData.name}`)
                            logger(`Uid/Fbid: ${singleData.id}`)
                        }
                    } catch(e) { 
                        console.log(e);
                    }
                }
                logger(`NewThread:`)
                logger(`Name: ${threadIn4.threadName}`)
                logger(`IDGC: ${threadID}`)
            }
            if (!allUserID.includes(senderID) || !userName.has(senderID)) {
                const infoUsers = await Users.getInfo(senderID);
                const setting3 = {
                    name: infoUsers.name
                };
                await Users.createData(senderID, setting3);
                allUserID.push(senderID) 
                userName.set(senderID, infoUsers.name)
                logger(`NewUser:`)
                logger(`Name: ${infoUsers.name}`)
                logger(`Uid/Fbid: ${senderID}`)
            }


            if (!allCurrenciesID.includes(senderID)) {
                const setting4 = {};
                setting4.data = {};
                await Currencies.createData(senderID, setting4); 
                allCurrenciesID.push(senderID);
            }
            return;
        } catch (err) {
            console.log(err);
            return;
        }
    };
};
