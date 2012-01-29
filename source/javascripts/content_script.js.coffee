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

controlPanel = null
window.displayControlPanel = ->
  unless controlPanel
    controlPanel = Pixie.Window
      title: "Control Panel"

    consoleButton = $ "<button>",
      text: "Console"
      click: displayConsoleWindow
    .button()

    controlPanel.find(".content").append(
      consoleButton
    )

  controlPanel.dialog('open')

chrome.extension?.onRequest.addListener (request, sender, sendResponse) ->
  if(request.action == "toggle")
    displayControlPanel()
