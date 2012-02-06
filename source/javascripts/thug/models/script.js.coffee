#= require lib/namespace

#= require lib/underscore
#= require lib/backbone
#= require lib/backbone.localStorage

#= require lib/coffee-script

#= require ../settings

#= require ../content_script/log

namespace "Thug.Models", (Models) ->
  store = new Store("#{Thug.APP_NAMESPACE}/scripts")

  log = Thug.ContentScript.log

  class Models.Script extends Backbone.Model
    defaults:
      name: "Untitled Script"
      source: ""
      order: 0
      autoexec: 0

    run: (evalContext) =>
      source = @get("source")

      try
        compiledSource = CoffeeScript.compile source, bare: on

        return (evalContext || eval) compiledSource
      catch error
        log error

        return error

    save: =>
      super

      log "Saved: ", this

  class Models.ScriptCollection extends Backbone.Collection
    model: Models.Script
    localStorage: store
    comparator: (item) ->
      return item.get "order"
