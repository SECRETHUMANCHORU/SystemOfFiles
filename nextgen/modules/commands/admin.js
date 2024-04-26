const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "admin",
    version: "30.0.0",
    hasPermssion: 0,
    credits: "Choru Tiktokers",
    description: "Manage bot by admin/owner",
    commandCategory: "config",
    usages: "[list/add/remove] [userID]",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, getID, stalk }) {
    const content = args.slice(1).join(' ');
    const { threadID, messageID, mentions } = event;
    const configPath = path.resolve(__dirname, '..', '..', 'config.json');

    try {
        const configData = require(configPath);
        switch (args[0]) {
            case "list":
case "all":
case "adm": {
    let message = "";
    for (let i = 0; i < configData.ADMINBOT.length; i++) {
        const adminID = configData.ADMINBOT[i];
        try {
            const user = await stalk(adminID);
            if (user && user.name) {
                message += `Admin ID: ${adminID} - Name: ${user.name}\n`;
            } else {
                message += `Error retrieving name for ID: ${adminID}\n`;
            }
        } catch (error) {
            console.error(error);
            message += `I can't get his ID because we are not friends on Facebook, he must add friend first\n`;
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); 
    }
    api.sendMessage(message.trim(), threadID, messageID); 
    break;
}
case "add":
case "added": {
    if (!content) return api.sendMessage("Please provide a user ID or Facebook profile URL to add.", threadID, messageID);
    let userID = content;

    // Extract user ID from Facebook profile URL if provided
    if (userID.includes("facebook.com")) {
        try {
            const url = new URL(userID);
            userID = url.searchParams.get("id");
        } catch (error) {
            console.error(error);
            api.sendMessage("Invalid Facebook profile URL.", threadID, messageID);
            return;
        }
    }

    if (!configData.ADMINBOT.includes(userID)) {
        configData.ADMINBOT.push(userID);
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 4));
        api.sendMessage(`Added ${userID} to the admin list.`, threadID, messageID);
    } else {
        api.sendMessage(`${userID} is already in the admin list.`, threadID, messageID);
    }
    break;
}

case "remove":
case "rm": {
    if (!content) return api.sendMessage("Please provide a user ID or Facebook profile URL to remove.", threadID, messageID);
    let userID = content;

    // Extract user ID from Facebook profile URL if provided
    if (userID.includes("facebook.com")) {
        try {
            const url = new URL(userID);
            userID = url.searchParams.get("id");
        } catch (error) {
            console.error(error);
            api.sendMessage("Invalid Facebook profile URL.", threadID, messageID);
            return;
        }
    }

    if (configData.ADMINBOT.includes(userID)) {
        configData.ADMINBOT = configData.ADMINBOT.filter(id => id !== userID);
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 4));
        api.sendMessage(`Removed ${userID} from the admin list.`, threadID, messageID);
    } else {
        api.sendMessage(`${userID} is not in the admin list.`, threadID, messageID);
    }
    break;
}

            default: {
                api.sendMessage(`Invalid subcommand. Use ${configData.PREFIX}admin [list/add/remove] [userID].`, threadID, messageID);
                break;
            }
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", threadID, messageID);
    }
};
