/*** When notifications are more than 9, it will show the real value and not 9+ anymore. ***/
function updateNotifs() {
    querySelectorPromise(".notificationsBadge_16g2pyz", 50)
        .then(greenCircle => {
            greenCircle.textContent = 
                (KA._userProfileData && KA._userProfileData.countBrandNewNotifications !== 0) ? 
                KA._userProfileData.countBrandNewNotifications : 1;
        }).catch(console.error);
}

function stopNotifOverflow(){
    querySelectorPromise(".scrollDropdown_1jabbia")
        .then(notifList => notifList.style.setProperty("overflow-x", "hidden")).catch(console.error);
}

/*** Adds the ability to delete notifications ***/
var deleted = [];
function deleteNotif() {
    var dropdown = document.getElementsByClassName("scrollDropdown_1jabbia")[0];
    if (!dropdown) return;
    var buttons = document.getElementsByClassName("kae-notif-delete");
    var notifList = document.getElementsByClassName("scrollDropdown_1jabbia")[0].childNodes[0].childNodes;
    if (buttons.length >= notifList.length) return;

    for (var i = 0; i < notifList.length; i++) {
        if(notifList[i].className.length > 0) { continue; }
        var notifElm = notifList[i].childNodes[0];
        if(notifElm === undefined || notifElm.childNodes.length >= 2) continue;
        var notifURL = notifElm.childNodes[0].href;
        if(notifURL === undefined) continue;
	if (notifURL.indexOf("/notifications") === -1) continue;
        if(deleted.indexOf(notifURL.match(/[?&]keys(=([^&#]*)|&|#|$)/)[2]) > -1){
            notifElm.parentNode.removeChild(notifElm);
            continue;
        }
        var linkElm = notifElm.childNodes[0];
        if(linkElm.className === "loadingSpinner_18tyv6y") { continue; }

        var deleteButton = document.createElement("span");
        deleteButton.className = "kae-notif-delete";

        let svgNamespace = "http://www.w3.org/2000/svg";

        let deleteSVG = document.createElementNS(svgNamespace, "svg");
        deleteSVG.setAttribute("width", "10");
        deleteSVG.setAttribute("height", "10");
        deleteSVG.setAttribute("viewBox", "0 0 21.9 21.9");
        deleteSVG.setAttribute("enable-background", "new 0 0 21.9 21.9");

        let delteSVGPath = document.createElementNS(svgNamespace, "path");
        delteSVGPath.setAttribute("fill", "#000000");
        delteSVGPath.setAttribute("d", "M14.1,11.3c-0.2-0.2-0.2-0.5,0-0.7l7.5-7.5c0.2-0.2,0.3-0.5,0.3-0.7s-0.1-0.5-0.3-0.7l-1.4-1.4C20,0.1,19.7,0,19.5,0  c-0.3,0-0.5,0.1-0.7,0.3l-7.5,7.5c-0.2,0.2-0.5,0.2-0.7,0L3.1,0.3C2.9,0.1,2.6,0,2.4,0S1.9,0.1,1.7,0.3L0.3,1.7C0.1,1.9,0,2.2,0,2.4  s0.1,0.5,0.3,0.7l7.5,7.5c0.2,0.2,0.2,0.5,0,0.7l-7.5,7.5C0.1,19,0,19.3,0,19.5s0.1,0.5,0.3,0.7l1.4,1.4c0.2,0.2,0.5,0.3,0.7,0.3  s0.5-0.1,0.7-0.3l7.5-7.5c0.2-0.2,0.5-0.2,0.7,0l7.5,7.5c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l1.4-1.4c0.2-0.2,0.3-0.5,0.3-0.7  s-0.1-0.5-0.3-0.7L14.1,11.3z");

        deleteSVG.appendChild(delteSVGPath);
        deleteButton.appendChild(deleteSVG);

        deleteSVG.addEventListener("click", function(){
            var href = this.parentNode.parentNode.childNodes[1].href;
            var notifKey = href.match(/[?&]keys(=([^&#]*)|&|#|$)/)[2].split(",");
            deleted.push(notifKey.join(","));
            for(var i = 0; i < notifKey.length; i++){
                var req = new XMLHttpRequest();
                req.open("DELETE", "/api/internal/user/notifications/" + notifKey[i]);
                req.setRequestHeader("x-ka-fkey", getSession());
                req.addEventListener("load", function() {
                    console.log("Request returned " + req.status);
                });
                req.send();
            }
            this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
            console.log("Notif key is: " + notifKey);
        });
        notifElm.insertBefore(deleteButton, linkElm);
    }
}

// Notification stuff.
setInterval(() => {
    if(KA._userProfileData && typeof chrome !== "undefined") {
        chrome.runtime.sendMessage(chromeid, {
            type: "notif",
            fkey: getSession(),
            kaid: kaid
        });
    }
}, 1000);