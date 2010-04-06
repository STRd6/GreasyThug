// Default Configuration
localStorage["autoshow"] = 0;
localStorage["autorun"] = 1;
localStorage["logging"] = 1;

function get(key, callback) {
  callback(localStorage[key]);
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
    }
  }
);

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendRequest(tab.id, {action: "toggle"});
});
