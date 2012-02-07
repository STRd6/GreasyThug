#= require lib/jquery-1.7.1.min

#= require thug/persistence
#= require thug/background/ajax
#= require thug/background/gm
#= require thug/background/log

{ajax, GM_xmlhttpRequest, log} = Thug.Background

# Default Configuration
localStorage.autoshow = 0
localStorage.autorun = 1
localStorage.logging = 0

getVal = (key, callback) ->
  callback(localStorage[key])

chrome.extension.onRequest.addListener (request, sender, sendResponse) ->
    source = if sender.tab?
      sender.tab.url
    else
      "extension"

    log(source)
    log(request)

    if (request.action == "set")
      localStorage[request.key] = request.value
      sendResponse
        key: request.key
        value: request.value
    else if (request.action == "get")
      sendResponse
        key: request.key
        value: localStorage[request.key]
    else if(request.action == "ajax")
      ajax(request.settings, sendResponse)
    else if(request.action == "GM_xmlhttpRequest")
      GM_xmlhttpRequest(request.details, sendResponse)

chrome.browserAction.onClicked.addListener (tab) ->
  chrome.tabs.sendRequest tab.id,
    action: "toggle"
