class CommentLinker {
    constructor(uok) {
        this.uok = uok;
        this.commentLinks = {};
        this.topicIds = {};
        this.topicTypes = {};
        this.page = 0;
        this.commentNum = 0;
        this.limit = 10;
    }
    get(kaencrypted) {
        return this.commentLinks[kaencrypted];
    }
    getTopicId(kaencrypted) {
        return this.topicIds[kaencrypted];
    }
    getTopicType(kaencrypted) {
        return this.topicTypes[kaencrypted];
    }
    genURL(page, sort) {
        return `/api/internal/user/replies?casing=camel&${((this.uok.substr(0, 5) == "kaid_") ? "kaid" : "username")}=${this.uok}&sort=${sort}&subject=all&limit=${this.limit}&page=${page}&lang=en&_=${Date.now()}`;
    }
    next(success) {
        var that = this;
        var p = this.page++;
        getJSON(that.genURL(p, 1), function(data) {
            for(let i = 0; i < data.length; i++) {
                let comment = data[i];
                that.topicIds[comment.key] = comment.focus.id;
                that.topicTypes[comment.key] = comment.focus.kind;
                that.commentLinks[comment.key] = `${comment.focusUrl}?qa_expand_key=${comment.expandKey}`;
            }
            getJSON(that.genURL(p, 2), function(data) {
                for(let i = 0; i < data.length; i++) {
                    let comment = data[i];
                    that.topicIds[comment.key] = comment.focus.id;
                    that.topicTypes[comment.key] = comment.focus.kind;
                    that.commentLinks[comment.key] = `${comment.focusUrl}?qa_expand_key=${comment.expandKey}`;
                }
                if(typeof success == "function") { success(that.commentLinks); }
            });
        });
    }
}
