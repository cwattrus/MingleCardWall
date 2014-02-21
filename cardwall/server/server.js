
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Accounts.onCreateUser(function(options, user) {
	  if (user)
	  	seedCards(user._id);
	  if (options.profile)
    	user.profile = options.profile;
  	  return user;
	});

  var movecard = "By dragging your card across the card wall you can change the status of the work your card represents.\
    \n \n \
  In this example your three status options are To Do, Doing, or Done.\
    \n \n \
  Close this card and drag it to **Done**.";

  var newcard = "Welcome to Mingle!\
    \n==============\
    \n \n \
  Cards represent small chunks of work that need to be completed.  The more specific the card, the better.\
    \n \n \
  Get started by closing this card and creating your own.";

  var powercard = "You're on your way to mastering Mingle!\
\n============================\
\n\n\
We believe there is a world of possibilities ahead of you... well, it's still in beta so more like 4 possibilities, but they're still pretty cool.\
\n\n\
\n\n\
Try clicking around a bit and be sure to check out the following:\
\n\n\
- **Add a card** of your own and change its status\n\
- Check out the other tabs like **Reports** and **Activity**\n\
- Take a look at what it would be like to manage your tabs by clicking the **+**\n\
- **Become a beta user!**";

  function seedCards(user_id) {
  	Cards.insert({title: "Click me first!!", content: newcard, owner: user_id, status: "todo", index:1});
  	Cards.insert({title: "Move this card to doing", content: movecard, owner: user_id, status: "todo", index:2});
  	Cards.insert({title: "Become a power user", content: powercard, owner: user_id, status: "todo", index:3});
  }


  Meteor.users.allow({
    update: function(userId, docs, fields, modifier) {
        return true;
    }
  });

  Meteor.methods({
    deleteCard: function (cardId) {
      Cards.remove({"_id":cardId});
    }
  });
}
