//$('a').css({'background-color': 'yellow'});

Scorpio.init();
commandHistory = new CommandHistory(Scorpio);

var interactiveConsole = new IJC();
var show = true;

interactiveConsole.registerCallback('command', commandHistory.add)
interactiveConsole.registerCallback('keydown', commandHistory.arrowKeyEvent);

Scorpio.loadConfig(function(config) {
  console.log(config);
  interactiveConsole.element.hide();
  interactiveConsole.attach(config.left || 0, config.top || 0);
  if(show) {
    interactiveConsole.element.show();
  }
});

function saveScript(title, code, active) {
  Scorpio.scripts.create({
    title: title,
    code: code,
    active: active != false ? 1 : 0
  });
}

function executeActiveScripts() {
  Scorpio.scripts.all(function(scripts) {
    $.each(scripts, function(index, script) {
      var title = script.title;
      var code = script.code;
      var id = script.id;
      
      console.log("Script ["+id+"]: " + title);
      console.log(code);
      try {
        
        if(script.active) {
          console.log("[Executing]");
          eval(code);
        } else {
          console.log("[Skipping, Inactive]");
        }
      } catch(e) {
        console.log("Error Running: " + title);
        console.log(e);
      }
    });
  });
}

function listScripts() {
  Scorpio.scripts.all(function(scripts) {
    $.each(scripts, function(index, script) {
      var title = script.title;
      var code = script.code;
      var id = script.id;
      
      console.log("Script ["+id+"]: " + title);
      console.log(code);
    });
  });
}

function deleteScript(id) {
  Scorpio.scripts.destroy(id);
}

function disableScript(id) {
  Scorpio.scripts.update(id, {active: 0});
}

function enableScript(id) {
  Scorpio.scripts.update(id, {active: 1});
}

function savePreviouslyExecutedAs(title, active) {
  saveScript(title, commandHistory.last(), active);
}

/**
 * Functions to get and set values from the background page's local storage
 */
function set(key, value) {
  chrome.extension.sendRequest({action: "set", key: key, value: value}, function(response) {
    console.log(response);
  });
}

function get(key, callback) {
  chrome.extension.sendRequest({action: "get", key: key}, function(response) {
    console.log(response);
    callback(response.value);
  });
}

set("test", "new_test");

get("test", function(val){console.log(val)});

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if(request.action == "toggle") {
      interactiveConsole.element.toggle();
    }
  }
);
