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

  namespace("Thug.Background", function(Background) {
    return Background.GM_xmlhttpRequest = function(options, callback) {
      return $.ajax({
        beforeSend: function(XMLHttpRequest) {
          return $.each(options.headers || {}, function(header, value) {
            return XMLHttpRequest.setRequestHeader(header, value);
          });
        },
        data: options.data,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          return callback({
            error: true,
            data: {
              status: XMLHttpRequest.status,
              statusText: XMLHttpRequest.statusText,
              readyState: XMLHttpRequest.readyState,
              responseHeaders: XMLHttpRequest.getAllResponseHeaders(),
              responseText: XMLHttpRequest.responseText
            }
          });
        },
        method: options.method,
        success: function(data, textStatus, XMLHttpRequest) {
          return callback({
            success: true,
            data: {
              status: XMLHttpRequest.status,
              statusText: XMLHttpRequest.statusText,
              readyState: XMLHttpRequest.readyState,
              responseHeaders: XMLHttpRequest.getAllResponseHeaders(),
              responseText: XMLHttpRequest.responseText
            }
          });
        },
        url: options.url
      });
    };
  });

}).call(this);
