if (Meteor.isClient) {
  Template.header.first_name = function () {
    return Meteor.user().profile.first_name;
  };


  Template.signup.events({
    'click #add_new_user' : function () {
      var email = $("#email_address").val();
      var password = $("#password").val();
      var first = $("#first_name").val();
      var last = $("#last_name").val();
      var url = $("#site_url").val();
      Accounts.createUser({username:email, password: password, email: email, profile : {first_name: first, last_name: last, url: url }});
    },
    'click #login' : function() {
      $("#signup_page").toggle();
      $("#login_page").fadeToggle(300);
    },
  });

  Template.login.events({
    'click #sign_up' : function() {
      $("#login_page").toggle();
      $("#signup_page").fadeToggle(300);
    },
    'click #authenticate_user' : function () {
      login();
    },
    'keypress #login_password': function (evt) {
      if (evt.which === 13) {
        login();
      }
    }
  })

  function login() {
    var email = $("#login_email_address").val();
    var password = $("#login_password").val();
    Meteor.loginWithPassword(email, password);
  }

  Template.header.events({
    'click #log_out' : function () {
      Meteor.logout();
      
    }
  });
}
