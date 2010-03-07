// Default Configuration
localStorage["autoshow"] = 0;
localStorage["autorun"] = 1;

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
    }
  }
);

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendRequest(tab.id, {action: "toggle"});
});
