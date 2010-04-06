/**
* This controls the interactive console for testing the Grease
*/
var IJC = function() {
  var TITLE = "Greasy Thug Console";

  function processSuccess(command, result, self) {
    // Clear Input
    input.val('');
    
    // Display output
    puts(command);
    puts(' => ' + result);
  }

  // Private Variables
  var callbacks = {keydown: [], command: [processSuccess]};

  var uiWindow = UI.Window(TITLE, {
    dragStop: function() {
      Scorpio.storeConfig({
        left: $( this ).css('left'),
        top: $( this ).css('top')
      });
    }}
  );
  var output = $("<pre class='outputBuffer'></pre>");

  var puts = function(text) {
    output.append(document.createTextNode(text));
    output.append('<br />');
    // Scroll to bottom
    output[0].scrollTop = output[0].scrollHeight;
  };

  var input = $("<textarea />")
    .keydown(function(event) {
      $.each(callbacks['keydown'], function(index, callback) {
        callback(event, self);
      });
    });
    
  var form = $("<form action='#' method='get'></form>")
    .append(input)
    .append($("<input class='execute' type='submit' value='Execute'/>"));
  
  form.submit( function() {
    var result = '';
    
    // Read Input
    var commandBuffer = input.val();
    
    // Execute
    try {
      result = eval(commandBuffer + ';');
      
      // Run Callbacks
      $.each(callbacks['command'], function(index, callback) {
        callback(commandBuffer, result, self);
      });
    } catch(e) {
      result = e.message;
      puts(result);
    }
    
    // Cancel default form behavior
    return false;
  });

  uiWindow
    .addChild(output)
    .addChild(form)
  ;

  var self = {
    attach: function(left, top) {
      $("body").append( uiWindow
        .css({
          'top': top, 
          'left': left
        })
      );
    }, 
    
    element: uiWindow,

    input: input,

    puts: puts,
    
    registerCallback: function(event, callback) {
      if(callbacks[event] != null) {
        callbacks[event].push(callback);
      }
    }
  };
  
  return self;
};
