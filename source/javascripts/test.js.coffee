#= require thug/console

$ ->
  test "a basic test example", ->
    ok true, "this test is fine"
    value = "hello"
    equals "hello", value, "We expect value to be hello"

  Pixie.Console().appendTo("body")
