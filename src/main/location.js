/*** Allows you to easily add a custom location in bio settings. ***/
function locationElm() {
    var locationDiv = document.getElementById("s2id_autogen1");
    if(!locationDiv || !userInfo.userLocation) { return; }
    document.getElementById("bio-picker").style.setProperty("resize", "none");
    document.getElementById("bio-picker").style.setProperty("height", "90px");
    var locDisp = userInfo.userLocation.displayText;
    locationDiv.innerHTML = "<input id=\"kae-location-textarea\" type=\"text\" value=\""+ locDisp + "\">"

    var saveBtn = document.getElementsByClassName("kui-button")[2];
    saveBtn.addEventListener("click", function() {
        var locationText = document.getElementById("kae-location-textarea").value;
        document.getElementsByClassName("location-text")[0].innerHTML = locationText;
        setTimeout(function() {
            var locationText = document.getElementById("kae-location-textarea").value;
            var tempData = {
                  userKey: KA._userProfileData.userKey,
                  userLocation: {
                        displayText: locationText
                  }
            };
            var req = new XMLHttpRequest();
            req.open("POST", "https://www.khanacademy.org/api/internal/user/profile");
            req.setRequestHeader("X-KA-FKey", getSession());
            req.setRequestHeader("Content-type", "application/json");
            req.addEventListener("load", function() {
                console.log("Location changed")
            });
            req.send(JSON.stringify(tempData));
        }, 1000);
    });
    clearInterval(locElm);
}