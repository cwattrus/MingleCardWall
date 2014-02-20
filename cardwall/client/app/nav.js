if (Meteor.isClient) {
  Template.navigation.events({
    'click #new_tab' : function() {
    	$("#new_tab").addClass("selected");
    	$("#activity").removeClass("selected");
      $("#reports").removeClass("selected");
    	$("#card_wall").removeClass("selected");
      	$(".page").hide();
      	$(".new-tab-page").fadeToggle(300);
      Logs.insert({"action": "Click new tab", "user": Meteor.user()._id});
    },
    'click #card_wall' : function() {
      $("#new_tab").removeClass("selected");
    	$("#activity").removeClass("selected");
      $("#reports").removeClass("selected");
    	$("#card_wall").addClass("selected");
    	$(".page").hide();
      	$(".card-wall").fadeToggle(300);
      Logs.insert({"action": "Click card wall tab", "user": Meteor.user()._id});
    },
    'click #activity' : function() {
    	$("#new_tab").removeClass("selected");
    	$("#card_wall").removeClass("selected");
      $("#reports").removeClass("selected");
    	$("#activity").addClass("selected");
    	$(".page").hide();
      	$(".activity-page").fadeToggle(300);
      Logs.insert({"action": "Click activity tab", "user": Meteor.user()._id});
    },
    'click #reports' : function() {
      $("#new_tab").removeClass("selected");
      $("#card_wall").removeClass("selected");
      $("#activity").removeClass("selected");
      $("#reports").addClass("selected");
      $(".page").hide();
        $(".reports-page").fadeToggle(300);
      Logs.insert({"action": "Click reports tab", "user": Meteor.user()._id});
    }
  });

}
