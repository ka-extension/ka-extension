var id = chrome.runtime.id;
var fkey;
var username;
console.log("Extension ID is " + id);
chrome.browserAction.setBadgeBackgroundColor({
  color: [204, 46, 46, 10]
});
chrome.runtime.onMessageExternal.addListener(function(msg){
  fkey = msg.fkey;
  username = msg.username;
});
setInterval(() => {
  if(fkey.length <= 0 || username.length <= 0) return;
  var req = new XMLHttpRequest();
  req.open("GET", "https://www.khanacademy.org/api/internal/user/profile?username=" + username, !0);
  req.setRequestHeader('x-ka-fkey', fkey);
  req.addEventListener("load", function() {
      if(req.readyState === req.DONE) {
        var notifs = JSON.parse(req.response)["countBrandNewNotifications"];
        chrome.browserAction.setBadgeText({
          "text": notifs > 0 ? notifs.toString() : ""
        });
      }
  });
  req.send();
}, 1000);
