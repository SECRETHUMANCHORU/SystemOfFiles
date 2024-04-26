const gradient = require('gradient-string');
const path = require('path');
const fs = require('fs');

const configPath = path.join(__dirname, '../../config.json');
const logsPath = path.join(__dirname, './logs.txt');
let config = { ConsoleWeb: 'off' };

if (fs.existsSync(configPath)) {
  const configData = fs.readFileSync(configPath);
  config = JSON.parse(configData);
}

const handleConsoleWeb = (message, colors, textStyle) => {
  if (config.ConsoleWeb === 'on') {
    let styledMessage = '';
    const colorStops = colors.map((color, index) => {
      const percentage = (index / (colors.length - 1)) * 100;
      return `${color} ${percentage}%`;
    });
    const gradientStyle = `linear-gradient(to right, ${colorStops.join(', ')})`;

    styledMessage += `<span style="background: ${gradientStyle}; -webkit-background-clip: text; color: transparent; ${textStyle}">${message}</span>`;

    return styledMessage;
  }
  return '';
};

module.exports = (data, option) => {
  let colors, textStyle, logMessage;
  if (option) {
    switch (option.toLowerCase()) {
      case 'warn':
        colors = ['#FF6347', '#FFA07A']; // Gradient color for warning
        textStyle = ''; 
        logMessage = `[ WARN ] » ${data}`;
        break;
      case 'error':
        colors = ['#FF6347', '#FF0000']; // Gradient color for error
        textStyle = ''; 
        logMessage = `[ ERROR ] » ${data}`;
        break;
      default:
        colors = ['#1E90FF', '#00BFFF']; // Gradient color for default
        textStyle = ''; 
        logMessage = `[ ${option.toUpperCase()} ] » ${data}`;
        break;
    }
  } else {
    colors = ['#00FF00', '#00FFFF']; 
    textStyle = '';
    logMessage = `${data}`;
  }

  const styledMessage = handleConsoleWeb(logMessage, colors, textStyle);
  if (styledMessage) {
    console.log(styledMessage);
    saveLogToFile(styledMessage); 
  } else {
    console.log(gradient(colors[0], colors[1])(logMessage)); // Using gradient with start and end colors
    saveLogToFile(logMessage); 
  }
};

module.exports.loader = (data, option) => {
  let colors, logMessage;
  switch (option) {
    case 'warn':
      colors = ['#00FFFF', '#00CED1']; // Gradient color for warning loader
      logMessage = '[ SYSTEM ] »';
      break;
    case 'error':
      colors = ['#00FFFF', '#00CED1']; // Gradient color for error loader
      logMessage = '[ SYSTEM ] »';
      break;
    default:
      colors = ['#00FF00', '#00FFFF']; 
      logMessage = '[ SYSTEM ] »';
      break;
  }

  const styledMessage = handleConsoleWeb(`${logMessage} ${data}`, colors, '');
  if (styledMessage) {
    console.log(styledMessage);
    saveLogToFile(styledMessage);
  } else {
    console.log(gradient(colors[0], colors[1])(`${logMessage} ${data}`)); // Using gradient with start and end colors
    saveLogToFile(`${logMessage} ${data}`); 
  }
};

module.exports.opinion = (data, color) => {
  const prefix = '[ SYSTEM ] »';
  const styledMessage = handleConsoleWeb(`${data}`, [color, color], '');
  if (styledMessage) {
    console.log(styledMessage);
    saveLogToFile(styledMessage);
  } else {
    console.log(gradient(color)(`${data}`));
    saveLogToFile(`${prefix} ${data}`); 
  }
};

module.exports.clear = (() => {
    let logsCleared = false; // Flag to track if logs have been cleared

    return () => {
        if (!logsCleared) {
            if (config.ConsoleWeb === 'off') {
                console.clear();
            } else if (typeof document !== 'undefined') {
                const logContainer = document.getElementById('console');
                if (logContainer) {
                    logContainer.innerHTML = '';
                    
                }
            } else {
                const logsPath = path.join(__dirname, './logs.txt');
                fs.writeFileSync(logsPath, '');
              
            }
            logsCleared = true; // Update the flag
        }
    };
})();


function saveLogToFile(logMessage) {
  fs.appendFileSync(logsPath, `${logMessage}\n`);
}
