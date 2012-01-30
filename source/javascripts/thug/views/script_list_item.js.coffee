#= require lib/namespace

#= require ../view
#= require ../models/script

namespace "Thug.Views", (Views) ->
  Models = Thug.Models

  class Views.ScriptListItem extends Thug.View
    className: 'script'
    tagName: 'li'

    initialize: ->
      super

      @el.attr "data-cid", @model.cid

      @model.bind 'change', @render

      @render()

    render: =>
      @el.text @model.get("name")

      @el.prepend $("<input>",
        type: "checkbox"
        name: "autoexec"
      ).prop("checked", @model.get("autoexec"))

      return this

    updateAutoexec: (event) =>
      @model.set
        autoexec: event.currentTarget.checked

      @model.save()

    events:
      "change [name=autoexec]": "updateAutoexec"
