const fs = require("fs");
const axios = require("axios");

module.exports.config = {
    name: "Leavenoti",
    eventType: ["log:unsubscribe"],
    version: "30.0.0",
    credits: "Choru TikTokers",
    description: "Notification of bots or people leaving groups with canvas",
    dependencies: {
        "request": ""
    }
};

module.exports.run = async function({ api, event, Users, Threads, botId }) {
  const idbot = await botId();
    if (event.logMessageData.leftParticipantFbId == idbot) return;

    async function reply(data) {
        try {
            await api.sendMessage(data, event.threadID, event.messageID);
        } catch (err) {
            console.error("Error sending message:", err);
        }
    }

    let { threadName, participantIDs, imageSrc } = await api.getThreadInfo(event.threadID);
    const type = (event.author == event.logMessageData.leftParticipantFbId) 
                 ? "left the group." 
                 : "was kicked by an admin.";

    let pathh = __dirname + `/cache/goodbye.png`;
    let name = (await api.getUserInfo(event.logMessageData.leftParticipantFbId))[event.logMessageData.leftParticipantFbId].name;

    try {
        let image = (
            await axios.get(`https://canvas-nextgen.replit.app/goodbye?&fbid=${event.logMessageData.leftParticipantFbId}&gb=${threadName.substring(0, 8)}&member=${participantIDs.length}&fullname=${name}&link=https://www.facebook.com/profile.php?id=${event.logMessageData.leftParticipantFbId}`, {
                responseType: "arraybuffer",
            })
        ).data;

        fs.writeFileSync(pathh, Buffer.from(image, "utf-8"));
        const messageContent = {
            body: `${name} has ${type}\nMembers remaining: ${participantIDs.length}`,
            attachment: fs.createReadStream(pathh)
        };

        await reply(messageContent);
    } catch (err) {
        console.error("Error fetching or processing image:", err);
    }
};
