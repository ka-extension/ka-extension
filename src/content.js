console.log("content.js fired");
(function(document, tag) {
    var scriptTag = document.createElement(tag), // Create a script tag
        firstScriptTag = document.getElementsByTagName(tag)[0]; // Find the first script tag in the document
    scriptTag.src = chrome.extension.getURL("./build/src.js"); // Set the source of the script to your script
    firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag); // Append the script to the DOM
}(document, "script"));
/* To override KA's !important styles */
var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('general.css');
(document.head || document.documentElement).appendChild(style);
