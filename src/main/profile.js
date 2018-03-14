/*** Display more info about a user when viewing their profile. ***/
function getProfileData() {
    var profile = document.getElementsByClassName("user-statistics-table");
    if(profile.length < 1 || !userPrograms.scratchpads) { return; }
    var table = profile[0];
    var tableBody = table.childNodes[0];
    var kaid = userInfo.kaid;
    var dateJoined = userInfo.dateJoined;

    var numVotes = 0;
    var numSpinoffs = 0;
    var numPrograms = userPrograms.scratchpads.length;
    for(var i = 0; i < numPrograms; i++) {
        var scratchpad = userPrograms.scratchpads[i];
        numVotes += scratchpad.sumVotesIncremented;
        numSpinoffs += scratchpad.spinoffCount;
    }
    function addItem(title, value){
      tableBody.innerHTML += `<tr><td class="user-statistics-label">${title}</td><td>${value}</td></tr>`
    }
    addItem("Accont created", (userInfo.dateJoined ? newDate(dateJoined)  : "Unknown"));
    addItem("Programs", numPrograms);
    addItem("Votes received", numVotes);
    addItem("Spinoffs received", numSpinoffs);
    addItem("Average votes received", ((Math.round((numVotes/numPrograms) * 100) / 100) || 0));
    addItem("Average spinoffs received", ((Math.round((numSpinoffs/numPrograms) * 100) / 100) || 0));
    addItem("User kaid", kaid);
    clearInterval(profileData);
}

/** Add report user button **/
function reportUserButton() {
    if(!isLoggedIn) { return; }
    let userDataNotEmpty = objectNotEmptyTimer(userInfo);
    userDataNotEmpty.then(userInfo => {
        if(userInfo.kaid == kaid) { return; }
        querySelectorAllPromise(".profile-widget", 100)
            .then(e => {
                let discussionWidget = [...e].filter(e => e.querySelector("a.profile-widget-view-all[href$=\"/discussion\"]"))[0];
                console.log(discussionWidget);
                if(discussionWidget) {
                    let button = document.createElement("a");
                    button.id = "kae-report-button";
                    button.style.setProperty("margin", "10px 0px 10px 0px", "important");
                    button.style.setProperty("display", "block", "important");
                    button.innerHTML = "<span>Report user</span>";
                    button.href = `${queueRoot}submit?${buildQuery({
                        type: "user",
                        id: userInfo.kaid,
                        callback: window.location.href
                    })}`;
                    let dWidget = document.getElementById("discussion-widget");
                    let widget = discussionWidget.getElementsByClassName("profile-widget-contents")[0];
                    dWidget && dWidget.children[0] ? dWidget.insertBefore(button, dWidget.children[0]) : widget.appendChild(button);
                }
            }).catch(console.error);
    }).catch(console.error);
}

function duplicateBadges(){
    var usedBadges = document.getElementsByClassName("used");
    if(usedBadges.length < 1) return;
    for(var i = 0; i < usedBadges.length; i++){
        usedBadges[i].classList.remove("used")
    }
}

function centerPoints(){
    querySelectorPromise(".energy-points-badge").then(pointsBadge => {
      pointsBadge.style.padding = "3px";
    }).catch(console.error);
}
