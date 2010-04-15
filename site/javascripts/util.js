/*global $, chrome, window, logging, requireLogin */

/**
 * Functions to get and set values from the background page's local storage
 */
function setVal(key, value) {
  chrome.extension.sendRequest({action: "set", key: key, value: value}, function(response) {
    if(logging) {
      console.log(response);
    }
  });
}

function getVal(key, callback) {
  chrome.extension.sendRequest({action: "get", key: key}, function(response) {
    if(logging) {
      console.log(response);
    }

    callback(response.value);
  });
}

function intercept(method, interception) {
  return function() {
    interception.apply(this, arguments);
    return method.apply(this, arguments);
  };
}

function ajax(settings) {
  if(logging) {
    console.log("ajax SENDING:");
    console.log(settings);
  }

  chrome.extension.sendRequest({action: "ajax", settings: settings}, function(response) {
    if(logging) {
      console.log("ajax RECEIVING:");
      console.log(response);
    }

    if(response.success) {
      if(settings.success) {
        settings.success(response.data, response.textStatus, response.XMLHttpRequest);
      }
    } else if(response.error) {
      if(settings.error) {
        settings.error(response.XMLHttpRequest, response.textStatus, response.errorThrown);
      }
    }
  });
}

function get(url, data, callback, type) {
  // shift arguments if data argument was omited
  if($.isFunction(data)) {
    type = type || callback;
    callback = data;
    data = {};
  }

  return ajax({
    type: "GET",
    url: url,
    data: data,
    success: callback,
    dataType: type
  });
}

function getJSON(url, data, callback) {
  return ajax({
    data: data,
    dataType: 'json',
    success: callback,
    url: url
  });
}

function post(url, data, callback, type) {
  // shift arguments if data argument was omited
  if($.isFunction(data)) {
    type = type || callback;
    callback = data;
    data = {};
  }

  return ajax({
    type: "POST",
    url: url,
    data: data,
    success: callback,
    dataType: type
  });
}

/**
 * Simple method to return the current domain. The domain
 * is how the HTML5 local storage is scoped, so it comes
 * in handy.
 */
function getCurrentDomain() {
  var href = window.location.href;
  var currentUrl = href.substring(href.indexOf('://') + 3);
  return currentUrl.substring(0, currentUrl.indexOf('/'));
}

function publish(script, callback) {
  requireLogin(function() {
    script.domain = getCurrentDomain();

    var requestData = {
      action: "publish",
      script: script
    };

    if(logging) {
      console.log("PUBLISH SENDING:");
      console.log(requestData);
    }

    chrome.extension.sendRequest(requestData, function(data, status) {
      if(logging) {
        console.log("PUBLISH RECEIVED:");
        console.log(status);
        console.log(data);
      }

      callback(data, status);
    });
  });
}

function BackgroundDBTableInterface(table) {
  function callBackgroundPageDB(method, id, data, callback) {
    var requestData = {
      action: "db",
      data: data,
      id: id,
      method: method,
      table: table
    };

    if(logging) {
      console.log("BACKGROUND TABLE INTERFACE " + table + ": is requesting");
      console.log(requestData);
    }

    chrome.extension.sendRequest(requestData, function(response) {
      if(logging) {
        console.log("BACKGROUND TABLE INTERFACE " + table + ": received");
        console.log(response);
      }

      callback(response);
    });
  }

  /**
   * Handles parssing of optional arguments that may appear before callback.
   * EX:
   *   all(options, callback)
   *   all(callback)
   */
  function optionPasser(method) {
    return function(arg1, arg2) {
      if(arg2 === undefined) {
        return method({}, arg1);
      } else {
        return method(arg1, arg2);
      }
    };
  }

  return {
    all: optionPasser(function(options, callback) {
      callBackgroundPageDB("all", null, options, callback);
    }),

    count: optionPasser(function(options, callback) {
      callBackgroundPageDB("count", null, options, callback);
    }),

    create: function(object, callback) {
      callBackgroundPageDB("create", null, object, callback);
    },

    destroy: function(id) {
      callBackgroundPageDB("destroy", id, null, function(){});
    },

    destroyAll: function() {
      callBackgroundPageDB("destroyAll", null, null, function(){});
    },

    find: function(id, callback) {
      callBackgroundPageDB("find", id, null, callback);
    },

    update: function(id, object) {
      callBackgroundPageDB("update", id, object, function(){});
    }
  };
}
