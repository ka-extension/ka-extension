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

chrome.runtime.onConnectExternal.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        switch(port.name) {
            case "reportprogram":
                reportProgram(msg.kaid, msg.programId, msg.reason, port);
                break;
        }
    });
});

setInterval(function() {
    if(fkey.length <= 0 || kaid.length <= 0) { return; }
    chrome.cookies.get({ "url": "https://www.khanacademy.org/", "name": "KAID" }, function(data) {
        if(data && data.name && data.value) { document.cookie = data.name + "=" + data.value; } 
        document.cookie = "fkey=" + fkey;
        var req = new XMLHttpRequest();
        req.responseType = "json";
        req.open("GET", "https://www.khanacademy.org/api/internal/user/profile?kaid=" + kaid, !0);
        req.setRequestHeader("X-KA-FKey", fkey);
        req.addEventListener("load", function() {
            if(req.readyState === req.DONE && req.response) {
                var notifs = req.response.countBrandNewNotifications;
                chrome.browserAction.setBadgeText({
                  "text": notifs > 0 ? notifs.toString() : ""
                });
            }
        });
        req.send();
    });
}, 1000);

function reportProgram(kaid, programId, reason, port) {
    chrome.cookies.getAll({
        "url": "https://www.khanacademy.org/"
    }, function(data) {
        let internalKaid = data.find(function(e) { return e.name == "KAID"; }),
            fkey = data.find(function(e) { return e.name == "fkey"; });
        if(!internalKaid || !fkey) { return; }
        let x = new XMLHttpRequest();
        x.responseType = "json";
        x.open("POST", "https://reportqueue.herokuapp.com/Report/Program");
        x.setRequestHeader("Content-type", "application/json");
        x.setRequestHeader("X-KA-FKey", fkey.value);
        x.setRequestHeader("X-KA-IntKaid", internalKaid.value);
        x.addEventListener("readystatechange", function() {
            if(x.readyState === XMLHttpRequest.DONE) {
                port.postMessage(x.response);
            }
        });
        x.send(JSON.stringify({
            "kaid": kaid,
            "id": programId,
            "reason": reason
        }));
    });
}
