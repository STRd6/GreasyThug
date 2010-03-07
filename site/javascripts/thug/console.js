/**
* This controls the interactive console for testing the Grease
*/
var IJC = function() {

  function processSuccess(command, result, self) {
    // Clear Input
    input.val('');
    
    // Display output
    puts(command);
    puts(' => ' + result);
  }

  // Private Variables
  var callbacks = {keydown: [], command: [processSuccess]};
  
  var handle = $("<div class='handle'>Interactive JavaScript Console</div>");
  var output = $("<div class='outputBuffer'></div>");
    
  var puts = function(text) {
    output.append(document.createTextNode(text));
    output.append('<br />');
    // Scroll to bottom
    output[0].scrollTop = output[0].scrollHeight;
  };
  
  var input = $("<input type='text' />")
    .keydown(function(event) {
      $.each(callbacks['keydown'], function(index, callback) {
        callback(event, self);
      });
    });
    
  var form = $("<form action='#' method='get'></form>")
    .append(input)
    .append($("<input type='submit' value='Go'/>"));
  
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

  var chasis = $("<div class='ijc' id='strd6-GreasyThugConsole'></div")
    .append(handle)
    .append(output)
    .append(form)
    .fadeTo("fast", 0.75)
    .resizable()
    .draggable({
      handle: ".handle",
      stop: function() {
        Scorpio.storeConfig({
          left: $( this ).css('left'),
          top: $( this ).css('top')
        });
      }
    }).css("position", "absolute");

  var self = {
    attach: function(left, top) {
      $("body").append( chasis
        .css({
          'top': top, 
          'left': left
        })
      );
    }, 
    
    element: chasis,
    
    input: input,
    
    registerCallback: function(event, callback) {
      if(callbacks[event] != null) {
        callbacks[event].push(callback);
      }
    }
  };
  
  return self;
};
