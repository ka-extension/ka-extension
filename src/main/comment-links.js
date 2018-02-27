function commentsButtonEventListener() {
    querySelectorPromise(".simple-button.discussion-list-more", 100)
        .then(button => button.addEventListener("click", () => (commentLinkGenerator != null && commentLinkGenerator.next()) ))
        .catch(console.error);
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