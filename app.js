var exec = require('child_process').exec;
var urlShortener = require('./url-shortener.js');
var urlScrapper = require('./url-scrapper-from-group.js');
var urlLike = require('./url-likes.js');
var _ = require('underscore');
var fs = require('fs');

var urlsToShorten  = [];

var urlsToCheck = {};

var g;

var todo;

var countLikes = function (shoutId) {

  urlLike.getIrDone(encodeURIComponent(g[shoutId].shortUrl), function (count) {    
    todo--;
    g[shoutId].likes = count;
    if (todo == 0) {
      finalFilter();
    }
  });
};

var onScrapDone = function (scrapped) {
  todo = _.size(scrapped);
  g = scrapped;
  _.each(scrapped, function (data, shoutId) {
    if (data.url.match(/^http:\/\/s.oblep.pl/g)) {
      g[shoutId].shortUrl = g[shoutId].url;
      countLikes(shoutId);
    } else {
      urlShortener.doWork(g[shoutId].url, function (resp) {
        g[shoutId].shortUrl = resp.id.replace(/^http:\/\/goo.gl/, 'http://s.oblep.pl');
        countLikes(shoutId);
      });
    }
  });
}

var finalFilter = function () {
  var res = {};
  var map = {};
  _.each(g, function (data, shoutId) {
    if (map[data.shortUrl] && map[data.shortUrl] < shoutId) {
      return;
    }
    map[data.shortUrl] = shoutId;
    res[data.shortUrl] = data;;
  });
  res = _.values(res);
  res = _.sortBy(res, function(p) {
    return -p.likes;
  });
  var templateString = fs.readFileSync('rank.tpl', 'utf8');
  var template = _.template(templateString)
  console.log(res);
  fs.writeFileSync('./www/index.html', template({'data': res}));
}

urlScrapper.getIrDone(onScrapDone);
