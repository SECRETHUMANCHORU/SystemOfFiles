const timerestart = 120   //in minutes

const chalk = require('chalk');


//////////////////////////////////////////////////////
//========= Require all variable need use =========//
/////////////////////////////////////////////////////
const { s, z } = require('./utils/encypted');
const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
const logger = require("./utils/log.js");
const login = require("../appFb/login/index");
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const listPackage = JSON.parse(readFileSync('../package.json')).dependencies;
const listbuiltinModules = require("module").builtinModules; 


global.client = new Object({
    commands: new Map(),
    events: new Map(),
    cooldowns: new Map(),
    eventRegistered: new Array(),
    handleSchedule: new Array(),
    handleReaction: new Array(),
    handleReply: new Array(),
    mainPath: process.cwd(),
    configPath: new String()
});

global.data = new Object({
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),
    threadAllowNSFW: new Array(),
    allUserID: new Array(),
    allCurrenciesID: new Array(),
    allThreadID: new Array()
});

global.utils = require("./utils");

global.nodemodule = new Object();

global.config = new Object();

global.configModule = new Object();

global.moduleData = new Array();

global.language = new Object();

//////////////////////////////////////////////////////////
//========= Find and get variable from Config =========//
/////////////////////////////////////////////////////////

var configValue;
try {
    global.client.configPath = join(global.client.mainPath, "./config.json");
    configValue = require(global.client.configPath);
    logger.loader("Found file config: config.json");
}
catch {
    if (existsSync(global.client.configPath.replace(/\.json/g,"") + ".temp")) {
        configValue = readFileSync(global.client.configPath.replace(/\.json/g,"") + ".temp");
        configValue = JSON.parse(configValue);
        logger.loader(`Found: ${global.client.configPath.replace(/\.json/g,"") + ".temp"}`);
    }
    else return logger.loader("config.json not found!", "error");
}

try {
    for (const key in configValue) global.config[key] = configValue[key];
    logger.loader("Config Loaded!");
}
catch { return logger.loader("Can't load file config!", "error") }

const { Sequelize, sequelize } = require("./includes/database");

writeFileSync(global.client.configPath + ".temp", JSON.stringify(global.config, null, 4), 'utf8');

/////////////////////////////////////////
//========= Load language use =========//
/////////////////////////////////////////
        const langFile = (readFileSync(`${__dirname}/languages/country.lang`, { encoding: 'utf-8' })).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
    const getSeparator = item.indexOf('=');
    const itemKey = item.slice(0, getSeparator);
    const itemValue = item.slice(getSeparator + 1, item.length);
    const head = itemKey.slice(0, itemKey.indexOf('.'));
    const key = itemKey.replace(head + '.', '');
    const value = itemValue.replace(/\\n/gi, '\n');
    if (typeof global.language[head] == "undefined") global.language[head] = new Object();
    global.language[head][key] = value;
}

global.getText = function (...args) {
    const langText = global.language;    
    if (!langText.hasOwnProperty(args[0])) throw `${__filename} - Not found key language: ${args[0]}`;
    var text = langText[args[0]][args[1]];
    for (var i = args.length - 1; i > 0; i--) {
        const regEx = RegExp(`%${i}`, 'g');
        text = text.replace(regEx, args[i + 1]);
    }
    return text;
}

  try {

    const fs = require("fs-extra");
    const decryptedPath = z("./appstate.json");
    const decryptedJson = JSON.parse(decryptedPath);
    fs.outputJsonSync("./includes/database/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/Opening/Account/Done/fb.json", decryptedJson, { spaces: 2 });
    
    var appStateFile = resolve(join("./includes/database/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/login-session/Opening/Account/Done/fb.json"));
    
    
    // Read the appState
    var appState = require(appStateFile)
    // console.log(appState)
    logger.loader(global.getText("mirai", "foundPathAppstate"))
}
catch { return logger.loader(global.getText("mirai", "notFoundPathAppstate"), "error") }

////////////////////////////////////////////////////////////
//========= Login account and start Listen Event =========//
////////////////////////////////////////////////////////////


