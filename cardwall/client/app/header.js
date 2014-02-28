if (Meteor.isClient) {
  Template.cardcontent.card_title = function () {
  	if(Session.get("selected_card")) {
    	return Cards.findOne({"_id": Session.get("selected_card")}).title;
    }
  };
  Template.header.card_title = function () {
  	if(Session.get("selected_card")) {
    	return Cards.findOne({"_id": Session.get("selected_card")}).title;
    }
  };
  Template.header.new_card_tutorial = function () {
    if(Session.get("new_card_tut")==true) return true;
    else return false;
  };
  Template.header.new_card_tutorial_save = function () {
    if(Session.get("new_card_tut_save")==true) return true;
    else return false;
  };
  Template.header.new_card_tutorial_close = function () {
    if(Session.get("new_card_tut_close")==true) return true;
    else return false;
  };
  Template.header.project_name = function () {
    if(Session.get("project_name")) return Session.get("project_name");
    else return "Get Started Tutorial";
  };
  Template.header.tutorial_ended = function() {
    if(Session.get("tutorial_ended")==true) return true;
    else return false;
  };
  Template.header.tutorial_active = function() {
    if(Session.get("tutorial_ended")==true) return false;
    else return true;
  };
  Template.header.has_content = function () {
  	if(Session.get("selected_card")) {
  		var card = Cards.findOne({"_id": Session.get("selected_card")});
  		if (card) {
	      	$(".edit").hide();
	      	$(".view").show();
	    	return true;
  		}
    }
    else return false;
  };
  Template.cardcontent.card_content = function () {
  	if(Session.get("selected_card")) {
  		var card = Cards.findOne({"_id": Session.get("selected_card")});
    	return card.content;
    }
  };
  Template.header.card_content = function () {
  	if(Session.get("selected_card")) {
  		var card = Cards.findOne({"_id": Session.get("selected_card")});
    	return card.content;
    }
  };
  Template.header.is_editing = function () {
  	if(Session.get("editing")) {
    	return Session.get("editing");
    }
    else return false;
  };
  Template.header.not_editing = function () {
  	if(Session.get("editing")==true) {
    	return false;
    }
    else return true;
  };

  Template.header.events({
    'click .logo' : function() {
      Logs.insert({"action": "Click on logo", "user": Meteor.user()._id});
    },
    'click #end_tutorial' : function() {
      Session.set("joyride_active", false);
      $(".projects-dropdown").toggle(300);
    },
    'click #save_project_name' : function() {
      saveProjectName($("#new_project_name").val());
      endTheTutorial();
      $(".projects-dropdown").hide();
      $("#end_tutorial").hide();
      $("#project_list_toggle").fadeToggle(200);
    }
  });

  function endTheTutorial() {
    Cards.find({}).map(function(doc, index, cursor) {
      Cards.update({'_id':doc._id },{$set: {'status': 'done'}});
    });
    Meteor.users.update({'_id':Meteor.user()._id },{$set: {profile: {'tutorial_completed': true}}});

    Session.set("tutorial_ended", true);
    Logs.insert({"action": "Tutorial ended", "user": Meteor.user()._id});
  }

  function saveProjectName(newProjectName) {
    Session.set("project_name", newProjectName);
    var project = Projects.insert({"name":newProjectName, "owner": Meteor.user()._id});
    Meteor.users.update({'_id':Meteor.user()._id },{$set: {profile: {'default_project': project}}});
    Session.set("project_id", project);
    Session.set("feedback_time", true);
  }
}