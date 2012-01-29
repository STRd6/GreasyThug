#= require lib/jquery-1.7.1.min

#= require lib/namespace

namespace "Thug.Background", (Background) ->
  Background.ajax = (settings, sendResponse) ->
    Object.extend settings,
      error: (XMLHttpRequest, textStatus, errorThrown) ->
        sendResponse
          error: true
          errorThrow: errorThrown
          textStatus: textStatus
          XMLHttpRequest: XMLHttpRequest
      success: (data, textStatus, XMLHttpRequest) ->
        sendResponse
          data: data
          success: true
          textStatus: textStatus
          XMLHttpRequest: XMLHttpRequest

    $.ajax(settings)
