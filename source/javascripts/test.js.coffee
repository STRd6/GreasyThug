#= require lib/jquery-1.7.1.min
#= require lib/jquery-ui-1.8.17.custom.min.js

#= require lib/jquery.hotkeys

#= require lib/corelib
#= require lib/namespace

#= require pixie/console
#= require pixie/window

$ ->
  consoleWindow = Pixie.Window
    title: "Script Console"

  Pixie.Console().appendTo(consoleWindow.find(".content"))

  consoleWindow.dialog('open')

  $ "<button>",
    click: ->
      consoleWindow.dialog('open')
    text: "Open"
  .button()
  .appendTo "body"

