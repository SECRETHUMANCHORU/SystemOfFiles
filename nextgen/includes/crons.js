const fs = require('fs');
const path = require('path');

function loadCronHandlers(directory, { api, botmodels }) {
  fs.readdirSync(directory).forEach(file => {
    if (file.endsWith('.js') && file !== 'example.js') {
      const handler = require(path.join(directory, file));
      if (typeof handler === 'function') {
        handler({ api, botmodels });
      }
    }
  });
}

module.exports = function ({ api, botmodels }) {
  loadCronHandlers(path.join(__dirname, '../script/crons/'), { api, botmodels });
};
