"""""""""""""""""""""
Info gatherer server

Data packed into Content-Type header and appended
to file with client IP as filename under ./data/
"""""""""""""""""""""

import socket
import threading
import urllib
import time
import sys
from Crypto.PublicKey import RSA

run 		= True
server	= socket.socket()
host		= socket.gethostname()
port		= 8080
addr		= host, port
header	= 'Content-Type: '

"""""""""""""""
thread subclass for connection work
"""""""""""""""

class client_thread(threading.Thread):

	def __init__(self,client,addr):
		threading.Thread.__init__(self)
		self.client = client
		self.addr = addr

	def run(self):
		print '> received ' + self.addr[0]
		msg = self.client.recv(4096)
		self.client.send('SERVER_ACK')
		self.client.close()

		a,b,data = msg.partition(header)

		if len(data) > 0:
			data,a,b = data.partition('\r\n')
			data = urllib.unquote(data)
			f = open('data/' + self.addr[0], 'a')
			f.write(data + '\n');
			f.close()
		
		if msg == 'exit':
			print 'Exit command received'
			global run
			run = False

"""""""""""""""
thread subclass for server loop
"""""""""""""""

class server_thread(threading.Thread):

	def __init__(self,server,addr):
		threading.Thread.__init__(self)
		self.server = server
		self.addr = addr

	def run(self):
		self.server.bind(self.addr)
		self.server.listen(5)
		print 'Server Up...'

		global run
		while run:
			try:
				client,addr = self.server.accept()
				thread = client_thread(client,addr)
				thread.daemon = True
				thread.start()
			except:
				print 'server exception. i\'m dead.'
				run = False


"""""""""""""""
start main server
"""""""""""""""
thread = server_thread(server,addr)
thread.daemon = True
thread.start()

"""""""""""""""
listen for console interrupts
"""""""""""""""
while run:
	try:
		time.sleep(1)
	except:
		print 'going down. goodbye.'
		run = False
		server.close()