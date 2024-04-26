const github = require("./scrape/github");
const axios = require('axios');
const fs = require('fs-extra');
const request = require('request');

module.exports.config = {
    name: "github",
    version: "1.0.0",
    hasPermission: 0, 
    credits: "Choru TikTokers",
    description: "Fetches information about a GitHub user.",
    commandCategory: "Utility",
    usages: "[username]",
    prefix: "on",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    try {
        const query = args.join(" "); 
        if (!query) {
            return api.sendMessage("Please provide a GitHub username.", event.threadID, event.messageID);
        }
        const [username, repo] = query.split(" | "); 
        const userData = await github(username, repo);

        const result = `
👤 Name: ${userData.name}
🔖 Nickname: ${userData.nickname}
📝 Bio: ${userData.bio}
👥 Followers: ${userData.followersCount}
👣 Following: ${userData.followingCount}
💻 Top Languages: ${userData.topLanguages}
Followers: ${userData.followers.join(', ') || "Not shown as per request"}
Following: ${userData.following.join(', ') || "Not shown as per request"}
`;

        const imagePath = __dirname + '/cache/github.png';
        const callback = () => {
            api.sendMessage({body: result, attachment: fs.createReadStream(imagePath)}, event.threadID, () => {
                fs.unlinkSync(imagePath);
            }, event.messageID);
        };
        request(encodeURI(userData.avatar)).pipe(fs.createWriteStream(imagePath)).on('close', callback);
    } catch (err) {
        console.error(err);
        api.sendMessage("An error occurred while fetching GitHub user info.", event.threadID);
    }
};
