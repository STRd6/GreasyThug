function RemoteScripts(remoteServer) {
  var domain = getCurrentDomain();
  var url = remoteServer + "scripts.json?domain=" + domain;
  
  var window = UI.Window("Remote Scripts for " + domain);

  proxy({url: url}, function(scripts) {
    if(logging) {
      console.log("RETRIEVED REMOTE SCRIPTS FROM: " + remoteServer);
      console.log(scripts);
    }

    if(scripts.length > 0) {
      var scriptList = UI.List();
      window.addChild(scriptList);

      $.each(scripts, function() {
        var script = this.script;

        var scriptItem = $("<li />")
          .attr("title", script.code)
          .append(
            UI.Span(script.title, {
              "class": "title"
            })
          )
          .append(UI.Button("Run", {title: "Run " + script.title}, function() {
            eval(script.code);
          }))
          .append(UI.Button("Install", {title: "Install " + script.title}, function() {
            scriptManager.saveScript(script.title, script.code, true);

            $this = $(this);
            $this.attr("disabled", true);
            $this.text("Installed");
          }))
        ;
      
        scriptList.append(scriptItem);
      });
    } else {
      window.addChild(UI.Span("No scripts found for " + domain + " from " + remoteServer));
    }
  });

  window.hide().appendTo("body");
  return window;
}
