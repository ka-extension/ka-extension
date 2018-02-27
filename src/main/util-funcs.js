function getSession() {
    return /fkey=(.*?);/ig.exec(document.cookie)[1];
}

function getJSON(url, success) {
    var t = new XMLHttpRequest();
    t.open("GET", url, !0);
    t.responseType = "json";
    t.setRequestHeader("X-KA-FKey", getSession());
    t.addEventListener("load", function() {
        if(t.readyState === t.DONE) { success(t.response); }
    });
    t.send();
}

function buildQuery(params) {
    let ret = "", v = 0;
    for(let i in params)
        ret += `${encodeURIComponent(i)}=${encodeURIComponent(params[i] + "") + (v++ != Object.keys(params).length - 1 ? "&" : "")}`;
    return ret;
}

function newDate(date) {
    var d = new Date(date);
    return `${("0" + (d.getMonth() + 1)).slice(-2)}/${("0" + d.getDate()).slice(-2)}/${d.getFullYear()} ${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}`;
}

function HTMLtoKAMarkdown(html) {
    return html
        .replace(/<pre>\s*<code>([.\s\S]*?)<\/code>\s*<\/pre>/ig, function(match, one) { return "```\n" + one + "\n```"; })
        .replace(/<code>(.*?)<\/code>/ig, function(match, one) { return "`" + one + "`"; })
        .replace(/<b>(.*?)<\/b>/ig, function(match, one) { return `*${one}*`; })
        .replace(/<em>(.*?)<\/em>/ig, function(match, one) { return `_${one}_`; })
        .replace(/<a.*?>(.*?)<\/a>/ig, function(match, one) { return one; })
        .replace(/<br(?:\s*\/\s*)?>/ig, function() { return "\n"; })
}
function KAMarkdowntoHTML(markdown) {
    return markdown
        .replace(/\`\`\`\s*([.\s\S]*?)\s*\`\`\`/ig, function(match, one) { return "<pre><code>" + one + "</code></pre>"; })
        .replace(/\`(.+?)\`/ig, function(match, one) { return `<code>${one}</code>`; })
        .replace(/\*(.+?)\*/ig, function(match, one) { return `<b>${one}</b>`; })
        .replace(/_(.+?)_/ig, function(match, one) { return `<em>${one}</em>`; })
        .replace(/\n/ig, function() { return "<br>"; })
}
