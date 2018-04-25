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
        getJSON("/api/internal/scratchpads/" + id, function(a, c) {
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
    objectNotEmptyTimer(programData).then(() => {
      querySelectorPromise(".discussion-meta-controls").then(flag => {
        if(programData.scratchpad.kaid === kaid || KA._userProfileData.isModerator) return;
        var programFlags = programData.scratchpad.flags;
        var flagButton = flag.childNodes[2];
        var reasons = programFlags.length > 0 ? programFlags.reduce((total, current) => total += `${current}\n`) : 'No flags here!';

        flagButton.textContent += ` • ${programFlags.length}`;
        flagButton.title = reasons;
      });
    });
}

/*** Hides editor **/
function hideEditor(){
  objectNotEmptyTimer(programData).then(() => {
    querySelectorPromise(".wrapScratchpad_1jkna7i").then((wrap) => {
        if(programData.scratchpad.userAuthoredContentType === "webpage") return;
        var LSeditorHide = `${extensionStoragePrefix}editor-hide`;
        var LSeditorHideVal = localStorage.getItem(LSeditorHide);
        var editorWrap = document.querySelector(".scratchpad-editor-wrap");
        if(localStorage.getItem(LSeditorHide) === null) localStorage.setItem(LSeditorHide, "false");
        if(LSeditorHideVal === "true"){
          editorWrap.classList.toggle("kae-hide");
          wrap.classList.toggle(`kae-hide-${programData.scratchpad.width.toString()}`);
        }

        var buttonDiv = document.createElement("div");
        buttonDiv.style.textAlign = "right";
        buttonDiv.style.float = "right";
        buttonDiv.style.marginBottom = "5px";
        var button = document.createElement("a");
        button.href = "javascript:void(0)";
        button.className = "link_1uvuyao-o_O-computing_1w8n1i8";
        button.style.width = "100px";
        button.style.align = "right";
        button.innerHTML = "Toggle Editor";
        button.addEventListener("click", () => {
          localStorage.setItem(LSeditorHide, (localStorage.getItem(LSeditorHide) === "false" ? "true" : "false"));
          editorWrap.classList.toggle("kae-hide");
          wrap.classList.toggle(`kae-hide-${programData.scratchpad.width.toString()}`);
        });
        buttonDiv.appendChild(button);
        wrap.parentNode.insertBefore(buttonDiv, wrap);
      }).catch(console.error);
  }).catch(console.error);
}

/***  Programs no longer have a max width. ***/
function widenProgram() {
    querySelectorPromise(".wrap_xyqcvi")
        .then(s => s.style.setProperty("max-width", "none", "important")).catch(console.error);
}
