

Template.comment.helpers({
    imgUrlGravatar: function(){
        return ReactiveMethod.call("getImgUrl", this.userId);
    },
    dateCreation:function(){
        return new Date(this.createdAt);
    },
    userName:function(){
        var user = Meteor.users.findOne(this.userId);
        if (user && user.username) {
            return user.username
        }
    }
});

