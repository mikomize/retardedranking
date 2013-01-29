var exec = require('child_process').exec;
var urlShortener = require('./url-shortener.js');
var urlScrapper = require('./url-scrapper-from-shout.js');
var _ = require('underscore');



var urlsToShorten  = [];

var urlsToCheck = {};

var g;

var todos;
var onComplete = function (resp) {
  todos--;
  urlsToCheck[resp.longUrl] = resp.id.replace(/^http:\/\/goo.gl/, 'http://s.oblep.pl');
  if (0 === todos) {
    _.each(urlsToCheck, function (shortUrl, originalUrl) {
      var child = exec('phantomjs url-likes-count.js "' + encodeURIComponent(shortUrl) + '"' , function (error, stdout, stderr) {
        console.log(parseInt(stdout), shortUrl, g[originalUrl]);
      });   
    });
  }
};

var onScrapDone = function (scrapped) {
  g = scrapped;
  _.each(scrapped, function (uid, url) {
    if (url.match(/^http:\/\/s.oblep.pl/g)) {
      urlsToCheck[url] = url;
    } else {
      urlsToShorten.push(url);
    }
  });
  todos = urlsToShorten.length;
  _.each(urlsToShorten, function (url) {
    urlShortener.doWork(url, onComplete);
  });
}

urlScrapper.getIrDone(onScrapDone);




