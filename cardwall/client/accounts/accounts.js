if (Meteor.isClient) {
  Template.header.first_name = function () {
    return Meteor.user().profile.first_name;
  };
  Template.beta.first_name = function () {
    return Meteor.user().profile.first_name;
  };

  Template.signup.events({
    'click #add_new_user' : function () {
      createUserAndLogin();
      Logs.insert({"action": "Sign up via click"});
    },
    'click #login' : function() {
      $("#signup_page").toggle();
      $("#login_page").fadeToggle(300);
      Logs.insert({"action": "Switch to login"});
    },
    'keypress #site_url': function (evt) {
      if (evt.which === 13) {
        createUserAndLogin();
        Logs.insert({"action": "Sign up via enter"});
      }
    }
  });

  Template.login.events({
    'click #sign_up' : function() {
      $("#login_page").toggle();
      $("#signup_page").fadeToggle(300);
      Logs.insert({"action": "Switch to sign up"});
    },
    'click #authenticate_user' : function () {
      login();
    },
    'keypress #login_password': function (evt) {
      if (evt.which === 13) {
        login();
      }
      Logs.insert({"action": "Login via enter"});
    }
  })

  function createUserAndLogin() {
    var email = $("#email_address").val();
    var password = $("#password").val();
    var first = $("#first_name").val();
    var last = $("#last_name").val();
    var url = $("#site_url").val();
    $("#signup_page").hide();
    $("#load").fadeToggle(200);
    var counter = 0;
    setTimeout(function(){
      console.log(counter);
         counter +=1;
         if (counter == 1){
          Accounts.createUser({username:email, password: password, email: email, profile : {first_name: first, last_name: last, url: url, first_login: true }}, function(error) {
            if(error) {
              $("#load").hide();
              $("#signup_page").fadeToggle(200);
            }
            else {
              Logs.insert({"action": "User created and logged in", "user": Meteor.user()._id});
            }
          });
        }
      },4000);
  }

  function login() {
    var email = $("#login_email_address").val();
    var password = $("#login_password").val();
    Meteor.loginWithPassword(email, password);
    Logs.insert({"action": "Login via click", "user": Meteor.user()._id});
  }

  Template.header.events({
    'click #log_out' : function () {
      Logs.insert({"action": "Logout", "user": Meteor.user()._id});
      Meteor.logout();
    }
  });
}
