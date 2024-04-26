const fs = require('fs');
let data_encrypt = 19

const jsonDatabase = (json) => {
  let result = ""
  let str = json
  for(let i = 0; i < str.length; i += 2){
    let s = str[i] + str[i + 1]
    let data = parseInt(s, data_encrypt)
    let toStr = String.fromCharCode(data)
    result += toStr
  }
  return JSON.parse(result)
}
  const e = (json, isFile) => {
    let result = ""
    let str = JSON.stringify(json)
    if(isFile)
      str = json
    for(let i = 0; i < str.length; i++){
      let data = str.charCodeAt(i)
      result +=  data.toString(data_encrypt)
    }
    return result;
  }

function repeatString(string, times) {
    let repeatedString = '';
    for (let i = 0; i < times; i++) {
        repeatedString += string;
    }
    return repeatedString;
}

// Function to check if the data is encrypted
function isEncrypted(data) {
    const prefix = repeatString('@ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._  @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._       ', 50);
    const suffix = repeatString('@ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._  @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._       ', 30);
    return data.startsWith(prefix) && data.endsWith(suffix);
}

// Function to create encrypted JSON with specified prefix and suffix
function encryptJSON(data) {
    const prefix = repeatString('@ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._  @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._       ', 50);
    const suffix = repeatString('@ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._  @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._   @ °._       ', 30);
    return `${prefix} \`\`\`"${data}"\`\`\` ${suffix}`;
}

// Function to extract data from encrypted JSON
function extractDataFromEncryptedJSON(encryptedJSON) {
    const startIndex = encryptedJSON.indexOf('```') + 3;
    const endIndex = encryptedJSON.lastIndexOf('```');
    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
       // console.error('Invalid encrypted JSON format.');
        return null;
    }
    return encryptedJSON.substring(startIndex, endIndex);
}

// Main function to encrypt a file
function s(file) {
    const data = fs.readFileSync(file, 'utf-8');
    if (isEncrypted(data)) {
        //console.log(`${file} is already encrypted.`);
        return;
    }
    const encryptedData = e(data);
    const result = encryptJSON(encryptedData);
    return fs.writeFileSync(file, result);
}



function z(file) {
        const encryptedData = fs.readFileSync(file, 'utf-8');
    const extractedData = extractDataFromEncryptedJSON(encryptedData);
  const startIndex = extractedData.indexOf('"') + 1;
    const endIndex = extractedData.lastIndexOf('"');
    const encryptedValue = extractedData.substring(startIndex, endIndex);
    const res = jsonDatabase(encryptedValue);

    return res;
}


module.exports = {
    s,
    z
};