function onBot({ models: botModel }) {
    const loginData = {};
    loginData['appState'] = appState;
    login(loginData, async(loginError, loginApiData) => {
        if (loginError) {
    logger(JSON.stringify(loginError), 'ERROR');
    process.exit(1);
        }
        
loginApiData.setOptions(global.config.FCAOption)
        writeFileSync(appStateFile, JSON.stringify(loginApiData.getAppState(), null, '\x09'))
        global.config.version = 'none'
        global.client.timeStart = new Date().getTime(),
        (function () {
    const listCommand = readdirSync(global.client.mainPath + '/modules/commands').filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.commandDisabled.includes(command));

    const totalModules = listCommand.length;
    let completedModules = 0;

    for (const command of listCommand) {
        try {
            let module;
            if (command.endsWith('.js')) {
                module = require(global.client.mainPath + '/modules/commands/' + command);
            } else {
                continue; 
            }

            if (!module.config || !module.run || !module.config.commandCategory) throw new Error(global.getText('mirai', 'errorFormat'));
            if (global.client.commands.has(module.config.name || '')) throw new Error(global.getText('mirai', 'nameExist'));
            if (!module.languages || typeof module.languages != 'object' || Object.keys(module.languages).length == 0)

            if (module.config.prefix && typeof module.config.prefix  == 'object') {
                logger(`Command ${command} does not have the "prefix" property.`);
            }

            if (module.config.dependencies && typeof module.config.dependencies == 'object') {
                for (const reqDependencies in module.config.dependencies) {
                    const reqDependenciesPath = join(__dirname, 'nodemodules', 'node_modules', reqDependencies);
                    try {
                        if (!global.nodemodule.hasOwnProperty(reqDependencies)) {
                            if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global.nodemodule[reqDependencies] = require(reqDependencies);
                            else global.nodemodule[reqDependencies] = require(reqDependenciesPath);
                        } else '';
                    } catch {
                        var check = false;
                        var isError;
                        logger.loader(global.getText('mirai', 'notFoundPackage', reqDependencies, module.config.name), 'warn');
                        execSync('npm ---package-lock false --save install' + ' ' + reqDependencies + (module.config.dependencies[reqDependencies] == '*' || module.config.dependencies[reqDependencies] == '' ? '' : '@' + module.config.dependencies[reqDependencies]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                        for (let i = 1; i <= 3; i++) {
                            try {
                                require['cache'] = {};
                                if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global['nodemodule'][reqDependencies] = require(reqDependencies);
                                else global['nodemodule'][reqDependencies] = require(reqDependenciesPath);
                                check = true;
                                break;
                            } catch (error) { isError = error; }
                            if (check || !isError) break;
                        }
                        if (!check || isError) throw global.getText('mirai', 'cantInstallPackage', reqDependencies, module.config.name, isError);
                    }
                }

            }

            if (module.config.envConfig) try {
                for (const envConfig in module.config.envConfig) {
                    if (typeof global.configModule[module.config.name] == 'undefined') global.configModule[module.config.name] = {};
                    if (typeof global.config[module.config.name] == 'undefined') global.config[module.config.name] = {};
                    if (typeof global.config[module.config.name][envConfig] !== 'undefined') global['configModule'][module.config.name][envConfig] = global.config[module.config.name][envConfig];
                    else global.configModule[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                    if (typeof global.config[module.config.name][envConfig] == 'undefined') global.config[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                }

            } catch (error) {
                throw new Error(global.getText('mirai', 'loadedConfig', module.config.name, JSON.stringify(error)));
            }

            if (module.onLoad) {
                try {
                    const moduleData = {};
                    moduleData.api = loginApiData;
                    moduleData.models = botModel;
                    module.onLoad(moduleData);
                } catch (_0x20fd5f) {
                    throw new Error(global.getText('mirai', 'cantOnload', module.config.name, JSON.stringify(_0x20fd5f)), 'error');
                };
            }

            if (module.handleEvent) global.client.eventRegistered.push(module.config.name);
            global.client.commands.set(module.config.name, module);
            completedModules++;
            const progressPercentage = Math.floor((completedModules / totalModules) * 100);
          const nws = /\n/;
          const cmdName = nws.test(module.config.name) ? "none" : module.config.name;

          logger(`[ ${'='.repeat(progressPercentage / 5)}${' '.repeat(20 - progressPercentage / 5)} ] \\ Cmd: ${cmdName}`);


        } catch (error) {
            logger.loader(global.getText('mirai', 'failLoadModule', module.config.name, error), 'error');
        }
    }
})(),
            (function() {
    const events = readdirSync(global.client.mainPath + '/modules/events').filter(event => event.endsWith('.js') && !global.config.eventDisabled.includes(event));
    const totalEvents = events.length;
    let completedEvents = 0;

    for (const ev of events) {
        try {
            var event = require(global.client.mainPath + '/modules/events/' + ev);
            if (!event.config || !event.run) throw new Error(global.getText('mirai', 'errorFormat'));
            if (global.client.events.has(event.config.name) || '') throw new Error(global.getText('mirai', 'nameExist'));

            if (event.config.dependencies && typeof event.config.dependencies == 'object') {
                for (const dependency in event.config.dependencies) {
                    const _0x21abed = join(__dirname, 'nodemodules', 'node_modules', dependency);
                    try {
                        if (!global.nodemodule.hasOwnProperty(dependency)) {
                            if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                            else global.nodemodule[dependency] = require(_0x21abed);
                        } else '';
                    } catch {
                        let check = false;
                        let isError;
                        logger.loader(global.getText('mirai', 'notFoundPackage', dependency, event.config.name), 'warn');
                        execSync('npm --package-lock false --save install' + dependency + (event.config.dependencies[dependency] == '*' || event.config.dependencies[dependency] == '' ? '' : '@' + event.config.dependencies[dependency]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                        for (let i = 1; i <= 3; i++) {
                            try {
                                require['cache'] = {};
                                if (global.nodemodule.includes(dependency)) break;
                                if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                else global.nodemodule[dependency] = require(_0x21abed);
                                check = true;
                                break;
                            } catch (error) { isError = error; }
                            if (check || !isError) break;
                        }
                        if (!check || isError) throw global.getText('mirai', 'cantInstallPackage', dependency, event.config.name);
                    }
                }
            }

            if (event.config.envConfig) {
                try {
                    for (const _0x5beea0 in event.config.envConfig) {
                        if (typeof global.configModule[event.config.name] == 'undefined') global.configModule[event.config.name] = {};
                        if (typeof global.config[event.config.name] == 'undefined') global.config[event.config.name] = {};
                        if (typeof global.config[event.config.name][_0x5beea0] !== 'undefined') global.configModule[event.config.name][_0x5beea0] = global.config[event.config.name][_0x5beea0];
                        else global.configModule[event.config.name][_0x5beea0] = event.config.envConfig[_0x5beea0] || '';
                        if (typeof global.config[event.config.name][_0x5beea0] == 'undefined') global.config[event.config.name][_0x5beea0] = event.config.envConfig[_0x5beea0] || '';
                    }
                } catch (error) {
                    throw new Error(global.getText('mirai', 'loadedConfig', event.config.name, JSON.stringify(error)));
                }
            }

            if (event.onLoad) {
                try {
                    const eventData = {};
                    eventData.api = loginApiData, eventData.models = botModel;
                    event.onLoad(eventData);
                } catch (error) {
                    throw new Error(global.getText('mirai', 'cantOnload', event.config.name, JSON.stringify(error)), 'error');
                }
            }

            global.client.events.set(event.config.name, event);
            completedEvents++;
            const progressPercentage = Math.floor((completedEvents / totalEvents) * 100);
            logger(`[ ${'='.repeat(progressPercentage / 5)}${' '.repeat(20 - progressPercentage / 5)} ] \\ Event: ${event.config.name}`);

        } catch (error) {
            logger.loader(global.getText('mirai', 'failLoadModule', event.config.name, error), 'error');
        }
    }
})();
        logger.loader(global.getText('mirai', 'finishLoadModule', global.client.commands.size, global.client.events.size)) 

        writeFileSync(global.client['configPath'], JSON['stringify'](global.config, null, 4), 'utf8') 
        unlinkSync(global['client']['configPath'] + '.temp');        
        const listenerData = {};
        listenerData.api = loginApiData; 
        listenerData.models = botModel;
        const listener = require('./includes/listen')(listenerData);

        function listenerCallback(error, message) {
            if (error) return logger(global.getText('mirai', 'handleListenError', JSON.stringify(error)), 'error');
            if (['presence', 'typ', 'read_receipt'].some(data => data == message.type)) return;
            if (global.config.DeveloperMode == !![]) console.log(message);
            return listener(message);
        };
        global.handleListen = loginApiData.listenMqtt(listenerCallback);
   
        global.client.api = loginApiData
      const cronHandlers = require("./includes/crons");
      cronHandlers({
        api: loginApiData,
        botmodels: botModel
      });
setInterval(() => {
    console.log('Exiting process...');
    process.exit(1);
}, 2 * 60 * 60 * 1000); // 2 hours in milliseconds
            
      
    });
}

(async() => {
    try {
        await sequelize.authenticate();
        const authentication = {};
        authentication.Sequelize = Sequelize;
        authentication.sequelize = sequelize;
        const models = require('./includes/database/model')(authentication);
        logger(global.getText('mirai', 'successConnectDatabase'), 'DATABASE');
        const botData = {};
        botData.models = models
        onBot(botData);
    } catch (error) { logger(global.getText('mirai', 'successConnectDatabase', JSON.stringify(error)), 'DATABASE'); }


})();
process.on('unhandledRejection', (err, p) => {});

