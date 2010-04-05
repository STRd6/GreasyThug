function ScriptManager(Scripts) {
  var scriptList = UI.List(updateScriptPositions);

  var self = UI.Window("Scripts").hide();
  self.addChild(scriptList);
  $("body").append(self);

  loadLocalScripts();

  function addScriptItem(script) {
    var id = script.id;
    var title = script.title;

    var scriptItem = $("<li />")
      .text(title + " (ID: " + id + ")")
      .attr("title", script.code)
    ;

    scriptItem.dblclick(function(event) {
      //TODO: Edit
      console.log("DBL CLCK");
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
    scriptList.find("li[scriptId='"+id+"']").remove();
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
