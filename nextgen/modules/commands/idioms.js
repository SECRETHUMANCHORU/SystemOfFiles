module.exports.config = {
    name: "idioms",
    version: "1.0.0",
    hasPermission: 0, 
    credits: "Choru TikTokers",
    description: "The 'idioms' platform is a comprehensive repository of idiomatic expressions from around the world. Designed for language enthusiasts, learners, and educators, it provides detailed explanations, origins, and usage examples for a wide range of idioms, aiding in better understanding and appreciation of diverse linguistic.",
    commandCategory: "learn",
    usages: `idioms random`,
    prefix: "on",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const idioms = require('idioms');
	idioms.getIdioms(function(idiomsList) {
		const randomIndex = Math.floor(Math.random() * idiomsList.length);
		const randomIdiom = idiomsList[randomIndex];
		api.sendMessage(`${randomIdiom}`, event.threadID, event.messageID);
	});
};
