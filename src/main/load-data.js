var computingUrls = ["computer-programming", "hour-of-code", "computer-science", "pixar"];
if(computingUrls.includes(url[3])) {
    let programId = url[5].substring(0, (url[5].includes("?") ? url[5].indexOf("?") : 16));
    getJSON(programUrl + programId, function(data) {
        console.log(data);
        Object.assign(programData, data);
    });
}

if(url[3] === "profile" && !url[5] || url.length < 5) {
    let username = url[4] || KA._userProfileData.username;
    let uparam = `?${(username.substr(0, 5) == "kaid_" ? "kaid" : "username")}=${username}`;
    getJSON(`${userProgramsApi}${uparam}&projection={%22scratchpads%22:[{%22sumVotesIncremented%22:1,%22spinoffCount%22:1}]}&limit=1500`, (data) => {
        console.log(data);
        Object.assign(userPrograms, data);
    });
    getJSON(userApi + uparam, (data) => {
        console.log(data);
        Object.assign(userInfo, data);
    });
}
