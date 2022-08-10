import socket
import threading
import time

import binascii
import traceback


from decoder import decoder #import functions decoder file in same folder directory

avlDecoder= decoder()


#constants
SIZE = 1024 #
FORMAT = "UTF-8" #encoding format
PORT = 1234  # Port to listen on (non-privileged ports are > 1023)
IP = socket.gethostbyname(socket.gethostname()); #IP address of server device
ADDRESS = (IP,PORT) 


#Handle threads
class handle_client(threading.Thread):
   def __init__(self, threadID, name, connection):
      threading.Thread.__init__(self)
      self.threadID = threadID
      self.name = name
      self.connection = connection
      
   def run(self):
      print ("Starting " + self.name)
      serverThread(self.connection, self.threadID)
      print ("Exiting " + self.name)

def serverThread(clientsocket, client_no):
    serverPI = TCP(clientsocket)
    serverPI.run()    
    
    print(f"\nDISCONNECTED: {client_no}")
    clientsocket.close()

    
#TCP server class
class TCP(threading.Thread):
    def __init__(self, clientsocket):
        self.commandSocket = clientsocket

    def run(self): #didnt modify much
         while True:
            print("waiting for device")
            try:
                imeiData = self.commandSocket.recv(SIZE)
                if(imeiData):
                    imei = imeiData.decode(FORMAT)
                    print(imei+ " :imei data") #E.g - 000F333536333037303432343431303133
                    self.Communicator(self.commandSocket, imei)
                else:
                    break
            except Exception as e:
                print("connection closed")
                self.commandSocket.close()
                break

    def Communicator(self, conn, imei):
        accept_con_mes = '\x01' #acceptance code
        conn.send(accept_con_mes.encode(FORMAT))
        print("Device connected")
        while True:
            try:
                data = conn.recv(SIZE)
                if(data):
                    vars = {} # store in dictionary
                    recieved = self.decoder(data) # convert to hexadecimal form
                    with open('raw.txt', 'a+') as w: # testing purposes
                        w.writelines(recieved.decode(FORMAT)+'\n')
                    vars = avl_decoder.decodeAVL(recieved) #AVL decoding
                    vars['imei'] = imei.split("\x0f")[1]
                    print("vars", vars)
                    resp = self.mResponse(vars['no_record_i']) #check for number of records sent is correct
                    time.sleep(30)
                    conn.send(resp)
                else:
                    break
            except Exception as e:
                print(traceback.format_exc()) # ?
                print(e)
                break
        print('exiting tcp comms')

    
    def decoder(self, raw):
        decoded = binascii.hexlify(raw)
        return decoded

    def mResponse(self, data):
        return data.to_bytes(4, byteorder = 'big')



#Start threading
def startServer( ):
    listenSock = socket.socket(socket.AF_INET, socket.SOCK_STREAM) #
    listenSock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1) #
    listenSock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1) #
    listenSock.bind((ADDRESS))
    listenSock.listen()
    print('Server started', 'Listen on: %s, %s' % listenSock.getsockname( ))
    while True:
        connection, address = listenSock.accept( )
        i +=1
        print ("Connected to "+address[0]+" port:"+str(address[1]))
        thread = handle_client(i, "Client-"+str(i),connection)
        thread.start()

        if threading._count() == 0: 
            break
    listenSock.close()



if __name__ == '__main__':
    
    print(f"{ADDRESS} Server is starting....")
    Server = threading.Thread(target=startServer)
    Server.start()