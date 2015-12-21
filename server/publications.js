Meteor.publish("posts", function (page) {
    var comments = Comments.find();
    var posts=[];
    if (page == "index" || page == 'best'){
        posts=Posts.find({status:'public'})
    }
    if (page == "public"){
        posts=Posts.find({userId:this.userId,status:'public'})
    }
    if (page == "private"){
        posts=Posts.find({userId:this.userId,status:'private'})
    }

    return [posts, Meteor.users.find({}, {fields: { username: 1}}), comments];
});
