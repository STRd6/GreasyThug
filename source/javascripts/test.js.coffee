#= require content_script

$ ->
  $ "<button>",
    click: displayControlPanel
    text: "Open"
  .button()
  .appendTo "body"
