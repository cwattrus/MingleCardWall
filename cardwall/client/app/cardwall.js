if (Meteor.isClient) {
  var counter = 0;
  var times_to_try = 1;

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

    
    }

    Template.cardWall.created = function() {
      console.log("why?");
      setTimeout(function(){
           counter +=1;
           if (counter == times_to_try){
            card_id = moveFirstCard();
            if(card_id==false) {
              times_to_try += 1;
            }
          } 
      },4000);
    }
  
  function moveFirstCard() {
    if((Meteor.user()!=null)||(Meteor.user()!=undefined)) {
      if(($(".ring")[0]==undefined)&&(Meteor.user().profile.first_login)) {
        var card_id = $('.mini-card')[0].getAttribute('id');
        Cards.update({'_id':card_id },{$set: {'status': 'doing', pulse: true}});
        Meteor.users.update({'_id':Meteor.user()._id },{$set: {'first_login': false}});
        return card_id;
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
    }
    else if(todoDrop) {
      Cards.update({'_id':draggable.attr('id') },{$set: {'status': 'todo'}});
    }
    else {
      Cards.update({'_id':draggable.attr('id') },{$set: {'status': 'done'}});
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
    if(this.pulse) {
      return true;
    }
    else return false;
  }

  Template.header.events({
    'click #new_card' : function () {
      $(".card-title").val("");
      $(".card-content").val("");
      var newCard = Cards.insert({title: "My new card", content: "A world of possiblies...", owner: Meteor.userId(), status: "todo"});
      Session.set("selected_card", newCard);
      Session.set("editing", true);
    },
    'click .lightbox' : function(event) {
      event.stopPropagation();
    },
    'click .overlay' : function () {
      Session.set("selected_card", null);
      Session.set("editing", false);
    },
    'click #save_card' : function() {
      var card_title = $(".card-title").val();
      var card_content = $(".card-content").val();
      if(Session.get("selected_card")) {
        Cards.update({ _id:Session.get("selected_card")} , { $set: {title: card_title, content: card_content}});
        $(".card-content").val(card_content);
        $(".card-content-read").html(card_content);
        $(".card-title").val(card_title);
        $(".card-title-read").html(card_title);
      }
      else {
        var newCard = Cards.insert({title: card_title, content: card_content, owner: Meteor.userId(), status: "todo"});
        Session.set("selected_card", newCard);
        newCard = Cards.findOne({"_id": newCard});
        $(".card-content").val(newCard.content);
        $(".card-content-read").html(newCard.content);
        $(".card-title").val(newCard.title);
        $(".card-title-read").html(newCard.title);
      }
      Session.set("editing", false);

    },
    'click .dropdown' : function() {
      $(".projects-dropdown").toggle(100);
    },
    'click #edit_card' : function() {
      if(Session.get("selected_card")) {
        Session.set("editing", true);
      }
    },
    'click #close_card' : function() {
      $(".overlay").fadeToggle(300);
      $(".card-title").val("");
      $(".card-content").val("");
      Session.set("selected_card", null);
    }
  });

  Template.cardWall.events({
    'click .mini-card' : function() {
      Session.set("selected_card", this._id);

      if($('.ring')[0]) var card_id = $('.ring')[0].parentNode.getAttribute('id');
      if(card_id) Cards.update({'_id':card_id },{$set: {pulse: false}});
    },

  });
}
