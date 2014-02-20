if (Meteor.isClient) {
  Template.navigation.events({
    'click #new_tab' : function() {
    	$("#new_tab").addClass("selected");
    	$("#activity").removeClass("selected");
    	$("#card_wall").removeClass("selected");
      	$(".page").hide();
      	$(".new-tab-page").fadeToggle(300);
      Logs.insert({"action": "Click new tab"});
    },
    'click #card_wall' : function() {
    	$("#activity").removeClass("selected");
    	$("#card_wall").addClass("selected");
    	$(".page").hide();
      	$(".card-wall").fadeToggle(300);
      Logs.insert({"action": "Click card wall tab"});
    },
    'click #activity' : function() {
    	$("#new_tab").addClass("selected");
    	$("#card_wall").removeClass("selected");
    	$("#activity").addClass("selected");
    	$(".page").hide();
      	$(".activity-page").fadeToggle(300);
      Logs.insert({"action": "Click activity tab"});
    },
    'click #reports' : function() {
      $("#new_tab").addClass("selected");
      $("#card_wall").removeClass("selected");
      $("#activity").addClass("selected");
      $(".page").hide();
        $(".activity-page").fadeToggle(300);
      Logs.insert({"action": "Click reports tab"});
    }
  });

}
