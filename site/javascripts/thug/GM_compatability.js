function GM_xmlhttpRequest(details) {
  if(logging) {
    console.log("GM_xmlhttpRequest SENDING:");
    console.log(details);
  }

  chrome.extension.sendRequest({action: "GM_xmlhttpRequest", details: details}, function(response) {
    if(logging) {
      console.log("GM_xmlhttpRequest RECEIVING:");
      console.log(response);
    }

    if(response.success) {
      if(details.onload) {
        details.onload(response.data);
      }
    } else if(response.error) {
      if(details.onerror) {
        details.onerror(response.data);
      }
    }
  });
}
