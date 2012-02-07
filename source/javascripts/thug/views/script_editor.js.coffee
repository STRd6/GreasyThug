#= require lib/namespace

#= require ../view
#= require ../models/script

namespace "Thug.Views", (Views) ->
  Models = Thug.Models

  evalContext = eval

  class Views.ScriptEditor extends Backbone.View
    className: 'script'
    tagName: 'li'

    initialize: ->
      @el = Thug.Window
        title: "Edit Script"
        resizable: true

      # We constructed the view element manually, attach events
      @delegateEvents()

      actions = $ "<div>",
        class: "actions"

      actions.append $("<input type=text name=name>")
      actions.append $("<button>",
        class: "run"
        text: "Run"
      ).button()
      actions.append $("<button>",
        class: "save"
        text: "Save"
      ).button()

      @el.append actions

      input = $("<input type=textarea>")

      @el.append input

      # TODO: Consolidate editor creation between here and console
      @editor = new CodeMirror.fromTextArea input.get(0),
        lineNumbers: true
        tabMode: "shift"
        textWrapping: false
        onKeyEvent: (editor, e) ->
          # Keep other things on the host page from triggering / preventing default behavior
          $.event.fix(e).stopPropagation()

          return undefined

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

    runCode: =>
      try
        compiledCommand = CoffeeScript.compile @editor.getValue(), bare: on

        result evalContext(compiledCommand)

      catch error
        result = error.message

      # TODO Centralize code running in correct context
      # TODO Display result

    events:
      "change [name=name]": "updateName"
      "keyup [name=name]": "updateName"
      "click button.save": "saveSource"
      "click button.run": "runCode"

  # Shared lookup to keep track of editor instances
  scriptEditors = {}

  Views.ScriptEditor.editorFor = (model) ->
    if existingEditor = scriptEditors[model.id]
      existingEditor.el.dialog("open").dialog("moveToTop")

      return existingEditor
    else
      scriptEditors[model.id] = new Views.ScriptEditor
        model: model
