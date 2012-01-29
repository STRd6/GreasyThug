#= require lib/jquery-1.7.1.min
#= require lib/jquery-ui-1.8.17.custom.min
#= require lib/corelib

#= require ./thug/console
#= require ./thug/window

#= require_tree ./thug/models
#= require_tree ./thug/views

{Models, Views, Window} = Thug

scripts = new Models.ScriptCollection
scripts.fetch()

consoleWindow = null
displayConsoleWindow = ->
  unless consoleWindow
    consoleWindow = Window
      title: "Script Console"

    console = Thug.Console()
    console.addAction
      name: "save"
      perform: (console) ->
        scripts.create
          source: console.val()
          order: scripts.length

    console.appendTo(consoleWindow.find(".content"))

  consoleWindow.dialog('open')

controlPanel = null
window.displayControlPanel = ->
  unless controlPanel
    controlPanel = Window
      title: "Control Panel"

    consoleButton = $ "<button>",
      text: "Console"
      click: displayConsoleWindow
    .button()

    scriptsButton = $ "<button>",
      text: "Scripts"
      click: displayScriptsWindow
    .button()

    controlPanel.find(".content").append(
      consoleButton,
      scriptsButton
    )

  controlPanel.dialog('open')

scriptsWindow = null
displayScriptsWindow = ->
  unless scriptsWindow
    scriptsWindow = Window
      title: "Scripts"

    scriptList = new Views.ScriptList
      collection: scripts

    scriptsWindow.find(".content").append scriptList.el

  scriptsWindow.dialog('open')

chrome.extension?.onRequest.addListener (request, sender, sendResponse) ->
  if(request.action == "toggle")
    displayControlPanel()
