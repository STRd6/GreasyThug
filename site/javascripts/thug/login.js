/*global
  $, window,
  UI,
  remoteScriptDomain,
  get, post, getJSON
*/

(function() {
  var isLoggedIn = false;

  function LoginScreen(remoteServer) {
    var url = remoteServer + "users/current";
    var loginUrl = remoteServer + "user_sessions";
    var status = $("<div />");

    var afterLoginCallback;

    var window = UI.Window("Login to " + remoteServer);
    var loginForm, logoutButton;

    function loggedOut() {
      console.log("LOGGED OUT!");
      isLoggedIn = false;

      status.text("Not logged in");
      window.addChild(loginForm);
      logoutButton.remove();
    }

    function loggedIn(user) {
      console.log("LOGGED IN!");
      isLoggedIn = true;

      status.text("Logged in as: " + user.display_name);
      window.addChild(logoutButton);
      loginForm.remove();

      if(afterLoginCallback) {
        afterLoginCallback();
      }

      window.remove();
    }

    loginForm = $("<form action='"+loginUrl+"' />").submit(function() {
      var $this = $(this);

      post(
        $this.attr("action"),
        $this.serialize(),
        function(data) {
          console.log("LOGIN RESPONSE");
          console.log(data);
          if(data) {
            if(data.user) {
              loggedIn(data.user);
            } else {
              var errors = $.map(data, function(error) {
                return error[1];
              });

              status.text(errors.join(", "));
            }
          } else {
            status.text("Error: No data from server.");
          }
        },
        "json"
      );

      return false;
    });

    var emailInput = $("<input name='user_session[email]'/>");
    var passwordInput = $("<input type='password' name='user_session[password]'/>");

    loginForm
      .append($("<label>Email:</label>"))
      .append(emailInput)
      .append("<br />")
      .append($("<label>Password:</label>"))
      .append(passwordInput)
      .append(UI.Button("Login", function() {
        $(this).parent().submit();
        return false;
      }))
    ;

    logoutButton = UI.Button("Logout", function() {
      get(remoteServer + "logout",
        function(data) {
          loggedOut();
        },
        "json"
      );
    });

    window.addChild(status);

    getJSON(url, '', function(data) {
      if(data && data.user) {
        loggedIn(data.user);
      } else {
        loggedOut();
      }
    });
    
    $.extend(window, {
      setAfterLoginCallback: function(method) {
        afterLoginCallback = method;
      }
    });

    return window;
  }
  
  var screen = LoginScreen("http://" + remoteScriptDomain + "/");

  window.requireLogin = function(method) {
    if(isLoggedIn) {
      method();
    } else {
      screen.setAfterLoginCallback(method);
      $("body").append(screen);
      screen.center();
    }
  };
}());
