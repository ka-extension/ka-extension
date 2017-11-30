/**
    This src file is for the official public extension.
**/

var programUrl = 'https://www.khanacademy.org/api/internal/show_scratchpad?scratchpad_id=';
var userApi = 'https://www.khanacademy.org/api/internal/user/profile?username=';
var userProgramsApi = 'https://www.khanacademy.org/api/internal/user/scratchpads?username=';

var url = window.location.href.split('/');

var userInfo = {};
var programData = {};
var userPrograms = {};

if (window.location.href.split('/')[3] === 'computer-programming') {
    var programId = window.location.href.split('/')[5].substring(0, 16);
    $.getJSON(programUrl + programId, function(data){
        console.log(data);
        programData = data;
    });
}

if (window.location.href.split('/')[3] === 'profile') {
    var username = window.location.href.split('/')[4];
    $.getJSON(userProgramsApi + username +'&limit=1000',function(data){
        console.log(data);
        userPrograms = data;
    });
    $.getJSON(userApi + username, function(data){
        console.log(data);
        userInfo = data;
    });
}

function newDate(date) {
    var d = new Date(date);
    return (("0"+(d.getMonth()+1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2));
}


/*** When notifications are more than 9, it will show the real value and not 9+ anymore. ***/
var updateNotifs = function() {
    var dropdown = document.getElementsByClassName('switchText_1lh86m9')[0].childNodes[5];
    var greenCircle = document.getElementsByClassName('notificationsBadge_16g2pyz');
    if(greenCircle.length < 1){
        return;
    }
    greenCircle = greenCircle[0];
    // If greenCircle.innerHTML > 9, replace with dropdown number.
    if (greenCircle.textContent === '9+') {
        greenCircle.textContent = dropdown.textContent;
    }
    clearInterval(notifications);
};

/*** When viewing a program, it shows how many flags the program has. ***/
var addFlagsToProgram = function(){
    if(programData.scratchpad === undefined) return;
    var flag = document.getElementsByClassName('discussion-meta-controls');
    var title = document.getElementsByClassName('editTitle_swrcbw');
    var programFlags = programData.scratchpad.flags;

    if(flag.length < 1 && title.length < 1){ return; }

    var flagString = ' • ' + programData.scratchpad.flags.length;
    flag[0].childNodes[2].innerHTML += flagString;

    // Hover over flag button to show flag reasons.
    var flagBtn = document.getElementsByClassName("link_1uvuyao-o_O-computing_77ub1h")[0];

    flagBtn.onmouseover = function() {
        var reasons = '';
        programFlags.forEach(function(element) {
            reasons += element + "\n";
        });
        flagBtn.title = reasons;
    };
    clearInterval(addFlags);
};

/*** When viewing a program, it shows when it was created and last updated. ***/
var showProgramDates = function() {

    var dateElm = document.getElementsByClassName("link_1uvuyao-o_O-computing_1nblrap")[0];
    if(dateElm === undefined || dateElm.nextElementSibling === null) return;
    console.log(dateElm)
    var createdDate = newDate(programData.scratchpad.created);
    var updatedDate = newDate(programData.scratchpad.date);

    dateElm.nextElementSibling.innerHTML = "<br>Created: " + createdDate + "<br>Last updated: " + updatedDate;
    clearInterval(getDates);
};

/*** Display more info about a user when viewing their profile. ***/
var getProfileData = function(){
    var profile = document.getElementsByClassName('user-statistics-table');

    if( profile.length < 1){ return; }
    var table = document.getElementsByClassName('user-statistics-table')[0];
    var tableBody = table.childNodes[0];
    var kaid = userInfo.kaid;
    var dateJoined = userInfo.dateJoined;/*.substring(0,10);*/

    var numVotes = 0;
    var numSpinoffs = 0;
    var numPrograms = userPrograms.scratchpads.length;
    for(var i = 0; i < numPrograms; i++){
        var scratchpad = userPrograms.scratchpads[i];
        numVotes += scratchpad.sumVotesIncremented;
        numSpinoffs += scratchpad.spinoffCount;
    }
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Account created</td><td>' + dateJoined + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Programs</td><td>' + numPrograms + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Votes recieved</td><td>' + numVotes + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Spinoffs recieved</td><td>' + numSpinoffs + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Average votes received</td><td>' + Math.round((numVotes/numPrograms) * 100) / 100 + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Average spinoffs received</td><td>' + Math.round((numSpinoffs/numPrograms) * 100) / 100  + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">User kaid</td><td>' + kaid + '</td></tr>';
    clearInterval(profileData);
};

/*** When viewing the hotlist or a projects list, flag counts will be added next to spinoffs. ***/
var showProgramsFlags = function() {
    var programLinks = document.getElementsByClassName("link_1uvuyao-o_O-noUnderline_4133r1"), i = 0;
    if (programLinks.length < 2) {
        return;
    };
    var handleResponse = function(a) {
        ids.push(+programLinks[counter].href.split("/")[5]);
        objs.push(a);
        if (counter === programLinks.length - 1) {
            for (result = objs.sort(function(a, b) {
                    return ids.indexOf(a.id) < ids.indexOf(b.id) ? -1 : 1
                }), a = 0; a < result.length; a++) {
                programLinks[a].nextSibling.nextSibling.innerHTML += " \u00b7 <span title=\"" + result[a].flags.join('\n') + "\">" + result[a].flags.length + " Flag" + (1 === result[a].flags.length ? "" : "s")
            }
        }
    }
    for (; i < programLinks.length; i++) {
        var id = programLinks[i].href.split("/")[5], counter = 0, ids = [], objs = [], result;
        $.getJSON("https://www.khanacademy.org/api/internal/scratchpads/" + id, function(a, c) {
            handleResponse(a);
            counter++;
        });
    }
    console.log("Done");
    clearInterval(programFlags);
};
var addDownvoteButton = function(){
  var buttons = document.getElementsByClassName("link_1uvuyao-o_O-computing_1w8n1i8")[1]["parentNode"];//buttons_vponqv
  if(!buttons || !programData) return;
  window.programData = programData;
  var text = "Vote Down • " + programData.scratchpad.sumVotesIncremented;
  var span = document.createElement('span');
  span.style = "display: inline-block; position: relative;"
  span.innerHTML = '<a aria-disabled="false" role="button" href="javascript:void(0)" class="link_1uvuyao-o_O-computing_1w8n1i8"><span>' + text + '</span></a>'
  span.onclick = function(){
    var getSession = () => /fkey=(.*?);/ig.exec(document.cookie)[1];
    var key = window.programData.scratchpad.key;
    var req = new XMLHttpRequest();
    req.open("POST", "https://www.khanacademy.org/api/internal/discussions/voteentity");
    req.setRequestHeader('x-ka-fkey', getSession());
    req.setRequestHeader('Content-type', "application/x-www-form-urlencoded");
    req.send("entity_key=" + key + "&vote_type=-1")
    req.addEventListener('load', function(){
      var b1 = document.getElementsByClassName("link_1uvuyao-o_O-computing_1w8n1i8")[1];
      var b2 = document.getElementsByClassName("link_1uvuyao-o_O-computing_1w8n1i8")[2];
      b1.innerHTML = "Vote Up • " + (programData.scratchpad.sumVotesIncremented - 1);
      b2.innerHTML = "Vote Down • " + (programData.scratchpad.sumVotesIncremented - 1);

    });
  };
  buttons.appendChild(span);
  clearInterval(addDownvote);
};

if (window.location.host === 'www.khanacademy.org') {
    var notifications = setInterval(updateNotifs, 250);
    if (url[3] === 'computer-programming') {
        var addFlags = setInterval(addFlagsToProgram,250);
        var getDates = setInterval(showProgramDates, 250);
        var addDownvote = setInterval(addDownvoteButton, 250);
    } else if (url[3] === 'profile') {
        var profileData = setInterval(getProfileData, 250);
    } else if (url[5] === 'browse') {
        var programFlags = setInterval(showProgramsFlags, 250);

    }
}
