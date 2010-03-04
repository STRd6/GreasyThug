//$('a').css({'background-color': 'yellow'});

Scorpio.init();
commandHistory = new CommandHistory(Scorpio);

var interactiveConsole = new IJC();

interactiveConsole.registerCallback('command', commandHistory.add)
interactiveConsole.registerCallback('keydown', commandHistory.arrowKeyEvent);

Scorpio.loadConfig(function(config) {
  console.log(config);
  interactiveConsole.attach(config.left || 0, config.top || 0);
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
          eval("(" + code + ")");
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

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");

    alert(request.greeting);
});


/*
chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    port.postMessage({counter: msg.counter+1});
  });
});

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    sendResponse({counter: request.counter+1});
  }
);
*/

chrome.extension.sendRequest({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});
