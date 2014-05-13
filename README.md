# JiffyIron
## WUT R YOO
JiffyIron is a proof of concept for stealthy exfiltration of browsing activity using Google Chrome and a simple Chrome extension. 

## Ok uh, why?
Chrome extensions and the Chrome Web Store are filled with apps and extensions with various uses - some useful, many not so much. This project aims to explore the resources granted to a Chrome extension when installed. Although JiffyIron focuses on the possible subverted actions by an extension, any small amount of superficial/user-valued functionality would easily serve as a cover-up to masqureade as an honest add-on (for instance, in the web store). In short, this project mainly pokes around at Chrome's Content Security Policy and extension capabilities to show a devestating flow of plauibly sensitive information into an attacker's possesion.

## WHO AM I?
- Jase Hannah, and this is an assignment for cs460: security lab
- rhannah2@illinois.edu
- UIUC

## Dependencies
- Server: Python 2.7.6
- Extension: Google Chrome (created mostly on version 34+)

## Pieces
### src/
- top directory for the main extension

#### src/crypto
- JavaScript lib for RSA encryption (see sources)

#### src/html
- `popup.html`: miniture html page to display when the extension icon is clicked
- `background.html`: background scripts central call-point

#### src/img
- motivational coffee photo and extension icons.

#### src/js
- `background.js`: main background script, data relay point
- `content.js`: runs once on each document loaded in chrome (restricted to http and https protocols)
- `jquery-2.1.1.min.js`: because, jQuery.

### src.min/
- minified src

### server/
- `server.py`: main server for receiving rubbernecking data. stores received data into server/data/[victim-IP]
- `viewer.html/.js/.css`: decrypting environment to read stolen data in files.
- `rsatest.js`: helper javascript for the viewer environment
- `client.py`: miniscule python client. originally used for testing.
- `pubkey.pem`/`privkey.pem`: pubkey is hardcoded into the Extension, privkey is used by the viewer to RSA decrypt. keys generated by openssl.
- `server/data/`: storage directory for received data. server stores one file per victim IP and appends forthwith. **Example file included:** `server/data/192.168.0.1`

## Install/Run
### Server/Client setup
1. change directory to `server/` and run `server.py`

	```
	$ cd server/
	$ python server.py
	```
	
2. **IMPORTANT**: the server IP in the extension needs to be manually changed in `src/js/background.js`. It won't accept localhost or 127.0.0.1, so if running locally, use your external facing IP.	
	
3. go to the extensions page in chrome - in the omnibox (url bar), type:

	```
	chrome://extensions
	```
	
4. click `Load unpacked extension` and choose the `src/` directory

- The extension should now be up and running. You should see the silver and red icon added to the right of the omnibox. From here, new tabs will be monitored for keyboard activity and it will be logged to the server. The console of the server provides a small notification when a client has sent data. CTRL-C can shutdown the server. 

### Gathered Data Viewer
- since the stolen data is stored RSA encrypted, `server/viewer.html` can be used to decrypt and view the content of the files created by the server. open the file viewer.html in a browser and you'll see two parts.
1. the top part was encryption debugging. it allows entering text in the top field, it will encrypt to the middle textarea, and then can decrypt immediately below.
2. the bottom half is the payload. the 'Choose File' button can be used to open a file created by the server. the page will decrypt and load the data into a small table. the data files can be found in `server/data/`

### architecture
- the extention has three main parts: content_scripts, background page, and popup.
1. the content_scripts are loaded once in context of every page/tab opened in chrome. this is where the activity listeners lie in wait.
2. the background page calls on the main background script as well as the crypto scripts to receive data from the content_script, prepare it for network deliverly, and send it on its way. the background scripts are asyncronous from the content_scripts, and likewise the HTTPRequest is also asyncronous. this is important to remain transparent and not show any signs of slowed browser performance. The request size is also kept regular with medium sized loads on a fast paced input speed as to not burden the network connection. as the content_script effects the loaded page, the encryption work is also done in the background, again to remain as transparent as possible.
3. the popup is simply the mini html page that shows when the extension icon is clicked.
- the server is a fairly routine python server, where the client work and server work are both delegated to threads. the threads are daemonized in effect to remain responsive to actions taken on the main thread (e.g. ctrl-c)
- the stolen data is smuggled out via the `Content-Type` header. the sheer size of this field and the abnormal content should raise suspicion to any traffic monitoring, but the RSA encryption should keep the data obfuscated at very least. There are certainly alternatives to using this technique, but they are yet explored in this. 

## VIDEO (care, audio wee bit loud)
[![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/I1az7uyw3Sg/0.jpg)](http://www.youtube.com/watch?v=I1az7uyw3Sg)

## Sources
- Tom Wu - PKCS#1 RSA crypto library - /src/crypto/*
	- http://www-cs-students.stanford.edu/~tjw/jsbn/
- Matt West, javascript FileReader example - influenced /server/viewer.(html)(js)
	- http://blog.teamtreehouse.com/reading-files-using-the-html5-filereader-api
	- http://codepen.io/matt-west/pen/KjEHg
- Everyone on stack overflow (always)
- chrome developers
	- https://developer.chrome.com/extensions (as vague as they are)
- motivational coffee picture
	- http://guardianlv.com/wp-content/uploads/2014/04/coffee.jpg
