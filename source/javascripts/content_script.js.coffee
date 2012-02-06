#= require lib/jquery-1.7.1.min
#= require lib/jquery-ui-1.8.17.custom.min
#= require lib/corelib

#= require ./thug/console
#= require ./thug/window

#= require_tree ./thug/models
#= require_tree ./thug/views

{Models, Views, Window} = Thug

scripts = new Models.ScriptCollection
scripts.fetch
  success: (collection) ->
    # Execute the scripts marked for execution
    collection.each (script) ->
      if script.get "autoexec"
        script.run()

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
          autoexec: true
          source: console.val()
          order: scripts.length

        displayScriptsWindow()

    console.appendTo(consoleWindow)

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

    controlPanel.append(
      consoleButton,
      scriptsButton
    )

  controlPanel.dialog('open')

scriptsWindow = null
displayScriptsWindow = ->
  unless scriptsWindow
    scriptsWindow = Window
      title: "Scripts"
      resizable: true

    scriptList = new Views.ScriptList
      collection: scripts

    scriptsWindow.append scriptList.el

  scriptsWindow.dialog('open')

chrome.extension?.onRequest.addListener (request, sender, sendResponse) ->
  if(request.action == "toggle")
    displayControlPanel()
