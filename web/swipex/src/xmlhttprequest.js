export function getData(address) {
  // create a new XMLHttpRequest
  var xhr = new XMLHttpRequest();

  // get a callback when the server responds
  xhr.addEventListener("load", () => {
    // update the state of the component with the result here
    console.log("SUCCESS");
    console.log(xhr.responseText);
    return xhr.responseText;
  });
  // open the request with the verb and the url
  xhr.open("GET", `https://${address}`);
  // send the request
  xhr.send();
}

export function postData(address, data_dict) {
  // create a new XMLHttpRequest
  var xhr = new XMLHttpRequest();

  // get a callback when the server responds
  xhr.addEventListener("load", () => {
    // update the state of the component with the result here
    console.log("SUCCESS");
    console.log(xhr.responseText);
    return xhr.responseText;
  });
  // open the request with the verb and the url
  xhr.open('POST', `https://${address}`);
  // send the request
  xhr.send(JSON.stringify({data_dict}));
}
