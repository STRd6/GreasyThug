/**
 * Functions to get and set values from the background page's local storage
 */
function set(key, value) {
  chrome.extension.sendRequest({action: "set", key: key, value: value}, function(response) {
    console.log(response);
  });
}

function get(key, callback) {
  chrome.extension.sendRequest({action: "get", key: key}, function(response) {
    console.log(response);
    callback(response.value);
  });
}
