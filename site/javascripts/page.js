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

var showScriptsButton = $("<button class='showScripts'>Show Scripts</button>").click(function() {
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

function saveScript(title, code, active) {
  Scorpio.scripts.create({
    title: title,
    code: code,
    active: active != false ? 1 : 0
  }, function(transaction, result) {
    var id = result.insertId;
    scriptTitleInput.val('');
    interactiveConsole.puts("Saved previously executed script as: " + title);
    interactiveConsole.puts("ID is " + id);

    Scorpio.scripts.find(id, function(script) {
      addScriptItem(script, scriptList);
      updateScriptPositions(scriptList);
      scriptManager.show();
    });
  });
}

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

function loadLocalScripts() {
  Scorpio.scripts.all({order: "position"}, function(scripts) {
    $.each(scripts, function(index, script) {
      var title = script.title || "Untitled";
      var code = script.code;
      var id = script.id;

      if(logging) {
        console.log("Script ["+id+"]: " + title);
        console.log(script);
      }

      addScriptItem(script, scriptList);
    });

    updateScriptPositions(scriptList);
  });
}

function addScriptItem(script, scriptList) {
  var id = script.id;
  var title = script.title;

  var scriptItem = $("<li />")
    .text(title + " (ID: " + id + ")")
    .attr("title", script.code)
  ;

  scriptItem.prepend(UI.checkbox(script.active, function(activate) {
    Scorpio.scripts.update(id, {active: activate ? 1 : 0});
  }));

  scriptItem.append($("<span class='remove' />").text("X").attr("title", "Delete " + title).click(function() {
    UI.confirm("Really delete " + title + "?", function() {
      deleteScript(id);
    });
  }));

  scriptList.append(scriptItem);

  //TODO: Figure out why jQuery forgets data after the items have been added to the list
  scriptItem.attr("scriptId", id);
}

var scriptManager = UI.window("Scripts").hide();
var scriptList = UI.list(updateScriptPositions);

scriptManager.addChild(scriptList);
$("body").append(scriptManager);

function updateScriptPositions(list) {
  list.find("li").each(function(position) {
    Scorpio.scripts.update($(this).attr("scriptId"), {position: position});
  });
}

loadLocalScripts();

function deleteScript(id) {
  Scorpio.scripts.destroy(id);

  scriptList.find("li[scriptId='"+id+"']").remove();
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
