var https = require('https');

var options = {
    hostname: 'www.googleapis.com',
    port: 443,
    path: '/urlshortener/v1/url',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
};

var doWork = function (url, callback) {
  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (resp) {
      callback(JSON.parse(resp));
    });
  });
  req.write('{"longUrl": "' + url + '"}');
  req.end();
}

exports.doWork = doWork;
