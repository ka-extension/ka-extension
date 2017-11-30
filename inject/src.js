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

var getJSON = function(e, n) {
    var t = new XMLHttpRequest;
    t.open("GET", e, !0),
    t.responseType = "json",
    t.onload = function() {
        if (t.readyState === t.DONE) {
            t.response;
            n(t.response);
         }
    };
    t.send()
};

if (url[3] === 'computer-programming') {
    var programId = url[5].substring(0, (url[5].includes('?') ? url[5].indexOf('?') : 16));
    getJSON(programUrl + programId, function(data) {
        console.log(data);
        programData = data;
    });
}

if (url[3] === 'profile') {
    var username = url[4];
    getJSON(userProgramsApi + username +'&limit=1500',function(data) {
        console.log(data);
        userPrograms = data;
    });
    getJSON(userApi + username, function(data) {
        console.log(data);
        userInfo = data;
    });
}

function newDate(date) {
    var d = new Date(date);
    return (("0"+(d.getMonth()+1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2));
};


/*** When notifications are more than 9, it will show the real value and not 9+ anymore. ***/
function updateNotifs() {
    var dropdown = document.getElementsByClassName('switchText_1lh86m9')[0].childNodes[5];
    var greenCircle = document.getElementsByClassName('notificationsBadge_16g2pyz')[0];
    
    if (greenCircle && greenCircle.textContent === '9+') {
        greenCircle.textContent = dropdown.textContent;
    }
    clearInterval(notifications);
};

/***  Programs no longer have a max width. ***/
function widenProgram() {
    let s = document.getElementsByClassName('wrap_xyqcvi')[0];
    s.style.setProperty("max-width", "none", "important");

    clearInterval(widenprogram);
};

/*** When viewing a program, it shows how many flags the program has. ***/
function addFlagsToProgram() {
  var title = document.getElementsByClassName('editTitle_swrcbw');
  var flag = document.getElementsByClassName('discussion-meta-controls');
  if(!programData) return;
  if (programData.scratchpad.kaid !== KA._userProfileData.kaid && !KA._userProfileData.isModerator) {

    var programFlags = programData.scratchpad.flags;
    if(flag.length < 1 && title.length < 1){ return; }

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

    flagBtn.onmouseover = function() {
      var reasons = '';
      programFlags.forEach(function(element) {
          reasons += element + "\n";
      });
      if (programData.scratchpad.flags.length === 0) {
          reasons = "No flags here!";
      }
      flagBtn.title = reasons;
    };
    clearInterval(addFlags);
  }
};

/*** When viewing the hotlist or a projects list, flag counts will be added next to spinoffs. ***/
function showProgramsFlags() {
  var programLinks = document.getElementsByClassName("link_1uvuyao-o_O-noUnderline_4133r1"), i = 0;
  if (programLinks.length < 2) {
    console.log("Still loading programs.");
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
      getJSON("https://www.khanacademy.org/api/internal/scratchpads/" + id, function(a, c) {
          handleResponse(a);
          counter++;
      });
  }
  clearInterval(programFlags);
};

/*** When viewing a program, it shows when it was created and last updated. ***/
function showProgramDates() {
  var date = document.getElementsByClassName("link_1uvuyao-o_O-computing_1nblrap author-nickname profile-programs");
  if (!programData || !date) return;

  date = date[0];
  var createdDate = newDate(programData.scratchpad.created);
  var updatedDate = newDate(programData.scratchpad.date);
  var myFlags = programData.scratchpad.flags.length;

  date.nextElementSibling.innerHTML = "<br>Created: " + createdDate + "<br>Last updated: " + updatedDate + (programData.scratchpad.kaid === KA._userProfileData.kaid ? ('<br>Flags: ' + myFlags) : '');
  clearInterval(getDates);
};

/*** Display more info about a user when viewing their profile. ***/
function getProfileData() {
  var profile = document.getElementsByClassName('user-statistics-table');

  if( profile.length < 1){ return; }
  var table = document.getElementsByClassName('user-statistics-table')[0];
  var tableBody = table.childNodes[0];
  var kaid = userInfo.kaid;
  var dateJoined = userInfo.dateJoined;

  var numVotes = 0;
  var numSpinoffs = 0;
  var numPrograms = userPrograms.scratchpads.length;
  for(var i = 0; i < numPrograms; i++){
      var scratchpad = userPrograms.scratchpads[i];
      numVotes += scratchpad.sumVotesIncremented;
      numSpinoffs += scratchpad.spinoffCount;
  }
  tableBody.innerHTML += '<tr><td class="user-statistics-label">Account created</td><td>' + newDate(dateJoined) + '</td></tr>';
  tableBody.innerHTML += '<tr><td class="user-statistics-label">Programs</td><td>' + numPrograms + '</td></tr>';
  tableBody.innerHTML += '<tr><td class="user-statistics-label">Votes recieved</td><td>' + numVotes + '</td></tr>';
  tableBody.innerHTML += '<tr><td class="user-statistics-label">Spinoffs recieved</td><td>' + numSpinoffs + '</td></tr>';
  tableBody.innerHTML += '<tr><td class="user-statistics-label">Average votes received</td><td>' + Math.round((numVotes/numPrograms) * 100) / 100 + '</td></tr>';
  tableBody.innerHTML += '<tr><td class="user-statistics-label">Average spinoffs received</td><td>' + Math.round((numSpinoffs/numPrograms) * 100) / 100  + '</td></tr>';
  tableBody.innerHTML += '<tr><td class="user-statistics-label">User kaid</td><td>' + kaid + '</td></tr>';
  clearInterval(profileData);
};

/*** Display a downvote button under programs. ***/
var addDownvoteButton = function() {
  //inspired by @elmt2's script
  var buttons = document.getElementsByClassName("link_1uvuyao-o_O-computing_1w8n1i8");
  if (!buttons[1] || !programData) return;
  buttons = buttons[1]["parentNode"]
  window.programData = programData;
  var text = "Vote Down • " + programData.scratchpad.sumVotesIncremented;
  var span = document.createElement('span');
  span.style = "display: inline-block; position: relative;"
  span.innerHTML = '<a aria-disabled="false" role="button" href="javascript:void(0)" class="link_1uvuyao-o_O-computing_1w8n1i8"><span>' + text + '</span></a>'
  span.onclick = function() {
      var getSession = () => /fkey=(.*?);/ig.exec(document.cookie)[1];
      var key = window.programData.scratchpad.key;
      var req = new XMLHttpRequest();
      req.open("POST", "https://www.khanacademy.org/api/internal/discussions/voteentity");
      req.setRequestHeader('x-ka-fkey', getSession());
      req.setRequestHeader('Content-type', "application/x-www-form-urlencoded");
      req.send("entity_key=" + key + "&vote_type=-1")
      req.addEventListener('load', function() {
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
  if (url[3] === 'computer-programming' && url[4] !== 'new') {
    var addFlags = setInterval(addFlagsToProgram, 250);
    var getDates = setInterval(showProgramDates, 250);
    var widenprogram = setInterval(widenProgram, 250);
    var addDownvote = setInterval(addDownvoteButton, 250);
  } else if (url[3] === 'profile') {
    var profileData = setInterval(getProfileData, 250);
  } else if (url[5] === 'browse') {
    var programFlags = setInterval(showProgramsFlags, 500);
  }
}
