#= require lib/namespace

#= require ../view
#= require ../models/script
#= require ./script_list_item

#= require ../content_script/log

namespace "Thug.Views", (Views) ->
  Models = Thug.Models

  log = Thug.ContentScript.log

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
        distance: 20

        update: (event, ui) =>
          @$("li").each (i, li) =>
            cid = $(li).data("cid")
            debugger unless cid?
            @collection.getByCid(cid).save
              order: i
            ,
              silent: true

      @render()

    render: =>
      @el.empty()

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
