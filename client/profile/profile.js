
Template.profile.helpers({
    imgUrlGravatar: function(){
        var currentUser = Meteor.user();
        if (currentUser && currentUser.emails) {
            return Gravatar.imageUrl(currentUser.emails[0].address, {secure: true})
        }
    },
    currentUser:function(){
        var currentUser = Meteor.user();
        if(currentUser) return currentUser;
    }
});

Template.profile.events({
    'click #save':function(){
        var user={};
        var userName = $('#userName').val();
        var email = $('#email').val();
        var firstName = $('#firstName').val();
        var lastName = $('#lastName').val();

        if(userName) user.userName=userName;
        if(email) user.email=email;
        if(firstName) user.firstName=firstName;
        if(lastName) user.lastName=lastName;
        Meteor.call("setUserData", user, function (err) {
            if (!err) {
                toastr.success("Success");
            } else {
                toastr.error(JSON.stringify(err))
            }
        })
    }
});

