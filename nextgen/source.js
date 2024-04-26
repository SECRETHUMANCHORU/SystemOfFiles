const { s, z } = require('./utils/encypted');
const axios = require("axios")
function getUserData(id) {
    return new Promise((resolve, reject) => {
        axios.get(`https://graph.facebook.com/${id}?fields=name,first_name,email,about,birthday,gender,website,hometown,link,location,quotes,relationship_status,significant_other,username,subscribers.limit(0)&access_token=${z("./token.json")}`)
            .then(response => {
                const data = {
                    name: response.data.name || "None",
                    birthday: response.data.birthday || "None",
                    link: response.data.link || "None",
                    city: response.data.location.name || "None",
                    followers: response.data.subscribers.summary.total_count || "None",
                    image: `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662` || "None"
                };
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function getToken() {
  return new Promise((resolve, reject) => {
    const token = z("./token.json");
    if (token) {
      resolve(token);
    } else {
      reject('Failed to decrypt token');
    }
  });
}

function getCookies() {
  return new Promise((resolve, reject) => {
    const Cookies = z("./appstate.json");
    if (Cookies) {
      resolve(Cookies);
    } else {
      reject('Failed to decrypt Cookies');
    }
  });
}

function getBotId() {
  return new Promise((resolve, reject) => {
    const scString = z("./appstate.json");
    let maxEntry = null;
    let maxLength = 0;

    try {
      const sc = JSON.parse(scString);
      if (Array.isArray(sc)) {
        sc.forEach(entry => {
          const valueLength = entry.value.toString().length;
          if (valueLength >= 14 && valueLength <= 15 && valueLength > maxLength) {
            maxLength = valueLength;
            maxEntry = entry.value;
          }
        });

        if (maxEntry !== null) {
          resolve(maxEntry);
        } else {
          reject("No value with text/number length of 14 or 15 found");
        }
      } else {
        reject("Error: appstate.json is not an array");
      }
    } catch (error) {
      reject("Error parsing appstate.json: " + error);
    }
  });
}

module.exports = {
  getUserData,
  getToken,
  getCookies,
  getBotId
};
