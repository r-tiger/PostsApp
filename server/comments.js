Comments.allow({
    insert: function (userId, doc) {
        return userId;
    },
    update: function (userId, doc, fields, modifier) {
        // can only change your own documents
        return doc.userId === userId;
    },
    remove: function (userId, doc) {
        // can only remove your own documents
        return doc.userId === userId;
    }
});


Comments.before.insert(function (userId, doc) {
    doc.userId =userId;
    doc.createdAt = Date.now();
});
