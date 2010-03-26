var UI = (function() {
  var imgURL = chrome.extension.getURL("") + "stylesheets/dark-hive/images/"

  return {

    button: function UI_button(text, callback) {
      var button = $("<button />");
      button.text(text);
      button.click(callback);
      
      return button;
    },

    window: function UI_window(title, options) {
      var dragStop = options.dragStop || function(){};
    
      var handle = $("<div class='handle' />")
        .text(title)
      ;
      
      var content = $("<div class='content' />");
      
      var window = $("<div class='strd6-window' />")
        .append(handle)
        .append(content)
        .draggable({
          handle: ".handle",
          stop: dragStop
        })
        .css({ // TODO Load co-ordinates
          left: 0,
          position:"fixed",
          top: 0
        })
      ;
      
      var close = $("<a class='window-control' href='#'>X</a>")
        .click(function() {
          window.hide();
          return false;
        })
      ;
      
      var toggle = $("<a class='window-control' href='#'>_</a>")
        .click(function() {
          content.slideToggle();
          return false;
        })
      ;
      
      handle.append(close).append(toggle);
      
      window.addChild = function(element) {
        content.append(element);
        return this;
      }
      
      return window;
    }
  }
})();
