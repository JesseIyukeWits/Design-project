import socket
import threading
import time
import datetime

import binascii
import traceback


#from decoder import decoder #import functions decoder file in same folder directory

#avlDecoder= decoder()


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

    def initVars(self):            # initilizing variables
        self.codecid        = 0
        self.NumberofData1   = 0
        self.NumberofData2   = 0
        self.crc_16         = 0
        self.d_time_unix    = 0 
        self.d_time_local   = ""
        self.priority       = 0
        self.lon            = 0
        self.lat            = 0
        self.alt            = 0
        self.angle          = 0
        self.satellites     = 0
        self.speed          = 0

    def run(self): 
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
                    vars['imei'] = imei.split("\x0f")[1]
                    recieved = self.decoder(data) # convert to hexadecimal form
                    with open('raw.txt', 'a+') as w: # testing purposes
                        w.writelines(recieved.decode(FORMAT)+'\n')
                    vars.update(self.decodeAVL(recieved))  #AVL decoding   
                    resp = self.mResponse(vars['NumberofData1']) #check for number of records sent is correct
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
    
    def decodeAVL(self, data):
        self.preamble = int(data[0:7]) #the packet starts with four zero bytes.
        self.data_field_l  = int(data[8:15]) #?  Data Field Length – size is calculated starting from Codec ID to Number of Data 2.
        self.codecid = int(data[16:17])  # codecid
        self.NumberofData1 = int(data[18:19]) # Number of Data 1 – a number which defines how many records is in the packet
        self.NumberofData2 = int(data[-10:-9])  #? no of total records before crc-16 check
        self.crc_16 = int(data[-8:])  # crc-16 check- the last 4 bytes
    
        if(self.codecid == 8 and (self.NumberofData1 == self.NumberofData2)):

            self.d_time_unix  = int(data[20:27])  # device time unix
            self.d_time_local = self.unixtoLocal(self.d_time_unix)  # device time local
            self.priority     = int(data[28:29])    # device data priority
            self.lon          = int(data[30:37])  # longitude
            self.lat          = int(data[38:45]) # latitude
            self.alt          = int(data[46:50]) # altitude
            self.angle        = int(data[51:54]) # angle
            self.satellites   = int(data[55:56])  # no of satellites
            self.speed        = int(data[57:60]) # speed

            return self.getAvlData()
        else:
            return -1

    
    def unixtoLocal(self, unix_time):                                              # unix to local time
        time = datetime.datetime.fromtimestamp(unix_time/1000)
        return f"{time:%Y-%m-%d %H:%M:%S}"

    def getAvlData(self):
        data = {
            "codecid"    : self.codecid,
            "no_record_i": self.NumberofData1,
            "no_record_e": self.NumberofData2,
            "crc-16"     : self.crc_16,
            "d_time_unix" : self.d_time_unix,
            "d_time_local": self.d_time_local,
            "priority"    :self.priority,  
            "lon"         :self.lon,
            "lat"         :self.lat,
            "alt"         :self.alt,       
            "angle"       :self.angle,     
            "satellites"  :self.satellites,
            "speed"       :self.speed,  
        }
        return data

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