function endpointURL(endpoint) {
    return window.location.origin + endpoint;
}

function getSession() {
    return /fkey=(.*?);/ig.exec(document.cookie)[1];
}

function getJSON(endpoint, success) {
    var t = new XMLHttpRequest();
    t.open("GET", endpoint, !0);
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
        .replace(/<pre>\s*<code>([.\s\S]*?)<\/code>\s*<\/pre>/ig, (match, one) =>  "```\n" + one + "\n```")
        .replace(/<code>(.*?)<\/code>/ig, (match, one) => "`" + one + "`")
        .replace(/<b>(.*?)<\/b>/ig, (match, one) => `*${one}*`)
        .replace(/<em>(.*?)<\/em>/ig, (match, one) => `_${one}_`)
        .replace(/<a.*?>(.*?)<\/a>/ig, (match, one) => one)
        .replace(/<br(?:\s*\/\s*)?>/ig, () => `\n`);
}
function KAMarkdowntoHTML(markdown) {
    return markdown
        .replace(/\`\`\`\s*([.\s\S]*?)\s*\`\`\`/ig, (match, one) => `<pre><code>${one}</code></pre>`)
        .replace(/\`(.+?)\`/ig, (match, one) => `<code>${one}</code>`)
        .replace(/\*(.+?)\*/ig, (match, one) => `<b>${one}</b>`)
        .replace(/_(.+?)_/ig, (match, one) => `<em>${one}</em>`)
        .replace(/\n/ig, () => `<br>`);
}
