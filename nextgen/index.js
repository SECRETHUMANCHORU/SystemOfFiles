const { spawn } = require("child_process");
const { readFileSync } = require("fs-extra");
const fs = require('fs');
const path = require('path');
const http = require("http");
const axios = require("axios");
const semver = require("semver");
const logger = require("./utils/log");
global.config = require("./config.json");
let config = { ConsoleWeb: 'off' };
const configPath = path.join(__dirname, '../config.json');
if (fs.existsSync(configPath)) {
    const configData = fs.readFileSync(configPath);
    config = JSON.parse(configData);
}

function fileExistsLang(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (err) {
        return false;
    }
}

function createIncludesFolderLang() {
    const includesFolderPath = path.join(__dirname, 'languages');
    if (!fileExistsLang(includesFolderPath)) {
        fs.mkdirSync(includesFolderPath);
    }
}

async function fetchData() {
    const localFilePath = path.join(__dirname, 'languages', `country.lang`);
    try {
        const response = await axios.get(`https://raw.githubusercontent.com/ChoruTiktokers182/Language/main/${global.config.language}`);
        const langData = response.data;
        fs.writeFileSync(localFilePath, langData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

createIncludesFolderLang();
fetchData();
async function getLatestText() {
  try {
const res = await axios.get("https://raw.githubusercontent.com/ChoruTiktokers182/api_choru/main/data.txt");
const announce = res.data
    return announce;
  } catch (err) {
    console.error(err);
    return null;
  }
};

async function display() {
  const announce = await getLatestText();
  setTimeout(() => {
logger("════════════════════════════════════════")
logger("FILE SYSTEM: NEXTGEN")
logger("CREATED BY: CHORU OFFICIAL")
logger("FB: https://www.facebook.com/profile.php?id=100088806220727")
logger("TIKTOK: tiktok.com/@choruofficial91")
logger("TWITTER: https://twitter.com/Choru_user?t=Dh9T37LxAXdWjUy06hQwwg&s=09")
logger("REPLIT: https://replit.com/@EDUCATION-JOHNSTEVE")
logger("════════════════════════════════════════")

logger("WAIT 10 SECOUND TO START BOT")
logger(announce)
  }, 500);
}
display()
setTimeout(() => {
   logger.clear(); 
}, 3000);

function startBot(message) {
    if (message) {
        logger.opinion(message, "[ Starting ]", "#FFA500");
    }
    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "mirai.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit !== 0 || global.countRestart && global.countRestart < 5) {
            startBot("Restarting...");
            global.countRestart += 1;
        }
    });

    child.on("error", function (error) {
        logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
    });
}

if (config.ConsoleWeb === 'on') {
    setTimeout(() => {
        startBot();
    }, 10000);
} else {
  setTimeout(() => {
        startBot();
    }, 3000);
}
