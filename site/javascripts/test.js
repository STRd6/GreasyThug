/*global
  $,
  ok, test, equals,
  Scorpio
*/

$(function() {
  test("a basic test example", function() {
    ok( true, "this test is fine" );
    var value = "hello";
    equals( "hello", value, "We expect value to be hello" );
  });
  
  Scorpio.reset();
  
  Scorpio.scripts.count( function(count) {
    test("Creation", function() {
      equals(0, count);
    });
  });
  
  Scorpio.scripts.create({title: "Test", code: "alert('test');"});
  
  Scorpio.scripts.count( function(count) {
    test("Creation", function() {
      equals(1, count);
    });
  });
});

