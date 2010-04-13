var CommandHistory = function(store) {
  var commandHistory;
  var historyIndex; 
  
  store.loadHistory(function(history) {
    commandHistory = history;
    historyIndex = commandHistory.length;
  });
  
  function get(index) {
    index = index % commandHistory.length;
    if(index < 0) {
      index += commandHistory.length;
    }
    
    return commandHistory[index];
  }
    
  return {
    /** Adds an entry to the history and to the persistent storage */
    add: function(entry) {
      historyIndex = commandHistory.push(entry);
      store.storeHistory(entry);
    },
    
    /** Return the command at the given index, cycles around when negative */
    get: get,
    
    last: function() {
      return get(commandHistory.length - 1);
    },
    
    /** Loads the next or previous history entry into the console in 
     * response to the up or down arrow key being pressed.
     */
    arrowKeyEvent: function(event, console) {
      var originalIndex = historyIndex;
      
      if (event.keyCode == 38) {
        historyIndex -= 1;
      } else if (event.keyCode == 40) {
        historyIndex += 1;
      }
      
      if(historyIndex != originalIndex) {
        console.input.val(get(historyIndex));
      }
    },
    
    changeConsoleCommand: function(delta, console) {
      historyIndex += delta;
      
      console.input.val(get(historyIndex));
    }
  };
};
