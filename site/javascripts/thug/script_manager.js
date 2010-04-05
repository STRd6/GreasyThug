function ScriptManager(Scripts) {
  var scriptList = UI.List(updateScriptPositions);

  var self = UI.Window("Scripts").hide();
  self.addChild(scriptList);
  $("body").append(self);

  loadLocalScripts();

  var editWindows = {};

  function addScriptItem(script) {
    var id = script.id;
    var title = script.title;

    var scriptItem = $("<li />")
      .append($("<span class='title'>" + title + " (ID: " + id + ")</span>"))
      .attr("title", script.code)
    ;

    scriptItem.dblclick(function(event) {
      Scripts.find(id, function(script) {
        editScript(script);
      });
    });

    scriptItem.prepend(UI.Checkbox(script.active, function(activate) {
      Scripts.update(id, {active: activate ? 1 : 0});
    }));

    scriptItem.append($("<span class='remove' />").text("X").attr("title", "Delete " + title).click(function() {
      UI.Confirm("Really delete " + title + "?", function() {
        deleteScript(id);
      });
    }));

    scriptList.append(scriptItem);

    //TODO: Figure out why jQuery forgets data after the items have been added to the list
    scriptItem.attr("scriptId", id);
  }

  function deleteScript(id) {
    Scripts.destroy(id);
    itemWithId.remove();
  }

  function editScript(script) {
    var id = script.id;
    var title = script.title;

    var editWindow;
    if(editWindows[id]) {
      editWindow = editWindows[id];
    } else {
      editWindow = editWindows[id] = UI.Window("Edit " + title);

      var titleField = $("<input type='text' />");
      titleField.val(title);

      var codeArea = $("<textarea />");
      codeArea.val(script.code);

      var runButton = UI.Button("Run", function() {
        var code = codeArea.val();
        try {
          eval(code);
        } catch(e) {
          alert(e.message);
        }
      });

      var saveButton = UI.Button("Save", function() {
        var code = codeArea.val();
        var title = titleField.val();
        Scripts.update(id, {title: title, code: code});
        itemWithId(id)
          .attr("title", code)
          .find(".title")
            .text(title + " (ID: " + id + ")")
        ;
      });

      editWindow
        .addChild(titleField)
        .addChild(codeArea)
        .addChild(runButton)
        .addChild(saveButton)
        .appendTo("body")
      ;
    }

    editWindow.show();
  }

  function itemWithId(id) {
    return scriptList.find("li[scriptId='"+id+"']");
  }

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

  function saveScript(title, code, active) {
    Scripts.create({
      title: title,
      code: code,
      active: active != false ? 1 : 0
    }, function(transaction, result) {
      var id = result.insertId;

      Scripts.find(id, function(script) {
        addScriptItem(script);
        updateScriptPositions();
        self.show();
      });
    });
  }

  function updateScriptPositions() {
    scriptList.find("li").each(function(position) {
      Scripts.update($(this).attr("scriptId"), {position: position});
    });
  }

  $.extend(self, {
    deleteScript: deleteScript,
    saveScript: saveScript
  });

  return self;
}
