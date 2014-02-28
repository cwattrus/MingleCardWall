Meteor.subscribe("cards");
Meteor.subscribe("status");
Meteor.subscribe("projects");

if (Meteor.isClient) {
  Template.joyride.start = function () {
  	return Session.get("joyride_active");
  };

  Template.joyride.events({
    'click .exit-joyride' : function() {
      Session.set("joyride_active", false);
      Logs.insert({"action": "Close joyride", "user": Meteor.user()._id});
    },
  });
}
