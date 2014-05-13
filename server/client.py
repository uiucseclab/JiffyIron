import socket
import sys

"""""""""""""""""""""""""""""""""
Used for initial setup testing (not much else).
Also,

$ python client.py exit

will terminate server.
"""""""""""""""""""""""""""""""""

client = socket.socket()
host = '192.168.0.88'
port = 8080

client.connect((host,port))
msg = str(sys.argv[1])
client.send(msg)
client.close()