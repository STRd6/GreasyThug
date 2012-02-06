#= require lib/namespace

namespace "Thug.ContentScript", (ContentScript) ->
  ContentScript.log = ->
    #TODO Maybe generalize this to consolidate logging on the page and background page
    #TODO Optional logging level, and respect logging configuration
    console.log.apply console, arguments
