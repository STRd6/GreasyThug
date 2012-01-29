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

    render: ->
      @el.text @model.get("name")

      return this
