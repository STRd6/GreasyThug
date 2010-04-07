/**
 * Functions to get and set values from the background page's local storage
 */
function set(key, value) {
  chrome.extension.sendRequest({action: "set", key: key, value: value}, function(response) {
    if(logging) {
      console.log(response);
    }
  });
}

function get(key, callback) {
  chrome.extension.sendRequest({action: "get", key: key}, function(response) {
    if(logging) {
      console.log(response);
    }

    callback(response.value);
  });
}

function proxy(data, callback) {
  if(logging) {
    console.log("PROXY SENDING:");
    console.log(data);
  }

  chrome.extension.sendRequest({action: "proxy", data: data}, function(response) {
    if(logging) {
      console.log("PROXY RECEIVING:");
      console.log(response);
    }

    callback(response);
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
  script.domain = getCurrentDomain();

  var requestData = {
    action: "publish",
    script: script
  }

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
}

function BackgrondDBTableInterface(table) {
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
    }
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
  }
}
