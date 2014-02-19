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
    
    // $('.makeMeDraggable').draggable({
    //   snap: '.tagsinput',
    //   appendTo: 'parent',
    //   helper: 'clone',
    //   zIndex: 999,
    //   start: handleBeadDragActivate
    // });
    // $('.makeMeDroppable').droppable( {
    //     drop: handleBeadDropEvent,
    //     dropactivate : handleBeadDropActivate,
    //     dropdeactivate : handleBeadDropDeactivate
    // });
    // $( ".makeMeDroppable" ).on("dropactivate", handleBeadDropActivate);
    // $( ".makeMeDroppable" ).on("dropdeactivate", handleBeadDropDeactivate);
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
    return Cards.find({status:"todo"});
  }
  Template.cardWall.cards_doing = function() {
    return Cards.find({status:"doing"});
  }
  Template.cardWall.cards_done = function() {
    return Cards.find({status:"done"});
  }

  Template.header.events({
    'click #new_card' : function () {
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

      Cards.insert({title: card_title, content: card_content, owner: Meteor.userId(), status: "todo"});
    }
  });
}
