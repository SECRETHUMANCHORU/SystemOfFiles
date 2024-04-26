const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "30.0.0",
    credits: "Choru TikTokers",
    description: "Notification of bots or people entering groups with canvas"
};

module.exports.run = async function ({ api, event, botId, stalk, getID, token }) {
    const idbot = await botId();
    const gettoken = await token();
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == idbot)) {
        api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? " ": global.config.BOTNAME}`, event.threadID, idbot);
        return api.sendMessage({
            body: `Thanks for add here use my prefix ${global.config.PREFIX} or ${global.config.PREFIX}help`
        }, event.threadID);
    } else {
        try {
            let threadID = event.threadID;
            let {
                threadName,
                participantIDs,
                imageSrc
            } = await api.getThreadInfo(threadID);
            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
            var mentions = [],
                nameArray = [],
                memLength = [],
                i = 0;


            let addedParticipants1 = event.logMessageData.addedParticipants;
            for (let newParticipant of addedParticipants1) {
                userID = newParticipant.userFbId;
                const data = await api.getUserInfo(parseInt(userID));
                var obj = Object.keys(data);
                var userName = data[obj].name.replace("@", "");
                if (userID !== idbot) {
                    nameArray.push(userName);
                    mentions.push({
                        tag: userName, id: userID, fromIndex: 0
                    });
                    memLength.push(participantIDs.length - i++);
                    memLength.sort((a, b) => a - b);

                    let msg = (typeof threadData.customJoin === "undefined") ?
                        "Hi, {name}. Welcome to {threadName}.\nYou're the {soThanhVien}th member of this group, please enjoy! 🥳♥" : threadData.customJoin;
                    msg = msg
                        .replace(/{name}/g, nameArray.join(', '))
                        .replace(/{type}/g, (memLength.length > 1) ? 'Friends' : 'Friend')
                        .replace(/{soThanhVien}/g, memLength.join(', '))
                        .replace(/{threadName}/g, threadName);

                    const link = `https://canvas-nextgen.replit.app/welcome?fbid=${userID}&wc=${threadName.substring(0, 8)}&member=${memLength.join(', ')}&fullname=${nameArray.join(', ')}&link=https://www.facebook.com/profile.php?id=${userID}`;

                    const callback = () => {
                        api.sendMessage({
                            body: msg,
                            mentions,
                            attachment: fs.createReadStream(__dirname + "/cache/welcome.png")
                        }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/welcome.png"));
                    };

                    axios({
                        method: 'GET',
                        url: link,
                        responseType: 'stream'
                    }).then(response => {
                        response.data.pipe(fs.createWriteStream(__dirname + "/cache/welcome.png")).on("close", callback);
                    }).catch(err => {
                        console.error("ERROR: " + err);
                    });
                }
            }
        } catch (err) {
            console.error("ERROR: " + err);
        }
    }
};
