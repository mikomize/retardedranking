var http = require('http'),
    jsdom = require('jsdom'),
    _ = require('underscore');
    

var scrapped = {};
var pages = 1;
var done = 0;

var scrapPage = function (window, callback) {
  var $ = window.$;
  $('div.nk_shout').each(function (i,elem) {
    var attachment = $(elem).find('blockquote.nk_attachment');
    if(!attachment.length) {
      return;
    }
    var match = $(attachment).attr('data-url').match(/http:\/\/(s|www)?.oblep.pl\/\S*/, '');
    if(match) {
      var name = $(elem).find('a.author').attr('title');
      scrapped[$(elem).attr('data-shout-id')] = {'url': match[0], 'name': name, 'uid': $(elem).attr('data-user-id')};
    }
  });
  done++;
  if (done == pages) {
    callback(scrapped);
  }
}


var getIrDone = function (callback) {
  jsdom.env({
    html: 'http://nk.pl/grupy/521570',
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_7) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.71 Safari/534.24'},
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function (errors, window) {
      var $ = window.$;
      var tmp = $('a.page_nr');
      if(tmp.length) {
        pages = parseInt($(tmp).last().children().first().html());
      }
      scrapPage(window);
      for(var i = 2;i<=pages;i++) {
        jsdom.env({
          html: 'http://nk.pl/grupy/521570?page=' + i,
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_7) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.71 Safari/534.24'},
          scripts: ["http://code.jquery.com/jquery.js"],
          done: function(errors, window) {
            scrapPage(window, callback);
          }
        });
      }
    }
  });
}

exports.getIrDone = getIrDone;
