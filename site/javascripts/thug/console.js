/**
* This controls the interactive console for testing the Grease
*/
var IJC = function() {
  var WIDTH = '300px';
  
  function processSuccess(command, result, self) {
    // Clear Input
    input.val('');
    
    // Display output
    puts(command);
    puts(' => ' + result);
  }

  // Private Variables
  var callbacks = {keydown: [], command: [processSuccess]};
  
  var handle = $("<div class='handle'>Interactive JavaScript Console</div>")
    .css({
      'width': "100%",
      'padding':'2px 4px',
      'background-color': '#222',
      'overflow': 'hidden'
    });
  
  var output = $("<div class='outputBuffer'></div>")
    .css({
      'padding': '4px',
      'height': '250px',
      'width': "100%",
      'overflow': 'auto'
    });
    
  var puts = function(text) {
    output.append(document.createTextNode(text));
    output.append('<br />');
    // Scroll to bottom
    output[0].scrollTop = output[0].scrollHeight;
  };
  
  var input = $("<input type='text' />")
    .css({
      'width': WIDTH
    })
    .keydown(function(event) {
      $.each(callbacks['keydown'], function(index, callback) {
        callback(event, self);
      });
    });
    
  var form = $("<form action='#' method='get'></form>")
    .css('padding', '2px')
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

  var chasis = $("<div class='ijc'></div")
    .append(handle)
    .append(output)
    .append(form)
    .css({
      'z-index': '1000',
      'position': 'absolute',
      'background-color': 'black',
      'color': 'green',
      'font-family': 'Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New',
      'font-weight': 'bold',
      'text-align': 'left'
    })
    .fadeTo("fast", 0.75)
    .draggable({
      handle: ".handle",
      stop: function() {
        Scorpio.storeConfig({
          left: $( this ).css('left'),
          top: $( this ).css('top')
        });
      }
    });

  var self = {
    attach: function(left, top) {
      $("body").append( chasis
        .css({
          'top': top, 
          'left': left
        })
      );
    }, 
    
    input: input,
    
    registerCallback: function(event, callback) {
      if(callbacks[event] != null) {
        callbacks[event].push(callback);
      }
    }
  };
  
  return self;
};
