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
                console.log(tips);
                tips.parentNode.removeChild(tips);
            });
            var textareas = document.getElementsByClassName('eval-text');
            console.log(textareas);
            
            var btn = document.createElement("button");
            btn.className = "buttonStyle_1quqytj";
            btn.type = "button";
            btn.innerText = "Generate Comment";
            btn.style = "border: 1px solid #ccc !important; margin-left: 1px !important;";
            btn.addEventListener('click', function(){
                var objectives = document.getElementsByClassName("eval-peer-rubric-item");
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
            list.appendChild(btn);
        }).catch(console.error);
    }).catch(console.error);
}