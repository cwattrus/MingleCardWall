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
  // Template.header.active_card = function () {
  //   if(Session.get("selected_card")) return true;
  //   else return false;
  // };
}