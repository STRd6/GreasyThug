// Default Configuration
localStorage.autoshow = 0;
localStorage.autorun = 1;
localStorage.logging = 1;
localStorage.display_remote_scripts = 0;

function get(key, callback) {
  callback(localStorage[key]);
}

function publish(script, callback) {
  var dataObj = {};
  var whitelist = ["code", "domain", "title"];

  $.each(script, function(key, value) {
    if(whitelist.indexOf(key) >= 0) {
      dataObj["script["+key+"]"] = value;
    }
  });

  $.post("http://" + remoteScriptDomain + "/scripts", dataObj, callback);
}

Scorpio.init();

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    var source = sender.tab ? sender.tab.url : "extension";
    console.log(source);
    console.log(request);

    if (request.action == "set") {
      localStorage[request.key] = request.value;
      sendResponse({key: request.key, value: request.value});
    } else if (request.action == "get") {
      sendResponse({key: request.key, value: localStorage[request.key]});
    } else if (request.action == "proxy") {
      $.getJSON(request.data.url, function(data) {
        sendResponse(data);
      });
    } else if (request.action == "publish") {
      publish(request.script, function(data, status) {
        sendResponse({data: data, status: status});
      });
    } else if (request.action == "db") {
      if (request.method == "update" || request.method == "destroy") {
        Scorpio[request.table][request.method](request.id, request.data, function(data) {
          sendResponse(data);
        });
      } else {
        Scorpio[request.table][request.method](request.data, function(data) {
          sendResponse(data);
        });
      }
    } else if(request.action == "GM_xmlhttpRequest") {
      var options = request.details;
      $.ajax({
        beforeSend: function(XMLHttpRequest) {
          $.each(options.headers || {}, function(header, value) {
            XMLHttpRequest.setRequestHeader(header, value);
          });
        },
        data: options.data,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          sendResponse({
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
          sendResponse({
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
    }
  }
);

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendRequest(tab.id, {action: "toggle"});
});
