#= require lib/namespace

namespace "Thug.Background", (Background) ->
  Background.GM_xmlhttpRequest = (options, callback) ->
    $.ajax
      beforeSend: (XMLHttpRequest) ->
        $.each options.headers || {}, (header, value) ->
          XMLHttpRequest.setRequestHeader(header, value)
      data: options.data
      error: (XMLHttpRequest, textStatus, errorThrown) ->
        callback
          error: true
          data:
            status: XMLHttpRequest.status
            statusText: XMLHttpRequest.statusText
            readyState: XMLHttpRequest.readyState
            responseHeaders: XMLHttpRequest.getAllResponseHeaders()
            responseText: XMLHttpRequest.responseText
      method: options.method
      success: (data, textStatus, XMLHttpRequest) ->
        callback
          success: true
          data:
            status: XMLHttpRequest.status
            statusText: XMLHttpRequest.statusText
            readyState: XMLHttpRequest.readyState
            responseHeaders: XMLHttpRequest.getAllResponseHeaders()
            responseText: XMLHttpRequest.responseText
      url: options.url
