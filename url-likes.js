var http = require('http'),
    jsdom = require('jsdom'),
    _ = require('underscore');

var getIrDone = function (url, callback) {
  var nk_fajne = "http://nk.pl/fajne/widget?url=" + url + "&type=2&color=0&title=Oblep!&image=&description=Oblep%20dowoln%C4%85%20stron%C4%99%20i%20prze%C5%9Blij%20urla%20znajomym.&index=0";
  var fb_like = "http://www.facebook.com/plugins/like.php?href=" + url +  "&send=false&layout=button_count&width=128&show_faces=false&font=verdana&colorscheme=light&action=like&height=21";

  var todo = 2;
  var onComplete = function() {
    todo--;
    if(!todo) {
      callback(count);
    }
  }

  var count = 0;

  jsdom.env({
    html: nk_fajne,
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_7) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.71 Safari/534.24'},
    done: function (errors, window) {
      count+= parseInt(window.document.innerHTML.match(/"count":([0-9]*)/)[1]); //dont ask
      onComplete();
    }
  });

  jsdom.env({
    html: fb_like,
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_7) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.71 Safari/534.24'},
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function (errors, window) {
      var $ = window.$;
      var elem =$('span.pluginCountTextDisconnected')[0];
      count+= parseInt(elem.innerHTML);
      onComplete();
    }
  });
};


exports.getIrDone = getIrDone;