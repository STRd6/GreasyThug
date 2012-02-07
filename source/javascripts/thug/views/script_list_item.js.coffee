#= require lib/namespace

#= require ../confirm

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
      @el.empty()

      nameSpan = $("<span>",
        class: "name"
        text: @model.get("name")
      )

      nameSpan.prepend $("<input>",
        type: "checkbox"
        name: "autoexec"
        title: "Autoexec"
      ).prop("checked", @model.get("autoexec"))

      @el.append nameSpan

      @el.append $("<button>",
        text: "Delete"
        click: =>
          Thug.Confirm
            title: "Delete #{@model.get 'name'}?"
            text: "Are you sure you want to delete this script?"
            confirm: =>
              @model.destroy()
      ).button
        text: false
        icons:
          primary: "ui-icon-closethick"

      return this

    updateAutoexec: (event) =>
      @model.set
        autoexec: event.currentTarget.checked

      @model.save()

    events:
      "change [name=autoexec]": "updateAutoexec"
