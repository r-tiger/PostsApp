//ROUTER CONFIGURATION file
Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function () {
    this.route('index', {path: '/'});
});


Router.onBeforeAction(function () {
    if (this.route.getName() === 'index' || this.route.getName() === 'best') {
        this.next();
        return;
    }
    var currUser = Meteor.user();
    if (currUser == null) {
        currUser = undefined;
    }

    if (!currUser) {
        this.redirect('index');
        this.next();
    }
    else {
        this.next();
    }
});

Router.map(function () {
    this.route('profile', {
        path: '/profile'
    });
    this.route('/posts/public', {
        name: 'public',
        path: '/posts/public',
        template: 'posts'
    });
    this.route('/posts/private', {
        name: 'private',
        path: '/posts/private',
        template: 'posts'
    });
    this.route('/posts/public/best', {
        name: 'best',
        path: '/posts/public/best',
        template: 'posts'
    });
});
