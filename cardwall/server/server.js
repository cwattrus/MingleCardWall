
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

  function seedCards(user_id) {
  	Cards.insert({title: "Add your first card", content: "Click the 'New Card' button above to add a new card", owner: user_id, status: "todo", index:1});
  	Cards.insert({title: "Move this card to doing", content: "Drag the card from the todo column to the doing column", owner: user_id, status: "todo", index:2});
  	Cards.insert({title: "Become a power user", content: "Watch this to learn about Mingle", owner: user_id, status: "todo", index:3});
  }


  Meteor.users.allow({
    update: function(userId, docs, fields, modifier) {
        return true;
    }
  });

}
