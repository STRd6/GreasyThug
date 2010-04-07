var BackgroundScripts = BackgrondDBTableInterface("scripts");

Scorpio.init();
commandHistory = new CommandHistory(Scorpio);

var scriptManager = ScriptManager("Local Scripts", Scorpio.scripts);
var globalScriptManager = ScriptManager("Global Scripts", BackgroundScripts);
var remoteScriptsWindow = RemoteScripts("http://" + remoteScriptDomain + "/");

var controlPanel = UI.Window("Greasy Thug Control Panel", {
  dragStop: function() {
    Scorpio.storeConfig({
      left: $( this ).css('left'),
      top: $( this ).css('top')
    });
  }
});

controlPanel.hide().appendTo($("body"));

var interactiveConsole = new IJC();
interactiveConsole.element.hide();
interactiveConsole.attach(0, 0);

var logging = false;

get("logging", function(val) {
  logging = (val == "1");
});

get("autorun", function(autorun) {
  if(autorun != 0) {
    // Execute background scripts then page scripts
    executeActiveScripts(BackgroundScripts, function() {
      executeActiveScripts(Scorpio.scripts);
    });
  }
});

get("autoshow", function(autoshow) {
  if(autoshow != 0) {
    controlPanel.show();
  }
});

interactiveConsole.registerCallback('command', commandHistory.add)
//interactiveConsole.registerCallback('keydown', commandHistory.arrowKeyEvent);

var prevButton = UI.Button("< Prev", {class: "prev"}, function() {
  commandHistory.changeConsoleCommand(-1, interactiveConsole); 
  return false;
});
var nextButton = UI.Button("Next >", {class: "next"}, function() {
  commandHistory.changeConsoleCommand(1, interactiveConsole);
  return false;
});
var scriptTitleInput = $("<input class='titleEntry' />").attr('title', "Name to save script as");
var saveButton = UI.Button("Save Previous", {
    class: "save",
    title: "Persist the last script executed to be run on subsequent page loads."
  }, function() {
    savePreviouslyExecutedAs(scriptTitleInput.val(), 1);
    return false;
  }
);

var showConsoleButton = UI.Button("Console", function() {
  interactiveConsole.element.toggle();
  return false;
});

var showScriptsButton = UI.Button("Local Scripts", {class: "showScripts"}, function() {
  scriptManager.toggle();
  return false;
});

var showRemoteScriptsButton = UI.Button("Scripts from " + remoteScriptDomain, function() {
  if(remoteScriptsWindow) {
    remoteScriptsWindow.toggle();
  }
  return false;
});

interactiveConsole.element.find("form")
  .append(prevButton)
  .append(nextButton)
  .append(saveButton)
  .append(scriptTitleInput)
;

controlPanel
  .addChild(showConsoleButton)
  .addChild(showScriptsButton)
  .addChild(showRemoteScriptsButton)
;

Scorpio.loadConfig(function(config) {
  controlPanel.css({
    'top': config.top || 0,
    'left': config.left || 0
  });
});

function executeActiveScripts(Scripts, callback) {
  Scripts.all({order: "position", conditions: "active = 1"}, function(scripts) {
    $.each(scripts, function(index, script) {
      var title = script.title;
      var code = script.code;
      var id = script.id;
      var token = title + "(ID:" + id + " )";

      try {
        console.log("[Executing " + token + "]");
        eval(code);
      } catch(e) {
        console.log("Error Running: " + token);
        console.log(e);
      }
    });

    if(callback) {
      callback();
    }
  });
}

function savePreviouslyExecutedAs(title, active) {
  scriptManager.saveScript(title, commandHistory.last(), active);
  scriptTitleInput.val('');
}

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if(request.action == "toggle") {
      controlPanel.toggle();
    }
  }
);

get("display_remote_scripts", function(val) {
  if(val != 0) {
    remoteScriptsWindow.show();
  }
});
