Schemas = function(){};

Schemas.Posts = new SimpleSchema({
    title: {
        type: String,
        label: 'Post Title',
        optional: true
    },
    postText: {
        type: String,
        label: 'Post Text'
    },
    status:{
      type: String,
      label: "Status",
      optional: true
    },
    votes:{
        type: [String],
        label: "Votes",
        optional: true
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();
            }
        }
    }
});


Schemas.Comments = new SimpleSchema({
    postId:{
        type: String,
        label: 'Post Id'
    },
    commentText: {
        type: String,
        label: 'Post Text'
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();
            }
        }
    }
});