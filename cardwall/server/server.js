
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

  var movecard = "##You're a ninja!\
      Now that you know your way around the card wall, take a look around.\
       \n \
      **Things to explore**\
       \n \
      1.    The projects list\
      1.    Adding markdown content\
      1.    Reports\
      1.    Activity\
      1.    Adding a tab[Thanks](/thanks.png)"

  function seedCards(user_id) {
  	Cards.insert({title: "Add your first card", content: "Click the 'New Card' button above to add a new card", owner: user_id, status: "todo", index:1});
  	Cards.insert({title: "Move this card to doing", content: movecard, owner: user_id, status: "todo", index:2});
  	Cards.insert({title: "Become a power user", content: "Watch this to learn about Mingle", owner: user_id, status: "todo", index:3});
  }


  Meteor.users.allow({
    update: function(userId, docs, fields, modifier) {
        return true;
    }
  });

}
