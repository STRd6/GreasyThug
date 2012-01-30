#= require lib/namespace

#= require ../view
#= require ../models/script
#= require ./script_list_item

namespace "Thug.Views", (Views) ->
  Models = Thug.Models

  class Views.ScriptList extends Thug.View
    className: 'scripts'
    tagName: 'ul'

    _itemViewClass: Views.ScriptListItem

    initialize: ->
      super

      @collection.bind 'add', @render
      @collection.bind 'change', @render
      @collection.bind 'remove', @render

      @_viewCache = {}

      @el.sortable
        axis: 'y'
        scroll: false

        update: (event, ui) =>
          @$("li").each (i, li) =>
            cid = $(li).data("cid")
            debugger unless cid?
            @collection.getByCid(cid).set order: i

            # Persist new ordering
            @collection.each (model) ->
              model.save()

      @render()

    render: =>
      @el.empty

      @collection.each (item) =>
        @appendItem(item)

      return this

    appendItem: (item) ->
      unless itemView = @_viewCache[item.cid]
        itemView = @_viewCache[item.cid] = new @_itemViewClass
          model: item

      @el.append itemView.render().el

    editScript: (event) ->
      if cid = $(event.currentTarget).data('cid')
        item = @collection.getByCid(cid)

        Thug.Views.ScriptEditor.editorFor item

    events:
      "dblclick .script": "editScript"
