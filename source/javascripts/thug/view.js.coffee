###*
A base view for our frontbone framework.
###

#= require lib/underscore
#= require lib/backbone
#= require lib/namespace

namespace "Thug", (Thug) ->
  class Thug.View extends Backbone.View
    initialize: ->
      # Force jQuery Element
      @el = $(@el)

    include: (module) ->
      Object.extend this, module(this, this)
