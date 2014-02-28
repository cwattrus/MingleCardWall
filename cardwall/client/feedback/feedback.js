if (Meteor.isClient) {
  Template.feedback.feedbacktime = function () {
  	return Session.get("feedback_time");
  };

  Template.feedback.events({
    'click .exit-feedback' : function() {
      Session.set("feedback_time", false);
      Logs.insert({"action": "Close feedback", "user": Meteor.user()._id});
    },
  });
}
