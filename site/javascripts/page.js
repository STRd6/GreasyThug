Scorpio.init();
commandHistory = new CommandHistory(Scorpio);

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

var prevButton = $("<button class='prev'>&lt; Prev</button>").click( function() {
  commandHistory.changeConsoleCommand(-1, interactiveConsole); 
  return false;
});
var nextButton = $("<button class='next'>Next &gt;</button>").click(function() {
  commandHistory.changeConsoleCommand(1, interactiveConsole);
  return false;
});
var scriptTitleInput = $("<input class='titleEntry' />").attr('title', "Name to save script as");
var saveButton = $("<button class='save'>Save Previous</button>").click(function() {
  savePreviouslyExecutedAs(scriptTitleInput.val(), 1);
  return false;
}).attr('title', "Persist the last script executed to be run on subsequent page loads.");

interactiveConsole.element.find("form")
  .append(prevButton)
  .append(nextButton)
  .append(saveButton)
  .append(scriptTitleInput);

Scorpio.loadConfig(function(config) {
  interactiveConsole.attach(config.left || 0, config.top || 0);
});

function saveScript(title, code, active) {
  Scorpio.scripts.create({
    title: title,
    code: code,
    active: active != false ? 1 : 0
  }, function(transaction, result) {
    scriptTitleInput.val('');
    interactiveConsole.puts("Saved previously executed script as: " + title);
    interactiveConsole.puts("ID is " + result.insertId);
  });
}

function executeActiveScripts() {
  Scorpio.scripts.all({order: "position"}, function(scripts) {
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
  Scorpio.scripts.all({order: "position"}, function(scripts) {
    var scriptManager = UI.window("Scripts");

    var scriptList = UI.list(function(list) {
      list.find("li").each(function(position) {
        Scorpio.scripts.update($(this).data("id"), {position: position});
      });
    });

    scriptManager.addChild(scriptList);

    $.each(scripts, function(index, script) {
      var title = script.title || "Untitled";
      var code = script.code;
      var id = script.id;

      if(logging) {
        console.log("Script ["+id+"]: " + title);
        console.log(code);
      }

      var scriptItem = $("<li />").text(id + ": " + title);
      scriptItem.prepend(UI.checkbox(script.active, function(activate) {
        Scorpio.scripts.update(id, {active: activate ? 1 : 0});
      }));

      scriptItem.data("id", id);

      scriptList.append(scriptItem);
    });

    $("body").append(scriptManager);
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

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if(request.action == "toggle") {
      interactiveConsole.element.toggle();
    }
  }
);
