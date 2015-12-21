Template.posts.onCreated(function () {
    var self = this;
    self.autorun(function () {
        self.subscribe('posts', Router.current().route.getName());
    });
    Session.set('limitPosts', 5);
    Session.set('showComments', {});
});


Template.posts.events({
    'click .editButton': function (e) {
        var postId = this._id;
        //turn to inline mode
        $.fn.editable.defaults.mode = 'inline';
        $("#" + postId).editable({
            display: function (value, response) {
                return false;
            },
            success: function (response, newValue) {
                Posts.update({_id: postId}, {$set: {postText: newValue}}, showResult);
            }
        });
    },
    'click .removeButton': function (e) {
        var postId = this._id;
        var isAdmin = confirm("Are you sure want to delete post?");
        if (isAdmin) { Posts.remove({_id: postId});}
    },

    'click #addNewPost': function () {
        openPostDialog();
    },
    'click #showMoreButton': function () {
        var limit = Session.get('limitPosts');
        Session.set('limitPosts', limit + 4); //show more 4 posts

    }
});

Template.posts.helpers({
    posts: function () {
        var path = Router.current().route.getName(),
            count = Posts.find({}).count(),
            limit = Session.get('limitPosts');
        if (limit < count) {
            $("#showMoreButton").show()
        } else {
            $("#showMoreButton").hide()
        }
        // console.log(Router.current().route.getName() );
        var post = Posts.find({}, {limit: Session.get('limitPosts')}).fetch();
        if (path=='index') {
            post = Posts.find({}, {limit: Session.get('limitPosts'),sort: {createdAt: -1}}).fetch();
        } else if (path=='best') {
            post = Posts.find().fetch();
            post = post.sort(function(a, b) {
                if (a.votes && b.votes) {
                    return (a.votes.length - b.votes.length);
                } else if (a.votes){
                    return 1;
                } else {
                    return -1;
                }
            }).reverse().slice(0, Session.get('limitPosts'));
        }
        return post;
    }
});

Template.post.helpers({
    userName: function () {
        var user = Meteor.users.findOne(this.userId);
        if (user && user.username) {
            return "submitted by " + user.username
        }

    },
    isOwner: function () {
        return this.userId == Meteor.userId();
    },
    showComments: function () {
        var comments = Session.get('showComments'),
            postId = this._id;
        return comments[postId];
    },
    comments: function(){
        return Comments.find({postId:this._id});
    },
    qtyComments: function(){
        return Comments.find({postId:this._id}).count();
    },
    qtyVotes: function() {
        var post = Posts.findOne(this._id);
       if (post && post.votes) {
           return  post.votes.length;
       } else{
           return 0;
       }

    }

});

Template.post.events({
    'click .commentsButton': function () {
        if (!Meteor.userId()){
            toastr.info("Please! Create account to see comments.");
            return
        }
        var showedComments = Session.get('showComments');
        if (showedComments[this._id]) showedComments[this._id] = false;
        else showedComments[this._id] = true;
        Session.set('showComments', showedComments);
    },
    'click .submitComment': function (e) {
        var inputComment = $(e.target).closest('div.input-group').find('input.form-control').val();
        var postId = this._id;
        Comments.insert({
            postId: postId,
            commentText:inputComment
        },showResult)
    },
    'click .votesButton': function () {
        if (!Meteor.userId()){
            toastr.info("Please! Create account to vote.");
            return
        }
        Meteor.call('votePost', this._id);
    },
    'click .selectContainer':function (e){
        var postId =this._id;
        var selectedStatus = $('select[postId='+postId+']').val();
        Posts.update({_id: postId}, {$set: {status: selectedStatus}});
    }
});


Template.post.onRendered(function () {
    var status= this.data.status,
        postId =this.data._id;
    $('select[postId='+postId+']').val(status);
});


function openPostDialog() {

    var shareDialogInfo = {
        template: Template.AddPost,
        title: "Post",
        removeOnHide: true, //optional. If this is true, modal will be removed from DOM upon hiding
        buttons: {
            "cancel": {
                class: 'btn-danger',
                label: 'Cancel'
            },
            "ok": {
                closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
                class: 'btn-info',
                label: 'Save'
            }

        }
        //  doc: product
    };

    var rd = ReactiveModal.initDialog(shareDialogInfo);

    rd.buttons.ok.on('click', function () {
        // what needs to be done after click ok.
        var title = $("#inputTitle").val();
        var postText = $("#postNewText").val();
        Posts.insert({
            title: title,
            postText: postText
        }, showResult);
    });

    rd.show();
}

showResult = function (err) {
    if (err) {
        if (err.errorType == "Meteor.Error") toastr.error(JSON.stringify(err));
        else {
            toastr.error(err)
        }
    } else toastr.success("Success");
};