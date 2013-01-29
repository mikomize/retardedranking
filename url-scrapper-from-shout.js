var http = require('http'),
    jsdom = require('jsdom'),
    _ = require('underscore');
    

var data = 't=50fad135a8acc2ac613aee21';
var cookie = 'basic_auth=50fad135a8acc2ac613aee21; nk_session=Sm9%2C1KZeXPt5r9Ns%2CMIQTBBZmt8';
var options = {
    hostname: 'nk.pl',
    port: 80,
    path: '/grupy/521570/sledzik/shout/41254729/1/comment/js/100000',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Content-Length': Buffer.byteLength(data,'utf8'),
      'isAjaxy' : 'very',
      'Cookie': cookie,
      'Host': 'nk.pl',
      'Referer': 'http://nk.pl/grupy/521570/sledzik/shout/41254729/1',
      'User-Agent' : 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/535.19 (KHTML, like Gecko) Ubuntu/12.04 Chromium/18.0.1025.168 Chrome/18.0.1025.168 Safari/535.19',
      'X-Request': 'JSON',
      'X-Requested-With': 'XMLHttpRequest'
    }
};

var resp = '';

var getIrDone = function (callback) {
  var html = '';
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (response) {
      resp = resp + response;
    });
    res.on('end', function () {
      resp = JSON.parse(resp);
      _.each(resp.content.reverse(), function (content) {
        html = html + content;
      });
      if (resp.next_url === null) {
        html = '<html><head></head><body><ul>' + html + '</ul></body></html>';
        parse(html, callback);
      } else {
        getIrDone();
      }
    });
  });
  req.write(data);
  req.end();
}

var parse = function (html, callback) {
  var scrapped = {};
  jsdom.env({
    html: html,
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function (errors, window) {
      var $ = window.$;
      $("a.author").each(function(elem, i) {
        var txt = $(i).next().html();
        var match = txt.match(/http:\/\/(s|www)?.oblep.pl\/\S*/, '');
        if (match) {
          scrapped[match[0]] = i.href.match(/\/profile\/([0-9]*)/)[1];
        }
      });

     callback(scrapped);
    }
  });
}

exports.getIrDone = getIrDone;
