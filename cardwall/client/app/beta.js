if (Meteor.isClient) {

  Template.beta.events({
    // '.click #invite_to_beta' : function() {
    //   console.log("blah");
    //   var first = $("#beta_user_1").val();
    //   var second = $("#beta_user_2").val();
    //   var third = $("#beta_user_3").val();
    //   if(first!="") Beta.insert({"email":first});
    //   if(second!="") Beta.insert({"email":second});
    //   if(third!="") Beta.insert({"email":third});
    // },
    'click .add-beta' : function() {
      Beta.insert({"email":Meteor.user().emails[0].address});
      $(".beta").css({"height":"300px"});
      $(".thanks").css({"display":"inline-block"});
      Logs.insert({"action": "Sign up for beta"});
    },

  });

}
