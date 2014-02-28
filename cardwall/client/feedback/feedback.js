if (Meteor.isClient) {
  Template.feedback.feedbacktime = function () {
  	return Session.get("feedback_time");
  };
  Template.feedback.feeling = function() {
  	return Session.get("feeling");
  }

  Template.feedback.events({
    'click .exit-feedback' : function() {
      Session.set("feedback_time", false);
      Logs.insert({"action": "Close feedback", "user": Meteor.user()._id});
    },
    'click #save_feedback' : function() {
    	Logs.insert({"action": "Feedback", "user" : Meteor.user()._id, "text" : $("#feedback_text").val(), "feeling" : Session.get("feeling") });
      	Session.set("feedback_time", false);
    },
    'click #meh' : function() {
		Session.set("feeling", "meh");
   	},
   	'click #never' : function() {
		Session.set("feeling", "never");
   	},
   	'click #amped' : function() {
    	Session.set("feeling", "amped");
   	},
   	'click #dreaming' : function() {
    	Session.set("feeling", "dreaming");
   	},
  });
}
