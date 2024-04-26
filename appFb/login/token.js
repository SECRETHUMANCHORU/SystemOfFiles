const axios = require('axios');
const crypto = require('crypto');
const uuid = require('uuid');

const encodeSig = (data) => {
    const sortedData = Object.fromEntries(Object.entries(data).sort());
    const dataStr = Object.entries(sortedData).map(([key, value]) => `${key}=${value}`).join('');
    return crypto.createHash('md5').update(dataStr + '62f8ce9f74b12f84c123cc23437a4a32').digest('hex');
};

const convertCookie = (session) => {
    return session.map(item => `${item.name}=${item.value}`).join('; ');
};

const convertToken = async (token) => {
    try {
        const response = await axios.get(`https://api.facebook.com/method/auth.getSessionforApp?format=json&access_token=${token}&new_app_id=275254692598279`);
        return response.data.access_token;
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const makeRequest = async (email, password, twofactorCode) => {
    const deviceID = uuid.v4();
    const adid = uuid.v4();
    const randomStr = [...Array(24)].map(() => Math.random().toString(36)[2]).join('');

    const form = {
        adid,
        email,
        password,
        format: 'json',
        device_id: deviceID,
        cpl: 'true',
        family_device_id: deviceID,
        locale: 'en_US',
        client_country_code: 'US',
        credentials_type: 'device_based_login_password',
        generate_session_cookies: '1',
        generate_analytics_claim: '1',
        generate_machine_id: '1',
        currently_logged_in_userid: '0',
        irisSeqID: 1,
        try_num: '1',
        enroll_misauth: 'false',
        meta_inf_fbmeta: 'NO_FILE',
        source: 'login',
        machine_id: randomStr,
        fb_api_req_friendly_name: 'authenticate',
        fb_api_caller_class: 'com.facebook.account.login.protocol.Fb4aAuthHandler',
        api_key: '882a8490361da98702bf97a021ddc14d',
        access_token: '350685531728|62f8ce9f74b12f84c123cc23437a4a32',
    };

    form.sig = encodeSig(form);

    const headers = {
        'content-type': 'application/x-www-form-urlencoded',
        'x-fb-friendly-name': form.fb_api_req_friendly_name,
        'x-fb-http-engine': 'Liger',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    };

    const url = 'https://b-graph.facebook.com/auth/login';

    try {
        const response = await axios.post(url, new URLSearchParams(form), { headers });

        if (response.status === 200) {
            const data = response.data;
            if ('session_cookies' in data) {
                data.cookies = convertCookie(data.session_cookies);
            }
            if ('access_token' in data) {
                data.access_token = await convertToken(data.access_token);
            }
            return {
                status: true,
                message: 'Retrieve information successfully!',
                data,
            };
        } else if (response.status === 401) {
            return {
                status: false,
                message: response.data.error.message,
            };
        } else {
            return {
                status: false,
                message: 'Invalid 2-factor authentication code!',
            };
        }
    } catch (error) {
        return {
            status: false,
            message: 'Please check your account and password again!',
        };
    }
};

module.exports = makeRequest;
