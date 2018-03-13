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
        let content = HTMLtoKAMarkdown(contentDiv.textContent).trim();
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
