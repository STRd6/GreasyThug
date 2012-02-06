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
    var log;
    log = ContentScript.log;
    return ContentScript.Util = {
      setVal: function(key, value) {
        return chrome.extension.sendRequest({
          action: "set",
          key: key,
          value: value
        }, function(response) {
          return log(response);
        });
      },
      getVal: function(key, callback) {
        return chrome.extension.sendRequest({
          action: "get",
          key: key
        }, function(response) {
          log(response);
          return callback(response.value);
        });
      }
    };
  });

}).call(this);
