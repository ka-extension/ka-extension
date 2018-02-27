const comments = {
    plagiarism: "Your program appears to have some similarities to another, check above for more information on that.",
    passed: "Your program passed! Great work on this.",
    needsWork: "Your program has a few errors in it, check above for more information on that."
};

function evalFeatures() {
    let projectInfoNotEmpty = objectNotEmptyTimer(programData);
    projectInfoNotEmpty.then(projectData => {
        querySelectorPromise(".eval-left > ul").then(list => {
            querySelectorPromise('.edit-content-form__left').then(tips => {
                tips.parentNode.removeChild(tips);
            }).catch(console.error);
            var textareas = document.getElementsByClassName('eval-text');
            var objectives = document.getElementsByClassName("eval-peer-rubric-item");

            var commentBtn = document.createElement("button");
            commentBtn.className = "buttonStyle_1quqytj";
            commentBtn.type = "button";
            commentBtn.innerText = "Generate comment";
            commentBtn.style = "border: 1px solid #ccc !important; margin-left: 1px !important;";
            commentBtn.addEventListener('click', function(){
                if(document.querySelectorAll(".nopass,.pass").length < objectives.length) return;
                var evalCommentTextarea = textareas[textareas.length - 1];
                var evalCommentText = "Hey there,\n\n";
                var addition;
                var nopass = document.getElementsByClassName("nopass");
                if(objectives[objectives.length - 1].childNodes[0].className === "nopass"){
                    addition = comments.plagiarism;
                }
                else if(nopass.length < 1){
                    addition = comments.passed;
                }
                else{
                    addition = comments.needsWork;
                }
                evalCommentText += addition;
                evalCommentTextarea.value = evalCommentText;
            });

            var checkBtn = document.createElement("button");
            checkBtn.className = "buttonStyle_1quqytj";
            checkBtn.type = "button";
            checkBtn.innerText = "Check all";
            checkBtn.style = "border: 1px solid #ccc !important; margin-left: 2px !important; border-radius: 1px !important;";
            checkBtn.addEventListener("click", function(){
              for(let objective of objectives){
                if(objective.querySelector("i").className === "pass") continue;
                objective.querySelector(".buttonStyle_1quqytj").click();
              }
            });

            list.appendChild(commentBtn);
            list.appendChild(checkBtn);
        }).catch(console.error);
    }).catch(console.error);
}
