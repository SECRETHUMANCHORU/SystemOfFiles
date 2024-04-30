module.exports.config = {
	name: "infv2",
	version: "30.0.0", 
	hasPermssion: 0,
	credits: "VEGITO OFFICIAL",
  //secondcredit: "Choru tiktokers"
	description: "Admin and Bot info.",
	commandCategory: "...",
	cooldowns: 1,
	dependencies: 
	{
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};
module.exports.run = async function({ api,event,args,client,Users,Threads,__GLOBAL,Currencies }) {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
const time = process.uptime(),
		hours = Math.floor(time / (60 * 60)),
		minutes = Math.floor((time % (60 * 60)) / 60),
		seconds = Math.floor(time % 60);
const moment = require("moment-timezone");
var Vegito = moment.tz("Asia/Manila").format("『D/MM/YYYY』 【HH:mm:ss】");
var link = [`${global.config.infv2forlinkpic}`,`${global.config.infv2forlinkpicv2}`,`${global.config.infv2forlinkpicv3}`,`${global.config.infv2forlinkpicv4}`,`${global.config.infv2forlinkpicv5}`];
/*FIXING API MESSANGE*/
var callback = () => api.sendMessage({body:`➢Admin and Bot information
⁂Bot Name: ${global.config.BOTNAME}
✧Bot Admin: ${global.config.OWNER}, ${global.config.BOTNAME}
${global.config.OWNER}: ${global.config.FACEBOOK}
✡Bot Prefix: ${global.config.PREFIX}
✫Bot Owner: ${global.config.OWNER}
➟UPTIME
✬Today is: ${Vegito} 
➳Bot is running ${hours}:${minutes}:${seconds}.
LIST OFF OR ON CRON SCHEDULE
[
AutoOffBot: ${global.config.AutoOffBot}
AutoGreet: ${global.config.AutoGreet}
AutoGreetWithSticker: ${global.config.AutoGreetWithSticker}
AutoPost: ${global.config.AutoPost}
AutoPostGreet: ${global.config.AutoPostGreet}
AutoPostChristmasCountdown: ${global.config.AutoPostChristmasCountdown}
HolidayAutoGreet: ${global.config.HolidayAutoGreet}
ChristmasCountdown: ${global.config.ChristmasCountdown}
AcceptFriendRequest: ${global.config.AcceptFriendRequest}
AutoPendingGroupChat: ${global.config.AutoPendingGroupChat}
AutoBioStatus: ${global.config.AutoBioStatus}
AutoLeave ${global.config.AutoLeave}
Anifactrandom: ${global.config.Anifactrandom}
trivirandom: ${global.config.trivirandom}
]
LIST CONFIG.JSON
Permission: ${global.config.Permission}
Permission: ${global.config.Permissionv2}
Read: [ ${global.config.Read} ]
Uptimelogs: ${global.config.Uptimelogs}
✫Thanks for using ${global.config.BOTNAME} Bot!`,attachment: fs.createReadStream(__dirname + "/cache/Vegito.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/Vegito.jpg")); 
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/Vegito.jpg")).on("close",() => callback());
   };