/*global
  $, chrome, window,
  intercept
*/

var UI = (function() {
  var imgURL = chrome.extension.getURL("") + "stylesheets/dark-hive/images/";
  var backgroundImage = "url(" + imgURL + "ui-icons_ffffff_256x240.png)";
  var zMax = 0;

  function ensureOptions(method) {
    return function(arg1, arg2) {
      if(arg2 === undefined) {
        return method(arg1, {});
      } else {
        return method(arg1, arg2);
      }
    };
  }

  function ensureOptionsAndCallback(method) {
    return function(arg1, arg2, arg3) {
      if(typeof(arg2) == "function") {
        return method(arg1, {}, arg2);
      } else {
        return method(arg1, arg2, arg3);
      }
    };
  }

  function applyOptions(elem, options) {
    elem
      .addClass(options["class"])
    ;

    if(options.title !== undefined) {
      elem.attr("title", options.title);
    }

    return elem;
  }

  return {

    Button: ensureOptionsAndCallback(function UI_button(text, options, callback) {
      var button = $("<button />");
      button.text(text);
      button.click(callback);

      return applyOptions(button, options);
    }),

    Checkbox: function UI_checkbox(checked, toggle) {
      var checkbox = $("<input type='checkbox' />");

      checkbox.attr("checked", checked != "0");

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

    Span: ensureOptions(function UI_span(text, options) {
      var span = $("<span />");

      span.text(text);

      return applyOptions(span, options);
    }),

    Window: ensureOptions(function UI_window(titleText, options) {
      function raise() {
        window.css("zIndex", zMax);
        zMax += 1;
      }

      var dragStop = options.dragStop || function(){};

      var title = UI.Span(titleText, {"class": "title"});
      var handle = $("<div class='handle' />").append(title);

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
        .mousedown(function() {
          raise();
        })
      ;

      raise();

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

      return $.extend(window, {
        addChild: function(element) {
          content.append(element);
          return this;
        },

        raise: raise,

        show: intercept(window.show, function() {
          raise();
        }),

        title: function(newTitle) {
          if(newTitle === undefined) {
            return title.text();
          } else {
            title.text(newTitle);
            return window;
          }
        },

        toggle: intercept(window.toggle, function() {
          raise();
        })
      });
    })
  };
}());
