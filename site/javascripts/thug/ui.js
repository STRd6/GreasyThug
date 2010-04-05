var UI = (function() {
  var imgURL = chrome.extension.getURL("") + "stylesheets/dark-hive/images/"
  var backgroundImage = "url(" + imgURL + "ui-icons_ffffff_256x240.png)";

  return {

    Button: function UI_button(text, callback) {
      var button = $("<button />");
      button.text(text);
      button.click(callback);

      return button;
    },

    Checkbox: function UI_checkbox(checked, toggle) {
      var checkbox = $("<input type='checkbox' />");

      checkbox.attr("checked", checked != 0);

      checkbox.change(function() {
        toggle($(this).attr("checked"));
      });

      return checkbox;
    },

    Confirm: function UI_confirm(message, accept, reject) {
      if(confirm(message)) {
        if(accept) {
          return accept();
        }
      } else {
        if(reject) {
          return reject();
        }
      }
    },

    List: function UI_list(orderChanged) {
      var list = $("<ul />");

      list.sortable({
        stop: function() {
          if(orderChanged) {
            orderChanged($(this));
          }
        }
      });

      return list;
    },

    Window: function UI_window(title, options) {
      options = options || {};
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
      
      var close = $("<a class='icon close' href='#'>X</a>")
        .click(function() {
          window.hide();
          return false;
        })
        .css({
          backgroundImage: backgroundImage
        })
      ;
      
      var toggle = $("<a class='icon toggle' href='#'>_</a>")
        .click(function() {
          content.slideToggle();
          return false;
        }).css({
          backgroundImage: backgroundImage
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
