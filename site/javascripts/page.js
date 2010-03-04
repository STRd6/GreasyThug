//$('a').css({'background-color': 'yellow'});

Scorpio.init();
commandHistory = new CommandHistory(Scorpio);

var interactiveConsole = new IJC();

interactiveConsole.registerCallback('command', commandHistory.add)
interactiveConsole.registerCallback('keydown', commandHistory.arrowKeyEvent);

Scorpio.loadConfig(function(config) {
  console.log(config);
  interactiveConsole.attach(config.left || 0, config.top || 0);
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");

    alert(request.greeting);
});


/*
chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    port.postMessage({counter: msg.counter+1});
  });
});

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    sendResponse({counter: request.counter+1});
  }
);
*/

chrome.extension.sendRequest({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});
