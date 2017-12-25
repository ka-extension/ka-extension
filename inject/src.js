/**
    This src file is for the official public extension.
**/
(function() {
    
var programUrl = 'https://www.khanacademy.org/api/internal/show_scratchpad?scratchpad_id=';
var userApi = 'https://www.khanacademy.org/api/internal/user/profile';
var userProgramsApi = 'https://www.khanacademy.org/api/internal/user/scratchpads';

var url = window.location.href.split('/');

var userInfo = {};
var programData = {};
var userPrograms = {};
    
var kaid = KAdefine.require("./javascript/shared-package/ka.js").getKaid(),
    isLoggedIn = KAdefine.require("./javascript/shared-package/ka.js").isLoggedIn();

var commentLinkGenerator = null;

var extensionCommentClassName = "ka-extension-modified-comment";
var extensionCommentEditClassName = "ka-extension-modified-comment-edit-link";
var commentEditClassPrefix = "ka-extension-edit-";
var commentEditUIClass = "ka-extension-edit-comment-ui-div";
var commentCancelEditPrefix = "ka-extension-edit-comment-cancel-";

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

function CommentLinker(uok /* "Username or KAID" */) {
    this.uok = uok;
    this.commentLinks = {};
    this.topicIds = {};
    this.topicTypes = {};
    this.page = 0;
    this.commentNum = 0;
    this.limit = 10;
}
CommentLinker.prototype = {
    get: function(kaencrypted) {
        return this.commentLinks[kaencrypted];
    },
    getTopicId: function(kaencrypted) {
        return this.topicIds[kaencrypted];
    },
    getTopicType: function(kaencrypted) {
        return this.topicTypes[kaencrypted];
    },
    genURL: function(page, sort) {
        return "https://www.khanacademy.org/api/internal/user/replies?casing=camel&" + ((this.uok.substr(0, 5) == "kaid_") ? "kaid" : "username") + "=" + this.uok + "&sort=" + sort + "&subject=all&limit=" + this.limit + "&page=" + page + "&lang=en&_=" + Date.now();
    },
    next: function(success) {
        var that = this;
        var p = this.page++;
        getJSON(that.genURL(p, 1), function(data) {
            for(let i = 0; i < data.length; i++) {
                let comment = data[i];
                that.topicIds[comment.key] = comment.focus.id;
                that.topicTypes[comment.key] = comment.focus.kind;
                that.commentLinks[comment.key] = comment.focusUrl + "?qa_expand_key=" + comment.expandKey;
            }
            getJSON(that.genURL(p, 2), function(data) {
                for(let i = 0; i < data.length; i++) {
                    let comment = data[i];
                    that.topicIds[comment.key] = comment.focus.id;
                    that.topicTypes[comment.key] = comment.focus.kind;
                    that.commentLinks[comment.key] = comment.focusUrl + "?qa_expand_key=" + comment.expandKey;
                }
                if(typeof success == "function") { success(that.commentLinks); }
            });
        });
    }
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

    notifList.style.setProperty('overflow-x', 'hidden');
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
    g.style.setProperty("width", "25%");
    g.style.setProperty("display", "block");

    clearInterval(addguidelines);
}

/*** When viewing a program, it shows how many flags the program has. ***/
function addFlagsToProgram() {
    if(!programData.scratchpad) return;
    var title = document.getElementsByClassName('editTitle_swrcbw');
    var flag = document.getElementsByClassName('discussion-meta-controls');
    if (programData.scratchpad.kaid !== kaid && !KA._userProfileData.isModerator) {
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

    date.nextElementSibling.innerHTML = "<br>Created: " + createdDate + "<br>Last updated: " + updatedDate + (programData.scratchpad.kaid === kaid ? ('<br>Flags: ' + myFlags) : '') + (programData.scratchpad.hideFromHotlist ? '<br><span style="color:#af2f18">This program is hidden from the hotlist.</span>' : '<br><span style="color:#18af18">This program is not hidden from the hotlist.</span>');
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
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Account created</td><td>' + (userInfo.dateJoined ? newDate(dateJoined)  : "Unknown") + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Programs</td><td>' + numPrograms + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Votes recieved</td><td>' + numVotes + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Spinoffs recieved</td><td>' + numSpinoffs + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Average votes received</td><td>' + ((Math.round((numVotes/numPrograms) * 100) / 100) || 0) + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">Average spinoffs received</td><td>' + ((Math.round((numSpinoffs/numPrograms) * 100) / 100) || 0)  + '</td></tr>';
    tableBody.innerHTML += '<tr><td class="user-statistics-label">User kaid</td><td>' + kaid + '</td></tr>';
    clearInterval(profileData);
}

/*** Add links for all comments when viewing user discussion. ***/
function commentsButtonEventListener() {
    var button = document.querySelector(".simple-button.discussion-list-more");
    if(!button) { return; }
    button.addEventListener("click", function() {
        if(commentLinkGenerator != null) { commentLinkGenerator.next(); }
    });
    clearInterval(addCommentsButtonEventListener);
}

function commentLinks() {
    if(!commentLinkGenerator) { return; }
    var unalteredComments = document.querySelectorAll(".discussion-item.reply:not(." + extensionCommentClassName + ")");
    for(let i = 0; i < unalteredComments.length; i++) {
        let comment = unalteredComments[i];
        let url = commentLinkGenerator.get(comment.id);
        if(url) {
            let metaControls = comment.getElementsByClassName("discussion-meta-controls")[0];
            if(!metaControls) { continue; }
            let separator = document.createElement("span");
            separator.className = "discussion-meta-separator";
            separator.textContent = "• ";
            metaControls.appendChild(separator);
            let link = document.createElement("a");
            link.href = url;
            link.textContent = "Link";
            let outerSpan = document.createElement("span");
            outerSpan.appendChild(link);
            metaControls.appendChild(outerSpan);
            comment.className += " " + extensionCommentClassName;
        }
    }
}
    
function HTMLtoKAMarkdown(html) {
    return html
        .replace(/<pre>\s*<code>([.\s\S]*?)<\/code>\s*<\/pre>/ig, function(match, one) { return "```\n" + one + "\n```"; })
        .replace(/<code>(.*?)<\/code>/ig, function(match, one) { return "`" + one + "`"; })
        .replace(/<b>(.*?)<\/b>/ig, function(match, one) { return "*" + one + "*"; })
        .replace(/<em>(.*?)<\/em>/ig, function(match, one) { return "_" + one + "_"; })
        .replace(/<a.*?>(.*?)<\/a>/ig, function(match, one) { return one; })
        .replace(/<br(?:\s*\/\s*)?>/ig, function() { return "\n"; })
}
function KAMarkdowntoHTML(markdown) {
    return markdown
        .replace(/\`\`\`\s*([.\s\S]*?)\s*\`\`\`/ig, function(match, one) { return "<pre><code>" + one + "</code></pre>"; })
        .replace(/\`(.+?)\`/ig, function(match, one) { return "<code>" + one + "</code>"; })
        .replace(/\*(.+?)\*/ig, function(match, one) { return "<b>" + one + "</b>"; })
        .replace(/_(.+?)_/ig, function(match, one) { return "<em>" + one + "</em>"; })
        .replace(/\n/ig, function() { return "<br>"; })
}

/** Add user interface for editing comments **/
/** 
    A special thank you goes out to @MatthiasSaihttam for the comment editing functionality.  
    This feature wouldn't have been possible without him 
**/
function addCommentEditLink(element) {
    
    // Uncomment if this feature interferes with Guardian tools
    // if(KA._userProfileData && KA._userProfileData.isModerator) { return; }
    
    let metaControls = element.getElementsByClassName("discussion-meta-controls")[0],
        modTools = element.getElementsByClassName("mod-tools")[0];
        
    if(!element || !element.className.includes("reply") || !metaControls || !modTools) { return; }
    
    let commentEditLink = document.createElement("a");
    
    let separator = document.createElement("span");
    separator.className = "discussion-meta-separator";
    separator.textContent = "• ";
    metaControls.appendChild(separator);
    commentEditLink.className = commentEditClassPrefix + element.id;
    commentEditLink.href = "javascript:void(0)";
    commentEditLink.textContent = "Edit";
    let outerSpan = document.createElement("span");
    outerSpan.appendChild(commentEditLink);
    metaControls.appendChild(outerSpan);
    
    let editCommentDiv = document.createElement("div");
    editCommentDiv.className = commentEditUIClass;
    let textarea = document.createElement("textarea");
    textarea.className = "discussion-text open";
    textarea.style.display = "none"
    element.appendChild(textarea);
    
    let discussionControl = document.createElement("div");
    discussionControl.className = "discussion-controls";
    let floatRightSpan = document.createElement("span");
    floatRightSpan.className = "discussion-control float-right";
    let orDivide = document.createElement("span");
    orDivide.textContent = "or";
    let cancel = document.createElement("a");
    cancel.href = "javascript:void(0)";
    cancel.textContent = "Cancel";
    cancel.style.color = "#678d00";
    cancel.className = commentCancelEditPrefix + element.id;
    let editBtn = document.createElement("button");
    editBtn.className = "simple-button primary edit-comment-" + element.id + "-button";
    editBtn.style.fontSize = "12px";
    editBtn.setAttribute("type", "button");
    editBtn.textContent = "Edit this comment";
    let floatrights = [floatRightSpan.cloneNode(), floatRightSpan.cloneNode(), floatRightSpan.cloneNode()];
    let correspondingElements = [cancel, orDivide, editBtn];
    for(let i = 0; i < floatrights.length; i++) {
        floatrights[i].appendChild(correspondingElements[i]);
        discussionControl.appendChild(floatrights[i]);
    }
    discussionControl.style.display = "none";
    element.appendChild(discussionControl);
    
    cancel.addEventListener("click", function(e) {
        let link = e.target;
        let kaencrypted = link.className.substr(commentCancelEditPrefix.length);
        let parentComment = document.getElementById(kaencrypted);
        let discMeta = parentComment.getElementsByClassName("discussion-meta")[0];
        let contentDiv = parentComment.getElementsByClassName("discussion-content")[0];
        let textarea = parentComment.getElementsByTagName("textarea")[0];
        let discussionControl = parentComment.getElementsByClassName("discussion-controls")[0];
        textarea.style.display = discussionControl.style.display = "none";
        contentDiv.style.display = discMeta.style.display = "block";
    });
    
    editBtn.addEventListener("click", function(e) {
        let link = e.target;
        let kaencrypted = /edit-comment-(kaencrypted_.*?)-button/ig.exec(link.className)[1];
        let parentComment = document.getElementById(kaencrypted);
        let discMeta = parentComment.getElementsByClassName("discussion-meta")[0];
        let contentDiv = parentComment.getElementsByClassName("discussion-content")[0];
        let textarea = parentComment.getElementsByTagName("textarea")[0];
        let discussionControl = parentComment.getElementsByClassName("discussion-controls")[0];
        let x = new XMLHttpRequest();
        // Based off of @MatthiasSaihttam's bookmarklet (https://www.khanacademy.org/computer-programming/edit-comments/6039670653)
        let focusId = commentLinkGenerator ? commentLinkGenerator.getTopicId(kaencrypted) : KAdefine.require("./javascript/discussion-package/discussion.js").data.focusId,
            focusType = commentLinkGenerator ? commentLinkGenerator.getTopicType(kaencrypted) : KAdefine.require("./javascript/discussion-package/discussion.js").data.focusKind;
        x.open("PUT", "https://www.khanacademy.org/api/internal/discussions/" + focusType + "/" + focusId + "/comments/" + kaencrypted + "?casing=camel&lang=en&_=" + Date.now());
        x.setRequestHeader("x-ka-fkey", getSession());
        x.setRequestHeader("Content-type", "application/json");
        x.addEventListener("load", function() {
            contentDiv.innerHTML = KAMarkdowntoHTML(textarea.value);
            textarea.style.display = discussionControl.style.display = "none";
            contentDiv.style.display = discMeta.style.display = "block";
        });
        x.addEventListener("error", function() { alert("Unable to edit comment.  Please try again."); });
        x.send(JSON.stringify({ text: textarea.value }));
    })
    
    commentEditLink.addEventListener("click", function(e) {
        let link = e.target;
        let kaencrypted = link.className.substr(commentEditClassPrefix.length);
        let parentComment = document.getElementById(kaencrypted);
        let discMeta = parentComment.getElementsByClassName("discussion-meta")[0];
        let contentDiv = parentComment.getElementsByClassName("discussion-content")[0];
        let content = HTMLtoKAMarkdown(contentDiv.innerHTML).trim();
        let textarea =  parentComment.getElementsByTagName("textarea")[0];
        let discussionControl = parentComment.getElementsByClassName("discussion-controls")[0];
        textarea.value = content;
        contentDiv.style.display = discMeta.style.display = "none";
        textarea.style.display = discussionControl.style.display = "block";
    });
    
    element.className += " " + extensionCommentEditClassName;
}    
function addCommentEditUI() {
    if(!isLoggedIn) { return; }
    
    var KADiscussionPackage = null;
    try {
        KADiscussionPackage = KAdefine.require("./javascript/discussion-package/discussion.js");
    } catch(e) {}
    
    if(!KADiscussionPackage && !KADiscussionPackage.data) { return; }
    if(!KADiscussionPackage.data.focusId && !KADiscussionPackage.data.focusKind && !commentLinkGenerator) { return; }
    
    let uneditedComments = document.querySelectorAll(".reply:not(." + extensionCommentEditClassName + ")");
    for(let i = 0; i < uneditedComments.length; i++) {
        addCommentEditLink(uneditedComments[i]);
    }
}
    
if (window.location.host === 'www.khanacademy.org') {
    var notifications = setInterval(updateNotifs, 250);
    var addEditUIInterval = setInterval(addCommentEditUI, 250);
    if (url[3] === 'computer-programming' && url[4] !== 'new') {
        var addFlags = setInterval(addFlagsToProgram, 250),
            getDates = setInterval(showProgramDates, 250),
            widenprogram = setInterval(widenProgram, 250),
            addguidelines = setInterval(addGuidelines, 250);
    } else if (url[3] === 'profile') {
        var profileData = setInterval(getProfileData, 250);
        if(url[5] == "discussion" && url[6] == "replies") {
            commentLinkGenerator = new CommentLinker(url[4] /* Username or kaid */);
            commentLinkGenerator.next();
            var addCommentsButtonEventListener = setInterval(commentsButtonEventListener, 50),
                addCommentLinks = setInterval(commentLinks, 100);
        }
    } else if (url[5] === 'browse') {
        var programFlags = setInterval(showProgramsFlags, 500);
    }
}

// Notification stuff.
chrome.runtime.sendMessage("gniggljddhajnfbkjndcgnomkddfcial", {
    "fkey": getSession(),
    "username": KA._userProfileData.username
});
setInterval(function() {
  if(!KA._userProfileData) return;
  chrome.runtime.sendMessage("gniggljddhajnfbkjndcgnomkddfcial", {
      "fkey": getSession(),
      "username": KA._userProfileData.username
  });
}, 1000);
    
})();
