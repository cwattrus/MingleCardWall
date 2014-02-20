if (Meteor.isClient) {
  var counter = 0;

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
    setTimeout(function(){
           counter +=1;
           if (counter == 1){
            card_id = moveFirstCard();
          } 
      },4000);
    }
  
  function moveFirstCard() {
      console.log(Meteor.user()._id);

    if(($(".ring")[0]==undefined)&&(Meteor.user().profile.first_login)) {

      var card_id = $('.mini-card')[0].getAttribute('id');
      Cards.update({'_id':card_id },{$set: {'status': 'doing', pulse: true}});
      Meteor.users.update({'_id':Meteor.user()._id },{$set: {'first_login': false}});
      return card_id;
    }
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
      $(".overlay").fadeToggle(300);
    },
    'click .lightbox' : function(event) {
      event.stopPropagation();
    },
    'click .overlay' : function () {
      $(".overlay").fadeToggle(300);
    },
    'click #save_card' : function() {
      var card_title = $(".card-title").val();
      var card_content = $(".card-content").val();
      if(Session.get("selected_card")) {
        Cards.update({ _id:Session.get("selected_card")} , { $set: {title: card_title, content: card_content}});
        Session.set("selected_card", null);
      }
      else {
        Cards.insert({title: card_title, content: card_content, owner: Meteor.userId(), status: "todo"});
      }
      $(".overlay").fadeToggle(300);
      $(".card-title").val("");
      $(".card-content").val("");
    },
    'click .dropdown' : function() {
      $(".projects-dropdown").toggle(100);
    }
  });

  Template.cardWall.events({
    'click .mini-card' : function() {
      $(".card-content").val(this.content);
      $(".card-title").val(this.title);
      $(".overlay").fadeToggle(300);
      Session.set("selected_card", this._id);
      var card_id = $('.ring')[0].parentNode.getAttribute('id');
      Cards.update({'_id':card_id },{$set: {pulse: false}});
    },

  });
}
