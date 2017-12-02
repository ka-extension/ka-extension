var id = chrome.runtime.id;
console.log("Extension ID is " + id);
chrome.browserAction.setBadgeBackgroundColor({
  color: [204, 46, 46, 10]
});
chrome.runtime.onMessageExternal.addListener(function(msg){
  var notifs = msg.notifs > 0 ? msg.notifs.toString() : "";
  chrome.browserAction.setBadgeText({
    "text": notifs
  });
});
