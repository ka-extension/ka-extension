/**
    This src file is for the official public extension.
**/

(function() {

var programUrl = 'https://www.khanacademy.org/api/internal/show_scratchpad?scratchpad_id=';
var userApi = 'https://www.khanacademy.org/api/internal/user/profile';
var userProgramsApi = 'https://www.khanacademy.org/api/internal/user/scratchpads';

var aceThemes = {
    themes: {},
    addTheme: function(themeName, css) {
        this.themes[themeName] = css.replace(new RegExp("\\.ace-" + themeName, "ig"), ".ace-tm");
    },
    getThemeCSS: function(themeName) {
        return this.themes[themeName];
    }
};

/* Ace Monokai theme.  Taken from https://github.com/ajaxorg/ace/blob/master/lib/ace/theme/monokai.css */
aceThemes.addTheme("monokai", ".ace-monokai .ace_gutter {background: #2F3129;color: #8F908A}.ace-monokai .ace_print-margin {width: 1px;background: #555651}.ace-monokai {background-color: #272822;color: #F8F8F2}.ace-monokai .ace_cursor {color: #F8F8F0}.ace-monokai .ace_marker-layer .ace_selection {background: #49483E}.ace-monokai.ace_multiselect .ace_selection.ace_start {box-shadow: 0 0 3px 0px #272822;}.ace-monokai .ace_marker-layer .ace_step {background: rgb(102, 82, 0)}.ace-monokai .ace_marker-layer .ace_bracket {margin: -1px 0 0 -1px;border: 1px solid #49483E}.ace-monokai .ace_marker-layer .ace_active-line {background: #202020}.ace-monokai .ace_gutter-active-line {background-color: #272727}.ace-monokai .ace_marker-layer .ace_selected-word {border: 1px solid #49483E}.ace-monokai .ace_invisible {color: #52524d}.ace-monokai .ace_entity.ace_name.ace_tag,.ace-monokai .ace_keyword,.ace-monokai .ace_meta.ace_tag,.ace-monokai .ace_storage {color: #F92672}.ace-monokai .ace_punctuation,.ace-monokai .ace_punctuation.ace_tag {color: #fff}.ace-monokai .ace_constant.ace_character,.ace-monokai .ace_constant.ace_language,.ace-monokai .ace_constant.ace_numeric,.ace-monokai .ace_constant.ace_other {color: #AE81FF}.ace-monokai .ace_invalid {color: #F8F8F0;background-color: #F92672}.ace-monokai .ace_invalid.ace_deprecated {color: #F8F8F0;background-color: #AE81FF}.ace-monokai .ace_support.ace_constant,.ace-monokai .ace_support.ace_function {color: #66D9EF}.ace-monokai .ace_fold {background-color: #A6E22E;border-color: #F8F8F2}.ace-monokai .ace_storage.ace_type,.ace-monokai .ace_support.ace_class,.ace-monokai .ace_support.ace_type {font-style: italic;color: #66D9EF}.ace-monokai .ace_entity.ace_name.ace_function,.ace-monokai .ace_entity.ace_other,.ace-monokai .ace_entity.ace_other.ace_attribute-name,.ace-monokai .ace_variable {color: #A6E22E}.ace-monokai .ace_variable.ace_parameter {font-style: italic;color: #FD971F}.ace-monokai .ace_string {color: #E6DB74}.ace-monokai .ace_comment {color: #75715E}.ace-monokai .ace_indent-guide {background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y}");

/* Ace Textmate theme.  Taken from https://github.com/ajaxorg/ace/blob/master/lib/ace/theme/textmate.css */
aceThemes.addTheme("tm", ".ace-tm .ace_gutter {background: #f0f0f0;color: #333;}.ace-tm .ace_print-margin {width: 1px;background: #e8e8e8;}.ace-tm .ace_fold {background-color: #6B72E6;}.ace-tm {background-color: #FFFFFF;color: black;}.ace-tm .ace_cursor {color: black;}.ace-tm .ace_invisible {color: rgb(191, 191, 191);}.ace-tm .ace_storage,.ace-tm .ace_keyword {color: blue;}.ace-tm .ace_constant {color: rgb(197, 6, 11);}.ace-tm .ace_constant.ace_buildin {color: rgb(88, 72, 246);}.ace-tm .ace_constant.ace_language {color: rgb(88, 92, 246);}.ace-tm .ace_constant.ace_library {color: rgb(6, 150, 14);}.ace-tm .ace_invalid {background-color: rgba(255, 0, 0, 0.1);color: red;}.ace-tm .ace_support.ace_function {color: rgb(60, 76, 114);}.ace-tm .ace_support.ace_constant {color: rgb(6, 150, 14);}.ace-tm .ace_support.ace_type,.ace-tm .ace_support.ace_class {color: rgb(109, 121, 222);}.ace-tm .ace_keyword.ace_operator {color: rgb(104, 118, 135);}.ace-tm .ace_string {color: rgb(3, 106, 7);}.ace-tm .ace_comment {color: rgb(76, 136, 107);}.ace-tm .ace_comment.ace_doc {color: rgb(0, 102, 255);}.ace-tm .ace_comment.ace_doc.ace_tag {color: rgb(128, 159, 191);}.ace-tm .ace_constant.ace_numeric {color: rgb(0, 0, 205);}.ace-tm .ace_variable {color: rgb(49, 132, 149);}.ace-tm .ace_xml-pe {color: rgb(104, 104, 91);}.ace-tm .ace_entity.ace_name.ace_function {color: #0000A2;}.ace-tm .ace_heading {color: rgb(12, 7, 255);}.ace-tm .ace_list {color:rgb(185, 6, 144);}.ace-tm .ace_meta.ace_tag {color:rgb(0, 22, 142);}.ace-tm .ace_string.ace_regex {color: rgb(255, 0, 0)}.ace-tm .ace_marker-layer .ace_selection {background: rgb(181, 213, 255);}.ace-tm.ace_multiselect .ace_selection.ace_start {box-shadow: 0 0 3px 0px white;}.ace-tm .ace_marker-layer .ace_step {background: rgb(252, 255, 0);}.ace-tm .ace_marker-layer .ace_stack {background: rgb(164, 229, 101);}.ace-tm .ace_marker-layer .ace_bracket {margin: -1px 0 0 -1px;border: 1px solid rgb(192, 192, 192);}.ace-tm .ace_marker-layer .ace_active-line {background: rgba(0, 0, 0, 0.07);}.ace-tm .ace_gutter-active-line {background-color : #dcdcdc;}.ace-tm .ace_marker-layer .ace_selected-word {background: rgb(250, 250, 255);border: 1px solid rgb(200, 200, 250);}.ace-tm .ace_indent-guide {background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==) right repeat-y;}");

var url = window.location.href.split('/');

var userInfo = {};
var programData = {};
var userPrograms = {};

const kaid = KAdefine.require("./javascript/shared-package/ka.js").getKaid(),
    isLoggedIn = KAdefine.require("./javascript/shared-package/ka.js").isLoggedIn();

const chromeid = /*"gniggljddhajnfbkjndcgnomkddfcial"*/ "mkgmjebgaipjiijmagihicffklbnnljf";

var commentLinkGenerator = null;

/** CSS classnames and class prefixes **/
var extensionCommentClassName = "ka-extension-modified-comment";
var extensionCommentEditClassName = "ka-extension-modified-comment-edit-link";
var commentEditClassPrefix = "ka-extension-edit-";
var commentEditUIClass = "ka-extension-edit-comment-ui-div";
var commentCancelEditPrefix = "ka-extension-edit-comment-cancel-";

var extensionStoragePrefix = "ka-extension-localstorage-item-";
var extensionToggleDarkEditorItemKey = extensionStoragePrefix + "toggle-editor-dark-theme";

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

if (url[3] === 'computer-programming' || url[3] === 'hour-of-code') {
    var programId = url[5].substring(0, (url[5].includes('?') ? url[5].indexOf('?') : 16));
    getJSON(programUrl + programId, function(data) {
        console.log(data);
        programData = data;
    });
}

if (url[3] === 'profile' && !url[5] || url.length < 5) {
    var username = url[4] || KA._userProfileData.username;
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
    var greenCircle = document.getElementsByClassName('notificationsBadge_16g2pyz')[0];
    if(!greenCircle) { return; }
    if(KA._userProfileData.countBrandNewNotifications === 0){
      greenCircle.textContent = 1;
    }
    else{
      greenCircle.textContent = KA._userProfileData.countBrandNewNotifications;
    }
    clearInterval(notifications);
}

function stopNotifOverflow(){
    var notifList = document.getElementsByClassName('scrollDropdown_1jabbia')[0];
    if(!notifList) return;
    notifList.style.setProperty('overflow-x', 'hidden');
    clearInterval(addStopNotifOverflow)
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
    g.style.setProperty("margin-top", "0px");

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

function reportProgram(kaid, id, reason, callback) {
    var port = chrome.runtime.connect(chromeid, { "name": "reportprogram" });
    port.onMessage.addListener(callback);
    port.postMessage({
        "kaid": kaid,
        "reason": reason,
        "programId": id
    });
}

// test function - to be removed
window.report = function() {
    reportProgram(kaid, +prompt("Program id (to report): "), prompt("Reason: "), function(response) {
        if(chrome.runtime.lastError) {
            console.error("Error", chrome.runtime.lastError);
        } else {
            console[response.success ? "log" : "warn"](response.message);
        }
    });
}

/*** Add editor dark theme ***/
function darkTheme() {
    var sid = "ka-extension-ace-override";
    if(document.getElementById(sid)) { document.body.removeChild(document.getElementById(sid)); }
    var s = document.createElement("style");
    s.id = sid;
    s.innerHTML = aceThemes.getThemeCSS(+localStorage.getItem(extensionToggleDarkEditorItemKey) ? "monokai" : "tm");
    document.body.appendChild(s);
}

/*** Add a "Toggle Darkmode" button for programs ***/
function darkToggleButton() {
    let toolbar = document.getElementsByClassName("toolbar_y6hf3w")[0];
    if(!toolbar) { return; }
    let rightArea = toolbar.getElementsByClassName("right_piqaq3")[0];
    if(!rightArea) { return; }
    let outerButtonSpan = document.createElement("span");
    outerButtonSpan.className = "pull-right";
    let innerButtonLink = document.createElement("a");
    innerButtonLink.style = "background-color: transparent; color: #FFFFFF; text-decoration: none; -webkit-appearance: none; -moz-appearance: none; border-radius: 4px; cursor: pointer; display: inline-block; font-family: inherit; font-size: 15px; font-weight: 400; margin-right: 3px; padding: 8px 8px; text-align: center; transition: 0.1s all; user-select: none; background: #656565; -webkit-transition: 0.1s all; -webkit-user-select: none;";
    innerButtonLink.href = "javascript:void(0)";
    innerButtonLink.textContent = "Toggle Dark Theme";
    innerButtonLink.addEventListener("mouseover", function() { this.style.background = "#484848"; });
    innerButtonLink.addEventListener("mouseout", function() { this.style.background = "#656565"; });
    innerButtonLink.addEventListener("click", function() {
        localStorage.setItem(extensionToggleDarkEditorItemKey, +!+localStorage.getItem(extensionToggleDarkEditorItemKey));
        darkTheme();
    });
    outerButtonSpan.appendChild(innerButtonLink);
    rightArea.appendChild(outerButtonSpan);
    clearInterval(addDarkToggleButton);
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

/*** Automatically add links to comments when viewing user discussion. ***/
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

/*** When your own comments are displayed, add an edit option to them. ***/
function addCommentEditUI() {
    if (!isLoggedIn) { return; }

    var KADiscussionPackage = null;
    try {
        KADiscussionPackage = KAdefine.require("./javascript/discussion-package/discussion.js");
    } catch(e) {}

    if (!KADiscussionPackage || !KADiscussionPackage.data) { return; }
    if ((!KADiscussionPackage.data.focusId || !KADiscussionPackage.data.focusKind) && !commentLinkGenerator) { return; }

    let uneditedComments = document.querySelectorAll(".reply:not(." + extensionCommentEditClassName + ")");
    for (let i = 0; i < uneditedComments.length; i++) {
        addCommentEditLink(uneditedComments[i]);
    }
}

/*** Allows you to easily add a custom location in bio settings. ***/
function locationElm() {
    var locationDiv = document.getElementById('s2id_autogen1');
    if(!locationDiv || !userInfo.userLocation) return;
    document.getElementById('bio-picker').style.setProperty('resize', 'none');
    document.getElementById('bio-picker').style.setProperty('height', '90px');
    var locDisp = userInfo.userLocation.displayText;
    locationDiv.innerHTML = '<input id="kae-location-textarea" type="text" value="' + locDisp + '">'

    var saveBtn = document.getElementsByClassName('kui-button')[2];
    saveBtn.addEventListener('click', function() {
        var locationText = document.getElementById('kae-location-textarea').value;
        document.getElementsByClassName("location-text")[0].innerHTML = locationText;
        setTimeout(function() {
            var locationText = document.getElementById('kae-location-textarea').value;
            var tempData = {
                  userKey: KA._userProfileData.userKey,
                  userLocation: {
                        displayText: locationText
                  }
            };
            var req = new XMLHttpRequest();
            req.open("POST", "https://www.khanacademy.org/api/internal/user/profile");
            req.setRequestHeader('x-ka-fkey', getSession());
            req.setRequestHeader('content-type', "application/json");
            req.addEventListener("load", function() {
                location.reload();
            });
            req.send(JSON.stringify(tempData));
        }, 1000);
    });
    clearInterval(locElm);
}

/*** WIP? ***/
function evalFeatures() {
    clearInterval(addEvalFeatures);
    var container = document.getElementsByClassName('eval-container')[0];
    if(!container) return;
    var commentTextarea = document.getElementsByClassName('eval-left')[0].childNodes[5].lastElementChild.lastElementChild.firstElementChild;
    var replyButton = document.createElement('button');
    replyButton.innerText = "Auto Reply";
    replyButton.id = "kae-auto-reply";
    replyButton.className = "buttonStyle_1quqytj";
    replyButton.style.cssText = "margin-left: 2px; "
    replyButton.addEventListener('click', function() {

    });
    document.getElementsByClassName("edit-content-form__formatting-tips")[0].parentNode.insertBefore(replyButton, document.getElementsByClassName("edit-content-form__formatting-tips")[0]);
    document.getElementById('kae-auto-reply').parentNode.insertBefore(document.createElement('br'),document.getElementsByClassName('edit-content-form__formatting-tips')[0]);

    clearInterval(addEvalFeatures);
}

/*** Add a "Report" button under all programs, that sends a report directly to Guardians. ***/
function reportButton() {
    if(!programData.scratchpad) return;
    var userKaid = KAdefine.require("./javascript/shared-package/ka.js").getKaid();
    if (programData.scratchpad.kaid !== userKaid && !KA._userProfileData.isModerator) {
        var buttons = document.getElementsByClassName('discussion-meta-controls')[0];
        if (!buttons) { return; }

        var reportButton = document.createElement('a');
        reportButton.id = "kae-report-button";
        reportButton.href = "javascript:void(0)";
        reportButton.role = "button";
        reportButton.innerHTML = "<span>Report</span>";
        buttons.appendChild(reportButton);

        var backdrop = document.createElement('div');
        backdrop.id = "kae-backdrop";
        document.body.appendChild(backdrop);

        var reportPopup = document.createElement('div');
        reportPopup.id = "kae-report-popup";
        reportPopup.href = "javascript: void 0"
        reportPopup.innerHTML = `
            <a id='kae-exit-button' aria-label="Close">
              <svg role="img" aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 10 10">
                <path fill="currentColor" d="
                M6.26353762,4.99851587 L9.73097464,1.53107884 C10.0836373,1.17841618
                10.0842213,0.612127047 9.73530496,0.263210718 C9.38395604,-0.0881381913
                8.81874474,-0.0837668714 8.46743686,0.267541014 L4.99999981,3.73497806
                L1.5325628,0.267541051 C1.1812549,-0.0837668481 0.616043606,
                -0.0881381955 0.264694717,0.263210694 C-0.0842215912,0.612127004
                -0.0836375768,1.17841613 0.269025093,1.5310788 L3.73646206,4.9985158
                L0.269025109,8.46595276 C-0.083637537,8.81861541 -0.0842215923,
                9.38490462 0.264694642,9.73382106 C0.616043456,10.0851701 1.18125469,
                10.0807988 1.53256259,9.72949093 L4.99999988,6.26205363 L8.46743739,
                9.72949117 C8.8187453,10.0807991 9.38395655,10.0851704 9.73530537,
                9.73382138 C10.0842216,9.38490498 10.0836375,8.81861579 9.73097488,
                8.46595313 L6.26353762,4.99851587 Z">
                </path>
              </svg>
            </a>
            <div id="kae-report-wrap">
              <h2 id="kae-report-h2">Report for Guardian attention</h2>
            </div>
            <p>Instead of flagging, reporting will get official notice faster.</p>
            <iframe name="hidden_iframe" id="hidden_iframe" style="display:none;"></iframe>
            <!-- The form -->
            <form id="kae-reason" target="hidden_iframe" class="pure-form pure-form-stacked" action="https://script.google.com/macros/s/AKfycbzaurJVFjX18YbjlEy82OkvM98zbGO7AQriB8NtMW5fai3gFVCZ/exec"> <!-- ? action here-->
                <input id="honeypot" type="text" name="honeypot" style="display:none"/>
                <fieldset style="display: none">
                    <label>KAID</label>
                    <textarea id="kae-reporting-kaid" name="User">https://www.khanacademy.org/profile/${userKaid}</textarea>
                </fieldset>
                <fieldset style="display: none">
                    <label>Program</label>
                    <textarea id="kae-reporting-program" name="Program">${programData.scratchpad.url}</textarea>
                </fieldset>
                <fieldset class="pure-group">
                    <label>How does this violate our guidelines?</label>
                    <textarea id="kae-report-reason" name="Reason" maxlength="500" autocomplete="off"></textarea>
                </fieldset>
                <button id="kae-submit-button" type="submit" disabled>
                    <div>Submit Report</div>
                </button>
            </form>
            <div id="kae-thank-you">
              <h4>Thanks for reporting, a Guardian will review this program.</h4>
            </div>
        `;
        document.body.appendChild(reportPopup);

        var popup = document.getElementById('kae-report-popup');
        var report = document.getElementById('kae-report-button');
        var exit = document.getElementById('kae-exit-button');
        var submitEl = document.getElementById('kae-submit-button');

        report.addEventListener('click', function() {
            popup.style.display = 'block';
            backdrop.style.display = 'block';
        });
        exit.addEventListener('click', function() {
            popup.style.display = 'none';
            backdrop.style.display = 'none';
        });
        var checkSubmitInterval = setInterval(function() {
            var words = document.getElementById('kae-report-reason').value.split(' ').length;
            if (words > 5 && words < 150) {
                submitEl.style.backgroundColor = "rgb(113, 179, 7)";
                submitEl.style.cursor = "pointer";
                submitEl.disabled = false;
            } else {
                submitEl.style.backgroundColor = "rgb(186, 190, 194)";
                submitEl.style.cursor = "default";
                submitEl.disabled = true;
            }
        }, 250);

        function validateHuman(honeypot) {
            if (honeypot) {
                console.log("Robot Detected!");
                return true;
            } else {
                console.log("Welcome Human!");
            }
        }

        // Get all data in form and return object
        function getFormData() {
            console.log('getFormData() fired');
            var form = document.getElementById("kae-reason");
            var elements = form.elements;
            var fields = Object.keys(elements).map(function(k) {
                if (elements[k].name !== undefined) {
                    return elements[k].name;
                } else if (elements[k].length > 0) {
                    return elements[k].item(0).name;
                }
            }).filter(function(item, pos, self) {
                return self.indexOf(item) == pos && item;
            });
            var data = {};
            fields.forEach(function(k){
                data[k] = elements[k].value;
                var str = "";
                if (elements[k].length) {
                    for (var i = 0; i < elements[k].length; i++) {
                        if (elements[k].item(i).checked) {
                            str = str + elements[k].item(i).value + ", ";
                            data[k] = str.slice(0, -2);
                        }
                    }
                }
            });

            data.formDataNameOrder = JSON.stringify(fields);
            data.formGoogleSheetName = form.dataset.sheet || "Reports"; // default sheet name
            data.formGoogleSendEmail = form.dataset.email || ""; // no email by default

            console.log(data);
            return data;
        }

        function handleFormSubmit(event) {
            // Stop checking the text length.
            clearInterval(checkSubmitInterval);
            // data is returned from function.
            var data = getFormData();
            // This should check if user is bot or human.
            if (validateHuman(data.honeypot)) {
                return false;
            }
            // XML request.
            var url = event.target.action;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function() {
                if (xhr.status == 200) {

                    // This isn't working right

                    console.log(xhr.status, xhr.statusText);
                    console.log(xhr.responseText);
                    document.getElementById("kae-reason").style.display = "none";
                    document.getElementById("kae-thank-you").style.display = "block";
                    return;
                }
            };
            // url encode form data for sending as post data
            var encoded = Object.keys(data).map(function(k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
            }).join('&');
            xhr.send(encoded);
            event.preventDefault();
        }

        function loaded() {
            console.log('Report form submission handler loaded successfully');
            var kaeSubmitButton = document.getElementById('kae-submit-button');

            kaeSubmitButton.addEventListener("click", function(event) {
                handleFormSubmit(event);
                submitEl.style.backgroundColor = "rgb(186, 190, 194)";
                submitEl.style.cursor = "default";
                submitEl.disabled = true;
            }, false);
        };
        document.addEventListener('DOMContentLoaded', loaded, false);

    }
    clearInterval(addReportButton);
}

/*** Add custom thumbnails to programs, found in program settings. ***/
function addThumbnail(){
    var sel = document.getElementsByClassName("default_k9i44h");
    var test = document.getElementById("kae-img");
    if(sel.length < 1 || !programData.scratchpad || test) return;
    //clearInterval(thumbnailInt);
    console.log("runngin")
    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
              var reader = new FileReader();
              reader.onloadend = function() {
                    callback(reader.result);
              }
              reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    var modal = document.getElementsByClassName("modal_1lylzj-o_O-padded_ke4dn3")[0];
    var input = document.createElement('input');
    input.id = "kae-img";
    input.type = "text";
    input.style = "border-radius: 3px; border: 1px solid #ccc; padding: 8px; margin: 0 auto; display: block; width: 200px;"
    input.placeholder = "URL"
    modal.insertBefore(input, modal.childNodes[4]);

    var title = document.createElement("div");
    title.style = "margin-bottom: 4px"
    title.className = "kui-labeledfield__title";
    title.innerHTML = "Program Thumbnail";
    modal.insertBefore(title, input);

    var warning = document.createElement("p");
    warning.textContent = "Make sure your image is not too large, and served from an https site."
    modal.insertBefore(warning, modal.childNodes[6]);

    var submitButton = document.getElementsByClassName("base_1h2bej0-o_O-notDisabled_ro0g1e-o_O-base_6ln5u2-o_O-notTransparent_xz424u-o_O-notDisabled_85jsd4")[0];
    submitButton.addEventListener("click", function() {
        console.log("the button was pressed")
        var imgUrl = document.getElementById("kae-img").value;
        if (imgURL.length < 5) return;
        toDataURL(imgUrl, function(dataUrl) {
            var tempData = {
                userKey: KA._userProfileData.userKey,
                title: programData.scratchpad.title,
                revision: {
                    image_url: dataUrl,
                    code: programData.scratchpad.revision.code
                }
            };
            setTimeout(function() {
                var req = new XMLHttpRequest();
                req.open("PUT", "https://www.khanacademy.org/api/internal/scratchpads/" + programData.scratchpad.globalId.substring(1,17));
                req.setRequestHeader('x-ka-fkey', getSession());
                req.setRequestHeader('content-type', "application/json");
                req.send(JSON.stringify(tempData));
            }, 1000);
        });
    });
}


var deleted = [];
function deleteNotif() {
    var dropdown = document.getElementsByClassName("scrollDropdown_1jabbia")[0];
    if (!dropdown) return;
    var buttons = document.getElementsByClassName("kae-notif-delete");
    var notifList = document.getElementsByClassName("scrollDropdown_1jabbia")[0].childNodes[0].childNodes;
    if (buttons.length >= notifList.length) return;

    for (var i = 0; i < notifList.length; i++) {
        if(notifList[i].className.length > 0) continue;
        var notifElm = notifList[i].childNodes[0];
        if(notifElm === undefined || notifElm.childNodes.length >= 2) continue;
        var notifURL = notifElm.childNodes[0].href;
        if(deleted.indexOf(notifURL.match(/[?&]keys(=([^&#]*)|&|#|$)/)[2]) > -1){
            notifElm.parentNode.removeChild(notifElm);
            continue;
        }

        var linkElm = notifElm.childNodes[0];
        if(linkElm.className === "loadingSpinner_18tyv6y") continue;

        var deleteButton = document.createElement("span");
        deleteButton.className = "kae-notif-delete";
        deleteButton.style = "display: block; margin: 0; padding-left: 5px; padding-top: 5px;"
        deleteButton.innerHTML = `
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.9 21.9" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 21.9 21.9" width="10" height="10">
                  <path d="M14.1,11.3c-0.2-0.2-0.2-0.5,0-0.7l7.5-7.5c0.2-0.2,0.3-0.5,0.3-0.7s-0.1-0.5-0.3-0.7l-1.4-1.4C20,0.1,19.7,0,19.5,0  c-0.3,0-0.5,0.1-0.7,0.3l-7.5,7.5c-0.2,0.2-0.5,0.2-0.7,0L3.1,0.3C2.9,0.1,2.6,0,2.4,0S1.9,0.1,1.7,0.3L0.3,1.7C0.1,1.9,0,2.2,0,2.4  s0.1,0.5,0.3,0.7l7.5,7.5c0.2,0.2,0.2,0.5,0,0.7l-7.5,7.5C0.1,19,0,19.3,0,19.5s0.1,0.5,0.3,0.7l1.4,1.4c0.2,0.2,0.5,0.3,0.7,0.3  s0.5-0.1,0.7-0.3l7.5-7.5c0.2-0.2,0.5-0.2,0.7,0l7.5,7.5c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l1.4-1.4c0.2-0.2,0.3-0.5,0.3-0.7  s-0.1-0.5-0.3-0.7L14.1,11.3z"/>
                </svg>
        `
        deleteButton.addEventListener("click", function(){
            var href = this.parentNode.childNodes[1].href;
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

if (window.location.host === 'www.khanacademy.org') {
    var locElm = setInterval(locationElm, 250);
    var notifications = setInterval(updateNotifs, 50);
    var addEditUIInterval = setInterval(addCommentEditUI, 250);
    var addStopNotifOverflow = setInterval(stopNotifOverflow, 250);
    var deleteNotifs = setInterval(deleteNotif, 50);
    if (url[3] === 'computer-programming' || url[3] === 'hour-of-code') {
        darkTheme();
        var addDarkToggleButton = setInterval(darkToggleButton, 250);
        var thumbnailInt = setInterval(addThumbnail, 250);
        if(url[4] !== 'new') {
            var addFlags = setInterval(addFlagsToProgram, 250),
                getDates = setInterval(showProgramDates, 250),
                widenprogram = setInterval(widenProgram, 250),
                addguidelines = setInterval(addGuidelines, 250),
                addEvalFeatures = setInterval(evalFeatures, 250),
                addReportButton = setInterval(reportButton, 250);
        }
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
setInterval(function() {
  if(KA._userProfileData && typeof chrome !== "undefined"){
    chrome.runtime.sendMessage(chromeid, {
        "type": "notif",
        "fkey": getSession(),
        "kaid": kaid
    });
  }
}, 1000);

})();
