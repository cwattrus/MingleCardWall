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
      if(Meteor.user().profile.completed_tutorial==true) {
        console.log(Meteor.user().profile.tutorial_completed);
        Session.set("tutorial_ended", true);
      }
      if(Meteor.user().profile.first_login) {
        Session.set("feedback_time", false);
      }
      if(Meteor.user().profile.default_project) {
        Session.set("project_id", Meteor.user().profile.default_project);
      }

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
        if($('div:contains("Move this ")')[2]!=undefined) {
          if(draggable.attr('id')==$('div:contains("Move this ")')[2].getAttribute('id')) {
            Session.set("selected_card",draggable.attr('id'));
            Cards.update({'_id':draggable.attr('id') },{$set: {'title': 'Move this card to done'}});
          }
        }
        return true;
      }
      Logs.insert({"action": "Card dropped in doing", "user": Meteor.user()._id, "object": draggable.attr('id')});
    }
    else if(todoDrop) {
      Cards.update({'_id':draggable.attr('id') },{$set: {'status': 'todo'}});
      Logs.insert({"action": "Card dropped in todo", "user": Meteor.user()._id, "object": draggable.attr('id')});
    }
    else if(doneDrop){
      Cards.update({'_id':draggable.attr('id') },{$set: {'status': 'done'}});
      Logs.insert({"action": "Card dropped in done", "user": Meteor.user()._id, "object": draggable.attr('id')});
      if($('div:contains("Move this ")')[2]!=undefined) {
        if(draggable.attr('id')==$('div:contains("Move this ")')[2].getAttribute('id')) {
          console.log("Initiating all powerful step 1");
          Session.set("joyride_active", true);
        }
      }
    }
    else {
      if(Status.findOne({"_id":this.getAttribute("id")})) {
        Cards.update({'_id':draggable.attr('id') },{$set: {'status': this.getAttribute("id")}});
      }
    }
  }

  Template.cardWall.columns = function() {
    return Status.find({});
  }
  Template.cardWall.cards = function() {
    return Cards.find({"status": this._id, "projects": Session.get("project_id")});
  }
  Template.cardWall.cards_todo = function() {
    if(Session.get("project_id")) return Cards.find({status:"todo", "projects": Session.get("project_id")}, {sort: {index: 1}});
    else return Cards.find({status:"todo"}, {sort: {index: 1}});
  }
  Template.cardWall.cards_doing = function() {
    if(Session.get("project_id")) return Cards.find({status:"doing", "projects": Session.get("project_id")});
    else return Cards.find({status:"doing"}, {sort: {index: 1}});
  }
  Template.cardWall.cards_done = function() {
    if(Session.get("project_id")) return Cards.find({status:"done", "projects": Session.get("project_id")});
    else return Cards.find({status:"done"}, {sort: {index: 1}});
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
      createNewCard("todo", Session.get("project_id"));
      if(Session.get("new_card_tut")==true){
        Session.set("new_card_tut", false);
        Session.set("new_card_tut_save", true);
      }
    },
    'click .lightbox' : function(event) {
      event.stopPropagation();
    },
    'click .delete' : function() {
      if(Session.get("selected_card")!=null) {
        Meteor.call('deleteCard', Session.get("selected_card"), function(e, r) {
          Session.set("selected_card", null);
        });
      }
    },
    'click .overlay' : function () {
      if(Session.get("selected_card")==undefined) Logs.insert({"action": "Card lightbox closed", "user": Meteor.user()._id});
      else Logs.insert({"action": "Card lightbox closed", "user": Meteor.user()._id, "object": Session.get("selected_card")});

      Session.set("selected_card", null);
      Session.set("editing", false);
      if(Meteor.user().profile.first_login) {
        if(Session.get("new_card_tut")==undefined) Session.set("new_card_tut", true);
        else {
          if($('div:contains("Click me ")')[2]!=undefined) {
            var card_id = $('div:contains("Click me ")')[2].getAttribute('id');
            if(card_id) Cards.update({'_id':card_id },{$set: {'status': 'done'}});
            Session.set("drag_tutorial_start", true);
          }
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
        createNewCard("todo", Session.get("project_id"));
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
    // 'click .project-name' : function() {
    //   $(".projects-dropdown").toggle(100);
    //   Logs.insert({"action": "Click projects dropdown", "user": Meteor.user()._id});
    // },
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

  function createNewCard(cardStatus, project) {
    var newCard;

    if(project) var projects = [project];
    else var projects = [];
    console.log(projects);
    var newCard = Cards.insert({'title': "", 'content': "", 'owner': Meteor.userId(), 'status': cardStatus, 'projects': projects});

    Session.set("selected_card", newCard);
    Session.set("editing", true);

    Logs.insert({"action": "Card created", "user": Meteor.user()._id, "object": Session.get("selected_card")});
  }

  Template.cardWall.events({
    'click .mini-card' : function() {
      Session.set("selected_card", this._id);
      Session.set("click_tut_off", true);
      if($('.ring')[0]) var card_id = $('.ring')[0].parentNode.getAttribute('id');
      if(card_id) Cards.update({'_id':card_id },{$set: {pulse: false}});
      Logs.insert({"action": "Card opened via mini card", "user": Meteor.user()._id, "object": Session.get("selected_card")});
    },
    'dblclick .card-column' : function(event) {
      console.log(this);
      createNewCard(this._id);
    },
    'click .delete-column' : function() {
      console.log(this);
      if(Status.findOne({"_id":this._id})) {
        Meteor.call('deleteStatus', this._id, function(e, r) {
          Logs.insert({"action": "Column deleted", "user": Meteor.user()._id, "object": this._id});
        });
      }
    },
    'mouseenter .column-title' : function() {
      $(".delete-column").fadeToggle(300);
    },
    'mouseleave .card-column' : function() {
      $(".delete-column").fadeToggle(300);
    }
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
