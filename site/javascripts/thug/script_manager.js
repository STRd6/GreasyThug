/*global
  $,
  UI,
  logging, remoteScriptDomain, publish
*/

function ScriptManager(title, Scripts) {
  var editWindows = {};
  var deleteScript, editScript, itemWithId, prepareEditorWindow, saveScript, scriptList, updateScriptPositions;
  var self;

  function addScriptItem(script) {
    var id = script.id;
    var title = script.title;

    var scriptItem = $("<li />")
      .append(
        UI.Span(title + " (ID: " + id + ")", {
          "class": "title"
        })
      ).attr("title", script.code)
    ;

    scriptItem.dblclick(function(event) {
      Scripts.find(id, function(script) {
        editScript(script);
      });
    });

    scriptItem.prepend(UI.Checkbox(script.active, function(activate) {
      Scripts.update(id, {active: activate ? 1 : 0});
    }));

    scriptItem.append(UI.Span("X", {"class": "remove", title: "Delete " + title}).click(function() {
      UI.Confirm("Really delete " + title + "?", function() {
        deleteScript(id);
      });
    }));

    scriptList.append(scriptItem);

    //TODO: Figure out why jQuery forgets data after the items have been added to the list
    scriptItem.attr("scriptId", id);
  }

  deleteScript = function(id) {
    Scripts.destroy(id);
    itemWithId(id).remove();
  };

  editScript = function(script) {
    var id = script.id;
    var title = script.title;

    var editWindow;
    if(editWindows[id]) {
      editWindow = editWindows[id];
    } else {
      editWindow = editWindows[id] = UI.Window("Edit: " + title);

      prepareEditorWindow(script, editWindow);
    }

    editWindow.show();
  };

  itemWithId = function(id) {
    return scriptList.find("li[scriptId='"+id+"']");
  };

  function loadLocalScripts() {
    Scripts.all({order: "position"}, function(scripts) {
      $.each(scripts, function(index, script) {
        var title = script.title || "Untitled";
        var code = script.code;
        var id = script.id;

        if(logging) {
          console.log("Script ["+id+"]: " + title);
          console.log(script);
        }

        addScriptItem(script);
      });

      updateScriptPositions();
    });
  }

  function newScript() {
    var newScriptWindow = UI.Window("New Script");

    prepareEditorWindow({}, newScriptWindow);
  }

  prepareEditorWindow = function(script, editorWindow) {
    var titleField = $("<input type='text' />");
    titleField.val(script.title || "Untitled");

    var publishButton = UI.Button("Publish", {title: "Publish to " + remoteScriptDomain}, function() {
      var $this = $(this);

      $this.attr("disabled", true);
      $this.text("Publishing");

      publish(script, function() {
        $this.text("Published");
      });
    });

    var codeArea = $("<textarea />");
    codeArea.val(script.code || "").css("height", 142);

    var runButton = UI.Button("Run", function() {
      var code = codeArea.val();
      try {
        eval(code);
      } catch(e) {
        alert(e.message);
      }
    });

    var saveButton = UI.Button("Save", function() {
      var title = script.title = titleField.val();
      var code = script.code = codeArea.val();

      editorWindow.title("Edit: " + title);
      if(script.id) {
        Scripts.update(script.id, {title: title, code: code});

        itemWithId(script.id)
          .attr("title", code)
          .find(".title")
            .text(title + " (ID: " + script.id + ")")
        ;
      } else {
        saveScript(title, code, true);
        editorWindow.hide();
      }
    });

    editorWindow
      .addChild(titleField)
      .addChild(publishButton)
      .addChild(codeArea)
      .addChild(runButton)
      .addChild(saveButton)
      .appendTo("body")
    ;
  };

  saveScript = function(title, code, active, guid) {
    Scripts.create({
      title: title,
      code: code,
      active: active !== false ? 1 : 0,
      guid: guid ? guid : ''
    }, function(transaction, result) {
      var id = result.insertId;

      Scripts.find(id, function(script) {
        addScriptItem(script);
        updateScriptPositions();
        self.show();
      });
    });
  };

  updateScriptPositions = function() {
    scriptList.find("li").each(function(position) {
      Scripts.update($(this).attr("scriptId"), {position: position});
    });
  };

  scriptList = UI.List(updateScriptPositions);

  self = UI.Window(title).hide();
  self.addChild(scriptList);
  self.addChild($("<a href='#'>+ Add New Script</a>").click(function(){newScript(); return false;}));
  $("body").append(self);

  loadLocalScripts();

  $.extend(self, {
    deleteScript: deleteScript,

    isInstalled: function(guid, callback) {
      Scripts.first({conditions: "guid ='" + guid + "'"}, function(script) {
        callback(script);
      });
    },

    saveScript: saveScript
  });

  return self;
}
