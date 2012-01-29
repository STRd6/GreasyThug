#= require lib/namespace

#= require ./log

namespace "Thug.ContentScript", (ContentScript) ->
  log = ContentScript.log

  ContentScript.Util =
    # Set a shared value across all scripts in the background page's storage
    setVal: (key, value) ->
      chrome.extension.sendRequest
        action: "set"
        key: key
        value: value
      , (response) ->
        log(response)
    # Get a shared value across all scripts from the background page's storage
    getVal: (key, callback) ->
      chrome.extension.sendRequest
        action: "get"
        key: key
      , (response) ->
        log(response)

        callback(response.value)
