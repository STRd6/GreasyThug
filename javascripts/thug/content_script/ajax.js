(function() {
  var __slice = Array.prototype.slice;

  window.namespace = function(target, name, block) {
    var item, top, _i, _len, _ref, _ref2;
    if (arguments.length < 3) {
      _ref = [(typeof exports !== 'undefined' ? exports : window)].concat(__slice.call(arguments)), target = _ref[0], name = _ref[1], block = _ref[2];
    }
    top = target;
    _ref2 = name.split('.');
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      item = _ref2[_i];
      target = target[item] || (target[item] = {});
    }
    return block(target, top);
  };

}).call(this);
(function() {

  namespace("Thug.ContentScript", function(ContentScript) {
    return ContentScript.log = function() {
      return console.log.apply(console, arguments);
    };
  });

}).call(this);
(function() {

  namespace("Thug.ContentScript", function(ContentScript) {
    var log,
      _this = this;
    log = ContentScript.log;
    return Object.extend(ContentScript, {
      ajax: function(settings) {
        log("ajax SENDING:", settings);
        return chrome.extension.sendRequest({
          action: "ajax",
          settings: settings
        }, function(response) {
          log("ajax RECEIVING:", response);
          if (response.success) {
            if (settings.success) {
              return settings.success(response.data, response.textStatus, response.XMLHttpRequest);
            }
          } else if (response.error) {
            if (settings.error) {
              return settings.error(response.XMLHttpRequest, response.textStatus, response.errorThrown);
            }
          }
        });
      },
      get: function(url, data, callback, type) {
        if ($.isFunction(data)) {
          type = type || callback;
          callback = data;
          data = {};
        }
        return _this.ajax({
          type: "GET",
          url: url,
          data: data,
          success: callback,
          dataType: type
        });
      },
      getJSON: function(url, data, callback) {
        return _this.ajax({
          data: data,
          dataType: 'json',
          success: callback,
          url: url
        });
      },
      post: function(url, data, callback, type) {
        if ($.isFunction(data)) {
          type = type || callback;
          callback = data;
          data = {};
        }
        return _this.ajax({
          type: "POST",
          url: url,
          data: data,
          success: callback,
          dataType: type
        });
      }
    });
  });

}).call(this);
