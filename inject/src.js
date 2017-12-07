/**
    This src file is for the official public extension.
**/
//console.log("%cIM PICKLE RICK !!!!", "background: #42f456; color: green; font-size: x-large");

var programUrl = 'https://www.khanacademy.org/api/internal/show_scratchpad?scratchpad_id=';
var userApi = 'https://www.khanacademy.org/api/internal/user/profile';
var userProgramsApi = 'https://www.khanacademy.org/api/internal/user/scratchpads';

var url = window.location.href.split('/');

var userInfo = {};
var programData = {};
var userPrograms = {};

function getSession() {
    return /fkey=(.*?);/ig.exec(document.cookie)[1];
}

function getJSON(url, success) {
    var t = new XMLHttpRequest();
    t.open("GET", url, !0);
    t.responseType = "json";
    t.setRequestHeader('x-ka-fkey', getSession());
    t.addEventListener("load", function() {
        if(t.readyState === t.DONE) { success(t.response); }
    });
    t.send();
}

if (url[3] === 'computer-programming') {
    var programId = url[5].substring(0, (url[5].includes('?') ? url[5].indexOf('?') : 16));
    getJSON(programUrl + programId, function(data) {
        console.log(data);
        programData = data;
    });
}

if (url[3] === 'profile' && !url[5]) {
    var username = url[4];
    var uparam = "?" + (username.substr(0, 5) == "kaid_" ? "kaid" : "username") + "=" + username;
    getJSON(userProgramsApi + uparam + '&projection={%22scratchpads%22:[{%22sumVotesIncremented%22:1,%22spinoffCount%22:1}]}&limit=1500', function(data) {
        console.log(data);
        userPrograms = data;
    });
    getJSON(userApi + uparam, function(data) {
        console.log(data);
        userInfo = data;
    });
}

