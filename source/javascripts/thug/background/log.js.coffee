#= require lib/namespace

namespace "Thug.Background", (Background) ->
  Background.log = ->
    #TODO Maybe put this log in a place where you can access it?
    #TODO Optional logging level, and respect logging configuration
    console.log.apply null, arguments
