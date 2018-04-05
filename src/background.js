var id = chrome.runtime.id;
var fkey = "", kaid = "";
console.log("Extension ID is " + id);

chrome.browserAction.setBadgeBackgroundColor({
    color: [204, 46, 46, 10]
});

chrome.runtime.onMessageExternal.addListener(function(msg, sender) {
    switch(msg.type) {
        case "notif":
            fkey = msg.fkey;
            kaid = msg.kaid;
            break;
    }
});

setInterval(function() {
    if(fkey.length <= 0 || kaid.length <= 0) { return; }
    var req = new XMLHttpRequest();
    req.responseType = "json";
    req.open("GET", "https://www.khanacademy.org/api/internal/user/profile?kaid=" + kaid, !0);
    req.setRequestHeader("X-KA-FKey", fkey);
    req.addEventListener("load", function() {
        if(req.readyState === req.DONE && req.response) {
            var notifs = req.response.countBrandNewNotifications;
            chrome.browserAction.setBadgeText({
              text: notifs > 0 ? notifs.toString() : ""
            });
        }
    });
    req.send();
}, 1000);