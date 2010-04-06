var BackgroundScripts = BackgrondDBTableInterface("scripts");

Scorpio.init();
commandHistory = new CommandHistory(Scorpio);

var scriptManager = ScriptManager(Scorpio.scripts);
var interactiveConsole = new IJC();

interactiveConsole.element.hide();

var logging = false;

get("logging", function(val) {
  logging = (val == "1");
});

get("autorun", function(autorun) {
  if(autorun != 0) {
    executeActiveScripts();
  }
});

get("autoshow", function(autoshow) {
  if(autoshow != 0) {
    interactiveConsole.element.show();
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

var showScriptsButton = UI.Button("Show Scripts", {class: "showScripts"}, function() {
  scriptManager.toggle();
  return false;
});

interactiveConsole.element.find("form")
  .append(prevButton)
  .append(nextButton)
  .append(saveButton)
  .append(scriptTitleInput)
  .append(showScriptsButton)
;

Scorpio.loadConfig(function(config) {
  interactiveConsole.attach(config.left || 0, config.top || 0);
});

function executeActiveScripts() {
  Scorpio.scripts.all({order: "position", conditions: "active = 1"}, function(scripts) {
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
  });
}

function savePreviouslyExecutedAs(title, active) {
  scriptManager.saveScript(title, commandHistory.last(), active);
  scriptTitleInput.val('');
}

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if(request.action == "toggle") {
      interactiveConsole.element.toggle();
    }
  }
);
