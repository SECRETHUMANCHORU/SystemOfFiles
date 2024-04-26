const request = require('request');
const cheerio = require('cheerio');

const url = 'https://lookup-id.com/';

function FindID(fbUrl) {
    return new Promise((resolve, reject) => {
        const options = {
            url: url,
            method: "POST",
            form: {
                "fburl": fbUrl,
                "check": "Lookup"
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
            }
        };

        request(options, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                const result = $('#code').text().trim();
                resolve(result);
            } else {
                reject(error || 'Failed to fetch data');
            }
        });
    });
}

module.exports = FindID;
