Meteor.methods({
    setUserData: function (userData) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(500, 'Error 500: Authorization needed', 'Authorization needed');
        }
        if (userData) {
            if (userData.userName) {
                Meteor.users.update(this.userId, {
                    $set: {
                        'userName': userData.username
                    }
                });
            }
            if (userData.email) {
                Meteor.users.update(this.userId,
                    {
                        $set: {'emails.0.address': userData.email}
                    });
            }
            if (userData.firstName) {
                Meteor.users.update(this.userId, {
                    $set: {
                        'profile.firstName': userData.firstName
                    }
                });
            }
            if (userData.lastName) {
                Meteor.users.update(this.userId, {
                    $set: {
                        'profile.lastName': userData.lastName
                    }
                });
            }
        }
    },
    votePost: function (postId) {
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error(500, 'Error 500: Authorization needed', 'Authorization needed');
        }
        //if we have vote to this post nothing to do
        var postWithVote = Posts.find({_id: postId, votes: userId}).fetch();
        if (postWithVote != 0) return;
        if (postId) {
            Posts.update({_id: postId},
                {
                    $push: {votes: userId}
                }
            )
        }
    },
    getImgUrl: function (userId) {
        var user = Meteor.users.findOne({_id: userId});
        if (user && user.emails) {
            return Gravatar.imageUrl(user.emails[0].address, {secure: true})
        }
    }
});
