    if (window.location.host.includes("khanacademy.org")) {
        var locElm = setInterval(locationElm, 250);
        var addDuplicateBadges = setInterval(duplicateBadges, 100);
        var addEditUIInterval = setInterval(addCommentEditUI, 250);
        var deleteNotifs = setInterval(deleteNotif, 50);
        stopNotifOverflow();
        updateNotifs();
        if (computingUrls.includes(url[3])) {
            darkTheme();
            var addDarkToggleButton = setInterval(darkToggleButton, 250);
            if(url[4] !== "new") {
                addFlagsToProgram();
                var getDates = setInterval(showProgramDates, 250);
                evalFeatures();
                reportButton();
                widenProgram();
                addGuidelines();
                hideEditor();
            }
        } else if (url[3] === "profile") {
            centerPoints();
            var profileData = setInterval(getProfileData, 250);
            reportUserButton();
            if(url[5] == "discussion" && url[6] == "replies") {
                commentLinkGenerator = new CommentLinker(url[4] /* Username or kaid */);
                commentLinkGenerator.next();
                commentsButtonEventListener();
                var addCommentLinks = setInterval(commentLinks, 100);
            }
        } else if (url[5] === "browse") {
            var programFlags = setInterval(showProgramsFlags, 500);
        }
    }
})();
