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

/*** Add a "Report" button under all programs, that sends a report directly to Guardians. ***/
function reportButton() {
    let programDataNotEmpty = objectNotEmptyTimer(programData);
    programDataNotEmpty.then(data => {
        let scratchpad = data.scratchpad;
        if (scratchpad && scratchpad.kaid !== kaid && (!KA._userProfileData || !KA._userProfileData.isModerator)) {
            querySelectorPromise(".buttons_vponqv")
                .then(buttons => {
                    let reportButton = document.createElement("a");
                    reportButton.id = "kae-report-button";
                    reportButton.href = `${queueRoot}submit?${buildQuery({
                        type: "program",
                        id: data.scratchpad.id,
                        callback: window.location.href
                    })}`;
                    reportButton.role = "button";
                    reportButton.innerHTML = "<span>Report</span>";
                    buttons.insertBefore(reportButton, buttons.children[1]);
                }).catch(console.error);
        }
    }).catch(console.error);
}

/*** Add custom thumbnails to programs, found in program settings. ***/
function addThumbnail(){
    var sel = document.getElementsByClassName("default_k9i44h");
    var test = document.getElementById("kae-img");
    if(sel.length < 1 || !programData.scratchpad || test) return;

    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
              var reader = new FileReader();
              reader.onloadend = function() {
                    callback(reader.result);
              }
              reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    }

    var modal = document.getElementsByClassName("modal_1lylzj-o_O-padded_ke4dn3")[0];
    var input = document.createElement("input");
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
                req.setRequestHeader("X-KA-FKey", getSession());
                req.setRequestHeader("Content-type", "application/json");
                req.send(JSON.stringify(tempData));
            }, 1000);
        });
    });
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
                programLinks[a].nextSibling.nextSibling.innerHTML += " \u00b7 <span title=\"" + result[a].flags.join("\n") + "\">" + result[a].flags.length + " Flag" + (1 === result[a].flags.length ? "" : "s");
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

    date.nextElementSibling.innerHTML += "<br>Created: " + createdDate;
    date.nextElementSibling.innerHTML += "<br>Last updated: " + updatedDate;
    date.nextElementSibling.innerHTML += (programData.scratchpad.kaid === kaid ? ("<br><span title=\"" + programData.scratchpad.flags.join("\n") + "\">Flags: " + myFlags) + "</span>" : "")
    date.nextElementSibling.innerHTML += (programData.scratchpad.hideFromHotlist ? "<br><span style=\"color:#af2f18\">This program is hidden from the hotlist.</span>" : "<br><span style=\"color:#18af18\">This program is not hidden from the hotlist.</span>");
    clearInterval(getDates);
}

/*** When viewing a program, it shows how many flags the program has. ***/
function addFlagsToProgram() {
    if(!programData.scratchpad) return;
    var title = document.getElementsByClassName("editTitle_swrcbw");
    var flag = document.getElementsByClassName("discussion-meta-controls");
    if (programData.scratchpad.kaid !== kaid && !KA._userProfileData.isModerator) {
        var programFlags = programData.scratchpad.flags;

        if(flag.length < 1 && title.length < 1) { return; }

        try {
            var flagString = " • " + programData.scratchpad.flags.length;
            flag[0].childNodes[2].innerHTML += flagString;

            if (flag[0].childNodes[2].className === "link_1uvuyao-o_O-computing_77ub1h-o_O-disabled_2gos5") {
                flag[0].childNodes[2].className = "link_1uvuyao-o_O-computing_77ub1h";
            }
        } catch(flag) {
            console.log("Flag is not defined.");
            return;
        }

        // Hover over flag button to show flag reasons.
        var flagBtn = document.getElementsByClassName("link_1uvuyao-o_O-computing_77ub1h")[0];
        var reasons = "";
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

/***  Programs no longer have a max width. ***/
function widenProgram() {
    querySelectorPromise(".wrap_xyqcvi")
        .then(s => s.style.setProperty("max-width", "none", "important")).catch(console.error);
}
