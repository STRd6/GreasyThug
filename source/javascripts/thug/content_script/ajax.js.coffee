#= require lib/namespace

#= require ./log

namespace "Thug.ContentScript", (ContentScript) ->
  log = ContentScript.log

  Object.extend ContentScript,
    ajax: (settings) ->
      log "ajax SENDING:", settings

      chrome.extension.sendRequest
        action: "ajax"
        settings: settings
      , (response) ->
        log "ajax RECEIVING:", response

        if response.success
          if settings.success
            settings.success(response.data, response.textStatus, response.XMLHttpRequest)

        else if response.error
          if settings.error
            settings.error(response.XMLHttpRequest, response.textStatus, response.errorThrown)

    get: (url, data, callback, type) =>
      # shift arguments if data argument was omited
      if $.isFunction(data))
        type = type || callback
        callback = data
        data = {}

      return @ajax
        type: "GET"
        url: url
        data: data
        success: callback
        dataType: type

    getJSON: (url, data, callback) =>
      return @ajax
        data: data,
        dataType: 'json'
        success: callback
        url: url

    post: (url, data, callback, type) =>
      # shift arguments if data argument was omited
      if $.isFunction(data))
        type = type || callback
        callback = data
        data = {}

      return @ajax
        type: "POST"
        url: url
        data: data
        success: callback
        dataType: type
