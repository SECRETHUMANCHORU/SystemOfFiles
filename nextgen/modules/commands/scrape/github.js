const request = require('request');
const cheerio = require('cheerio');

async function github(username, includeFollowersAndFollowing) {
    const url = `https://github.com/${username}`;
    const followersUrl = `https://github.com/${username}?tab=followers`;
    const followingUrl = `https://github.com/${username}?tab=following`;

    return new Promise((resolve, reject) => {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
        };

        request({ url, headers }, (error, response, html) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html);

                const name = $('.p-name').text().trim();
                const nickname = $('.p-nickname').text().trim();
                const avatar = $('img.avatar').attr('src');
                const bio = $('.p-note').data('bio-text');
                const programmingLanguages = $('[itemprop="programmingLanguage"]').toArray().map(element => $(element).text().trim());
                const topLanguages = programmingLanguages.length > 0 ? programmingLanguages.join(', ') : 'N/A'; 

                const followersCount = $('.Link--secondary[href$="?tab=followers"]').find('.text-bold').text().trim();
                const followingCount = $('.Link--secondary[href$="?tab=following"]').find('.text-bold').text().trim();

                let followersPromise, followingPromise;
                if (includeFollowersAndFollowing === 'yes') {
                    followersPromise = followersAndFollowing(followersUrl, 'Followers');
                    followingPromise = followersAndFollowing(followingUrl, 'Following');
                } else {
                    followersPromise = Promise.resolve([]);
                    followingPromise = Promise.resolve([]);
                }

                Promise.all([followersPromise, followingPromise])
                    .then(([followers, following]) => {
                        resolve({
                            name,
                            nickname,
                            followersCount,
                            followers,
                            followingCount,
                            following,
                            avatar,
                            bio,
                            topLanguages
                        });
                    })
                    .catch(reject);
            } else {
                reject(error);
            }
        });
    });
}

function followersAndFollowing(url, type) {
    return new Promise((resolve, reject) => {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
        };

        request({ url, headers }, (error, response, html) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html);
                const data = [];

                if (type === 'Followers') {
                    $('.d-table.table-fixed').find('.Link--secondary').each((index, element) => {
                        data.push($(element).text().trim());
                    });
                } else if (type === 'Following') {
                    $('.d-table.table-fixed').find('.Link--secondary.pl-1').each((index, element) => {
                        data.push($(element).text().trim());
                    });
                }

                resolve(data);
            } else {
                reject(error);
            }
        });
    });
}

module.exports = github;
