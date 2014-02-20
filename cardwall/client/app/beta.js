if (Meteor.isClient) {

  Template.beta.events({
    'click .add-beta' : function() {
      Beta.insert({"email":Meteor.user().emails[0].address});
      $(".beta").css({"height":"500px"});
      $(".thanks").css({"display":"inline-block"});
      $("#close_beta_invite").css({"display":"inline-block"});

      Logs.insert({"action": "Sign up for beta", "user": Meteor.user()._id});
    },
    'click #invite_to_beta' : function() {
      console.log("clicked");
      var first = $("#beta_user_1").val();
      var second = $("#beta_user_2").val();
      var third = $("#beta_user_3").val();
      
      if(first!="") Beta.insert({"email":$("#beta_user_1").val(), "reffered": true});
      if(second!="") Beta.insert({"email":$("#beta_user_2").val(), "reffered": true});
      if(third!="") Beta.insert({"email":$("#beta_user_3").val(), "reffered": true});
    },
    'click #close_beta_invite' : function() {
      $(".beta").css({"height":"90px"});
      $(".thanks").css({"display":"none"});
      $("#close_beta_invite").css({"display":"none"});
    }
  });

}
