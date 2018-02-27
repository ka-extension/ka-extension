/*** Add back the community guidelines next to dicussion under programs. ***/
function addGuidelines() {
    querySelectorPromise(".video-discussion")
        .then(v => {
            let g = document.getElementsByClassName("main-discussion-guidelines discussion-guidelines")[0],
                f = document.getElementsByClassName("footer_crtwg")[0];
            v.style.setProperty("float", "left");
            v.style.setProperty("margin", "0px");
            v.style.setProperty("width", "50%", "important");
            v.style.setProperty("display", "block")
            f.style.setProperty("max-width", "none", "important");
            g.style.setProperty("float", "right");
            g.style.setProperty("width", "25%");
            g.style.setProperty("display", "block");
            g.style.setProperty("margin-top", "0px");
        }).catch(console.error);
}