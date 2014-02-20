if (Meteor.isClient) {

  // Template.cardWall.cards_todo = function() {
  //   return Cards.find({status:"todo"}, {sort: {index: 1}});
  // }

  Template.navigation.events({
    'click #new_tab' : function() {
    	$("#new_tab").addClass("selected");    	
    	$("#activity").removeClass("selected");
    	$("#card_wall").removeClass("selected");    	
      	$(".page").hide();
      	$(".new-tab-page").fadeToggle(300);
    },
    'click #card_wall' : function() {
    	$("#activity").removeClass("selected");
    	$("#card_wall").addClass("selected");
    	$(".page").hide();
      	$(".card-wall").fadeToggle(300);	
    },
    'click #activity' : function() {
    	$("#new_tab").addClass("selected");    	
    	$("#card_wall").removeClass("selected");   
    	$("#activity").addClass("selected");
    	$(".page").hide();
      	$(".activity-page").fadeToggle(300);	
    }
  });

}
