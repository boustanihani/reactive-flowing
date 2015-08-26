if (Meteor.isServer) {

    var testUser = Meteor.users.findOne({
        username: 'test'
    });

    console.log('testUser:', testUser);

    if (!testUser) Accounts.createUser({
        username: 'test',
        password: '123456'
    });
}

if (Meteor.isClient) {

    Template.layout1.events({
        'click #signIn': function() {
            Meteor.loginWithPassword('test', '123456');
        },
        'click #signOut': function() {
            Meteor.logout();
        },
    });

    Template.user.helpers({
        username: function() {
            return Meteor.user().username;
        }
    });

    var requireLogged = [
        '/user',
    ];

    Tracker.autorun(function() {

        FlowRouter.watchPathChange();

        var route = FlowRouter.current();

        if (!route.path) return;

        var section = '/' + route.path.split('/')[1];

        if (requireLogged.indexOf(section) != -1) {
            if (!Meteor.user()) var redirect = '/';
        }

        if (redirect) {
            console.log('Redirecting "' + section + '" to "' + redirect + '"');
            FlowRouter.go(redirect);
        }
    });

    FlowRouter.route('/', {
        action: function(params, queryParams) {
            BlazeLayout.render('layout1', {
                main: "home"
            });
        },
    });

    FlowRouter.route('/user', {
        action: function(params, queryParams) {
            BlazeLayout.render('layout1', {
                main: "user"
            });
        },
    });
}
