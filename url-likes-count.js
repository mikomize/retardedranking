var page = require('webpage').create();
var page2 = require('webpage').create();
var system = require('system');

var url = system.args[1];

var nk_fajne = "http://nk.pl/fajne/widget?url=" + url + "&type=2&color=0&title=Oblep!&image=&description=Oblep%20dowoln%C4%85%20stron%C4%99%20i%20prze%C5%9Blij%20urla%20znajomym.&index=0";
var fb_like = "http://www.facebook.com/plugins/like.php?href=" + url +  "&send=false&layout=button_count&width=128&show_faces=false&font=verdana&colorscheme=light&action=like&height=21";

var todo = 2;

var onComplete = function() {
  todo--;
  if(!todo) {
    console.log(count);
    phantom.exit(count);
  }
}

var count = 0;

page.open(nk_fajne, function (status) {
      var html = page.frameContent;
      count += parseInt(html.match(/<p class="counter">([0-9]*)<\/p>/)[1]);
      onComplete();
});
page2.open(fb_like, function (status) {
      var html = page2.frameContent;
      count += parseInt(html.match(/<span class="pluginCountTextDisconnected">([0-9]*)<\/span>/)[1]);
      onComplete();
});
