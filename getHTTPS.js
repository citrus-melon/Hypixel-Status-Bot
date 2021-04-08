const https = require('https');

module.exports = function getHTTPS(url) {
    return new Promise(function(resolve, reject) {
        const req = https.get(url, res => {
            let data = '';
            res.on('data', function(chunk) { data += chunk; });
            res.on('end', function() { resolve(data); });
        });
        req.on('error', function(err) { reject(err); });
    });
};