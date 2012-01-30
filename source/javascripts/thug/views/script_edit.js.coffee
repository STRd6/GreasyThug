#= require lib/namespace

#= require ../view
#= require ../models/script

namespace "Thug.Views", (Views) ->
  Models = Thug.Models

  class Views.ScriptEditor extends Backbone.View
    className: 'script'
    tagName: 'li'

    initialize: ->
      @el = Thug.Window
        title: "Edit Script"
        resizable: true

      # We constructed the view element manually, attach events
      @delegateEvents()

      @el.append $("<input type=text name=name>")
      @el.append $("<button>",
        class: "save"
        text: "Save"
      ).button()

      input = $("<input type=textarea>")

      @el.append input

      @editor = new CodeMirror.fromTextArea input.get(0),
        lineNumbers: true
        tabMode: "shift"
        textWrapping: false

      @editor.setValue(@model.get("source"))

      @el.attr "data-cid", @model.cid

      @model.bind 'change', @render

      @render()

      @el.dialog("open")
      @editor.refresh()

    render: =>
      @$("input[name=name]").val @model.get("name")

      return this

    updateName: (event) =>
      @model.set
        name: @$("input[name=name]").val()

      @model.save()

    saveSource: =>
      @model.set
        source: @editor.getValue()

      @model.save()

    events:
      "change [name=name]": "updateName"
      "keyup [name=name]": "updateName"
      "click button.save": "saveSource"

  # Shared lookup to keep track of editor instances
  scriptEditors = {}

  Views.ScriptEditor.editorFor = (model) ->
    if existingEditor = scriptEditors[model.id]
      existingEditor
    else
      scriptEditors[model.id] = new Views.ScriptEditor
        model: model
