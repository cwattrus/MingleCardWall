if (Meteor.isClient) {


  Template.cardWall.rendered = function() {
    $(".mini-card").draggable({
      snap: '.card-column',
      appendTo: 'parent',
      helper: 'clone'
    });

    $(".card-column").droppable({
      drop: handleDrop,
      dropactivate: handleDropActivate,
    });

    $(".card-column").on("dropactivate", handleDropActivate);

    $(document).ready(function (){
      moveFirstCard();
    });
  }

  function moveFirstCard() {
    if((Meteor.user()!=null)||(Meteor.user()!=undefined)) {
      if(($(".ring")[0]==undefined)&&(Meteor.user().profile.first_login)) {
        if($('div:contains("Click me ")')[2]!=undefined) {
          var card_id = $('div:contains("Click me ")')[2].getAttribute('id');
          Cards.update({'_id':card_id },{$set: {'status': 'doing', pulse: true}});
          return card_id;
        }
      }
    }
    return false;
  }

  function handleDropActivate(event, ui) {
    ui.draggable.css({"border-style": "dashed", "border-left-style": "solid"});
  }

    function handleDrop(event, ui) {
      var draggable = ui.draggable;
      var todoDrop = $(this).hasClass("todo");
      var doingDrop = $(this).hasClass("doing");
      var doneDrop = $(this).hasClass("done");

      if (doingDrop) {
        Cards.update({'_id':draggable.attr('id') },{$set: {'status': 'doing'}});

        if(Session.get("drag_tutorial_start")==true) {
          Session.set("drag_tutorial_start", false);
          if(draggable.attr('id')==$('div:contains("Move this ")')[2].getAttribute('id')) {
            Session.set("selected_card",draggable.attr('id'));
            Meteor.users.update({'_id':Meteor.user()._id.toString() },{$set: {profile: {'first_login': false}}});
          }
          return true;
        }
        Logs.insert({"action": "Card dropped in doing", "user": Meteor.user()._id, "object": draggable.attr('id')});
      }
      else if(todoDrop) {
        Cards.update({'_id':draggable.attr('id') },{$set: {'status': 'todo'}});
        Logs.insert({"action": "Card dropped in todo", "user": Meteor.user()._id, "object": draggable.attr('id')});
      }
      else {
        Cards.update({'_id':draggable.attr('id') },{$set: {'status': 'done'}});
        Logs.insert({"action": "Card dropped in done", "user": Meteor.user()._id, "object": draggable.attr('id')});
        if(draggable.attr('id')==$('div:contains("Move this ")')[2].getAttribute('id')) {
          console.log("Initiating all powerful step 1");
          Session.set("power_tutorial_start", true);
        }
      }
    }

  Meteor.subscribe("cards");

  Template.cardWall.cards_todo = function() {
    return Cards.find({status:"todo"}, {sort: {index: 1}});
  }
  Template.cardWall.cards_doing = function() {
    return Cards.find({status:"doing"});
  }
  Template.cardWall.cards_done = function() {
    return Cards.find({status:"done"});
  }
  Template.cardWall.pulse = function() {
    if(Session.get("click_tut_off")==true) return false;
    else if(this.pulse==true) return true;
    else return false;
  }
  Template.cardWall.drag_pulse = function() {
    if(Session.get("drag_tutorial_start")==true) {
      if($('div:contains("Move this ")')[2]!= undefined) {
        if(this._id==$('div:contains("Move this ")')[2].getAttribute("id")) {
          return true;
        }
      }
    }
    else return false;
  }
  Template.cardWall.drag_pulse_second = function() {
    if(Session.get("drag_tutorial_start")==true) {
      if($('div:contains("Move this ")')[5]!= undefined) {
        if(this._id==$('div:contains("Move this ")')[5].getAttribute("id")) {
          return true;
        }
      }
    }
    else return false;
  }
  Template.cardWall.power_pulse = function() {
    if(Session.get("power_tutorial_start")==true) {
      if($('div:contains("Become a power ")')[2]!= undefined) {
        if(this._id==$('div:contains("Become a power ")')[2].getAttribute('id')) return true;
      }
    }
    else return false;
  }

  Template.header.events({
    'click #new_card' : function () {
      $(".card-title").val("");
      $(".card-content").val("");
      var newCard = Cards.insert({title: "My new card", content: "A world of possibilities...", owner: Meteor.userId(), status: "todo"});
      Session.set("selected_card", newCard);
      Session.set("editing", true);
      if(Session.get("new_card_tut")==true){
        Session.set("new_card_tut", false);
        Session.set("new_card_tut_save", true);
      }
      Logs.insert({"action": "Card created", "user": Meteor.user()._id, "object": newCard});
    },
    'click .lightbox' : function(event) {
      event.stopPropagation();
    },
    'click .overlay' : function () {
      if(Session.get("selected_card")==undefined) Logs.insert({"action": "Card lightbox closed", "user": Meteor.user()._id});
      else Logs.insert({"action": "Card lightbox closed", "user": Meteor.user()._id, "object": Session.get("selected_card")});

      Session.set("selected_card", null);
      Session.set("editing", false);
      if(Meteor.user().profile.first_login) {
        if(Session.get("new_card_tut")==undefined) Session.set("new_card_tut", true);
        else {
          var card_id = $('div:contains("Click me ")')[2].getAttribute('id');
          if(card_id) Cards.update({'_id':card_id },{$set: {'status': 'done'}});
          Session.set("drag_tutorial_start", true);
        }
      };
    },
    'click #save_card' : function() {
      var card_title = $(".card-title").val();
      var card_content = $(".card-content").val();
      if(Session.get("selected_card")) {
        Cards.update({ _id:Session.get("selected_card")} , { $set: {title: card_title, content: card_content}});
        Logs.insert({"action": "Card updated", "user": Meteor.user()._id, "object": Session.get("selected_card")});        
      }
      else {
        var newCard = Cards.insert({title: card_title, content: card_content, owner: Meteor.userId(), status: "todo"});
        Session.set("selected_card", newCard);
        Logs.insert({"action": "Card created", "user": Meteor.user()._id, "object": Session.get("selected_card")});
      }
      Session.set("editing", false);
      if(Session.get("new_card_tut_save")==true){
        Session.set("new_card_tut_save", false);
        Session.set("new_card_tut_close", true);
        Session.set("new_card_tut", false);
      }
    },
    'click .dropdown' : function() {
      $(".projects-dropdown").toggle(100);
      Logs.insert({"action": "Click projects dropdown", "user": Meteor.user()._id});
    },
    'click #edit_card' : function() {
      if(Session.get("selected_card")) {
        Session.set("editing", true);
        Logs.insert({"action": "Card edit mode activated", "user": Meteor.user()._id, "object": Session.get("selected_card")});
      }
    },
    'click #close_card' : function() {
      if(Session.get("selected_card")==undefined) Logs.insert({"action": "Card lightbox closed", "user": Meteor.user()._id});
      else Logs.insert({"action": "Card lightbox closed", "user": Meteor.user()._id, "object": Session.get("selected_card")});

      $(".card-title").val("");
      $(".card-content").val("");
      if($('div:contains("Move this card ")')[5]!=null) {
        if(Session.get("selected_card")==$('div:contains("Move this card ")')[5].getAttribute('id')) Session.set("drag_tutorial_start", true);
      }
      Session.set("selected_card", null);
      if(Meteor.user().profile.first_login) {
        if(Session.get("new_card_tut")==undefined) Session.set("new_card_tut", true);
        else {
          Session.set("new_card_tut_close", false);

          var card_id = $('div:contains("Click me ")')[2].getAttribute('id');
          if(card_id) Cards.update({'_id':card_id },{$set: {'status': 'done'}});
          Session.set("drag_tutorial_start", true);
        }
      }
    }
  });

  Template.cardWall.events({
    'click .mini-card' : function() {
      Session.set("selected_card", this._id);
      Session.set("click_tut_off", true);
      if($('.ring')[0]) var card_id = $('.ring')[0].parentNode.getAttribute('id');
      if(card_id) Cards.update({'_id':card_id },{$set: {pulse: false}});
      Logs.insert({"action": "Card opened via mini card", "user": Meteor.user()._id, "object": Session.get("selected_card")});

    },

  });

  function focusOnNewCard() {
      $("#new_card").append("<div class='ring'></div>");
    }

    function turnOffWalkThrough() {
      Meteor.users.update({'_id':Meteor.user()._id.toString() },{$set: {profile: {'first_login': false}}});
    }

    function isWalkThrough() {
      if(Meteor.user().profile.first_login) return true;
      else return false;
    }
}
