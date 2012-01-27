#= require pixie/console
#= require pixie/window

$ ->
  test "a basic test example", ->
    ok true, "this test is fine"
    value = "hello"
    equals "hello", value, "We expect value to be hello"

  consoleWindow = Pixie.Window
    title: "Script Console"

  Pixie.Console().appendTo(consoleWindow.find(".content"))

  consoleWindow.dialog('open')
