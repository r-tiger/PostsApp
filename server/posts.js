Posts.allow({
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


Posts.before.insert(function (userId, doc) {
    doc.userId = userId;
    doc.status = "public";
    doc.createdAt = Date.now();
});

//remove post comments after delete
Posts.after.remove(function (userId, doc) {
    var comments = Comments.find({postId: doc._id}).fetch();
    for (var i = 0; i < comments.length; i++) {
        Comments.remove({_id: comments[i]._id});
    }
});