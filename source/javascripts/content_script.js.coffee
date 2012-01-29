#= require lib/jquery-1.7.1.min

#= require lib/corelib

#= require_tree ./pixie

consoleWindow = null

displayConsoleWindow = ->
  unless consoleWindow
    consoleWindow = Pixie.Window
      title: "Script Console"

    Pixie.Console().appendTo(consoleWindow.find(".content"))

  consoleWindow.dialog('open')

chrome.extension.onRequest.addListener (request, sender, sendResponse) ->
  if(request.action == "toggle")
    displayConsoleWindow()
