#= require lib/namespace

#= require lib/underscore
#= require lib/backbone
#= require lib/backbone.localStorage

#= require ../settings

namespace "Thug.Models", (Models) ->
  store = new Store("#{Thug.APP_NAMESPACE}/scripts")

  class Models.Script extends Backbone.Model
    defaults:
      name: "Untitled Script"
      source: ""
      order: 0

  class Models.ScriptCollection extends Backbone.Collection
    model: Models.Script
    localStorage: store
    comparator: (item) ->
      return item.get "order"