function newDate(date) {
    var d = new Date(date);
    return (("0"+(d.getMonth()+1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2));
}


/*** When notifications are more than 9, it will show the real value and not 9+ anymore. ***/
function updateNotifs() {
    var dropParent = document.getElementsByClassName('switchText_1lh86m9')[0];
    var notifList = document.getElementsByClassName('scrollDropdown_1jabbia')[0];
    if(!dropParent || !notifList) { return; }
    var dropdown = dropParent.childNodes[5];
    var greenCircle = document.getElementsByClassName('notificationsBadge_16g2pyz')[0];
    if (greenCircle && greenCircle.textContent === '9+') {
        greenCircle.textContent = dropdown.textContent;
    }

    notifList.style.setProperty('overflow-x', 'hidden')
    clearInterval(notifications);
}

/***  Programs no longer have a max width. ***/
function widenProgram() {
    var s = document.getElementsByClassName('wrap_xyqcvi');
    if(!s[0]) { return; }
    s[0].style.setProperty("max-width", "none", "important");
    clearInterval(widenprogram);
}

/*** Add back the community guidelines next to dicussion under programs. ***/
function addGuidelines() {
    var v = document.getElementsByClassName('video-discussion')[0],
        g = document.getElementsByClassName('main-discussion-guidelines discussion-guidelines')[0],
        f = document.getElementsByClassName('footer_crtwg')[0];
    if(!v) return;
    v.style.setProperty("float", "left");
    v.style.setProperty("margin", "0px");
    v.style.setProperty("width", "50%", "important");
    v.style.setProperty("display", "block")
    f.style.setProperty("max-width", "none", "important");
    g.style.setProperty("float", "right");
    g.style.setProperty("width", "48%");
    g.style.setProperty("display", "block");
    g.style.setProperty("margin-top", "0px");

    clearInterval(addguidelines);
}

/*** When viewing a program, it shows how many flags the program has. ***/
function addFlagsToProgram() {
    if(!programData.scratchpad) return;
    var title = document.getElementsByClassName('editTitle_swrcbw');
    var flag = document.getElementsByClassName('discussion-meta-controls');
    if (programData.scratchpad.kaid !== KAdefine.require("./javascript/shared-package/ka.js").getKaid() && !KA._userProfileData.isModerator) {
        var programFlags = programData.scratchpad.flags;

        if(flag.length < 1 && title.length < 1) { return; }

        try {
            var flagString = ' • ' + programData.scratchpad.flags.length;
            flag[0].childNodes[2].innerHTML += flagString;

            if (flag[0].childNodes[2].className === "link_1uvuyao-o_O-computing_77ub1h-o_O-disabled_2gos5") {
                flag[0].childNodes[2].className = "link_1uvuyao-o_O-computing_77ub1h";
            }
        } catch(flag) {
            console.log('Flag is not defined.');
            return;
        }

        // Hover over flag button to show flag reasons.
        var flagBtn = document.getElementsByClassName("link_1uvuyao-o_O-computing_77ub1h")[0];
        var reasons = '';
        programFlags.forEach(function(element) {
            reasons += element + "\n";
        });
        if (programData.scratchpad.flags.length === 0) {
            reasons = "No flags here!";
        }
        flagBtn.title = reasons;

        clearInterval(addFlags);
    }
}

/*** When viewing the hotlist or a projects list, flag counts will be added next to spinoffs. ***/
function showProgramsFlags() {
    var programLinks = document.getElementsByClassName("link_1uvuyao-o_O-noUnderline_4133r1"),
        i = 0;
    if(programLinks.length < 2) {
        console.log("Still loading programs.");
        return;
    }
    var handleResponse = function(a) {
        ids.push(+programLinks[counter].href.split("/")[5]);
        objs.push(a);
        if(counter === programLinks.length - 1) {
            for(result = objs.sort(function(a, b) { return ids.indexOf(a.id) < ids.indexOf(b.id) ? -1 : 1 }), a = 0; a < result.length; a++) {
                programLinks[a].nextSibling.nextSibling.innerHTML += " \u00b7 <span title=\"" + result[a].flags.join('\n') + "\">" + result[a].flags.length + " Flag" + (1 === result[a].flags.length ? "" : "s");
            }
        }
    }

    for (; i < programLinks.length; i++) {
        var id = programLinks[i].href.split("/")[5], counter = 0, ids = [], objs = [], result;
        getJSON("https://www.khanacademy.org/api/internal/scratchpads/" + id, function(a, c) {
            handleResponse(a);
            counter++;
        });
    }
    clearInterval(programFlags);
}

/*** When viewing a program, it shows when it was created and last updated. ***/
function showProgramDates() {
    var date = document.getElementsByClassName("link_1uvuyao-o_O-computing_1nblrap author-nickname profile-programs");
    if (!programData.scratchpad || !date[0] || !date[0].nextElementSibling) { return; }

    date = date[0];
    var createdDate = newDate(programData.scratchpad.created);
    var updatedDate = newDate(programData.scratchpad.date);
    var myFlags = programData.scratchpad.flags.length;

    date.nextElementSibling.innerHTML = "<br>Created: " + createdDate + "<br>Last updated: " + updatedDate + (programData.scratchpad.kaid === KAdefine.require("./javascript/shared-package/ka.js").getKaid() ? ('<br>Flags: ' + myFlags) : '') + (programData.scratchpad.hideFromHotlist ? '<br><span style="color:#af2f18">This program is hidden from the hotlist.</span>' : '<br><span style="color:#18af18">This program is not hidden from the hotlist.</span>');
    clearInterval(getDates);
}

/*** Display more info about a user when viewing their profile. ***/
function getProfileData() {
    var profile = document.getElementsByClassName('user-statistics-table');
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
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Account created</td><td>' + newDate(dateJoined) + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Programs</td><td>' + numPrograms + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Votes recieved</td><td>' + numVotes + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Spinoffs recieved</td><td>' + numSpinoffs + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Average votes received</td><td>' + ((Math.round((numVotes/numPrograms) * 100) / 100) || 0) + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Average spinoffs received</td><td>' + ((Math.round((numSpinoffs/numPrograms) * 100) / 100) || 0)  + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">User kaid</td><td>' + kaid + '</td></tr>';
    clearInterval(profileData);
}

if (window.location.host === 'www.khanacademy.org') {
    var notifications = setInterval(updateNotifs, 250);
    if (url[3] === 'computer-programming' && url[4] !== 'new') {
        var addFlags = setInterval(addFlagsToProgram, 250),
        getDates = setInterval(showProgramDates, 250),
        widenprogram = setInterval(widenProgram, 250),
        addguidelines = setInterval(addGuidelines, 250);
    } else if (url[3] === 'profile') {
        var profileData = setInterval(getProfileData, 250);
    } else if (url[5] === 'browse') {
        var programFlags = setInterval(showProgramsFlags, 500);
    }
}


chrome.runtime.sendMessage("hficmccdhhlbimfnienbfpkcclhojcmh", {
    "fkey": getSession(),
    "username": KA._userProfileData.username
});
setInterval(() => {
  if(!KA._userProfileData) return;
  chrome.runtime.sendMessage("hficmccdhhlbimfnienbfpkcclhojcmh", {
      "fkey": getSession(),
      "username": KA._userProfileData.username
  });
}, 1000);
