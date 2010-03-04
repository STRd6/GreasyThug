chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    var source = sender.tab ?
      sender.tab.url :
      "extension";
    if (request.greeting == "hello") {
      sendResponse({farewell: source});
    } else {
      sendResponse({}); // snub them.
    }
  }
);
