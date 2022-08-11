import socket


#Client Protocol Intepreter
class client_interface():
  def __init__(self, client): #initlise main interaction loop
      self.socket = client
      

  def run(self): #run main interaction loop

    while True:  
     print("Enter IMEI : ")
     data = input("> ")
     self.socket.send(bytes(data,FORMAT)) #send IMEI

     reply = self.socket.recv(SIZE) #receive acceptance
     print(reply)

     if reply == b'\x01':
        avlData= "000000000000008c08010000013feb55ff74000f0ea850209a690000940000120000001e09010002000300040016014703f0001504c8000c0900730a00460b00501300464306d7440000b5000bb60007422e9f180000cd0386ce000107c700000000f10000601a46000001344800000bb84900000bb84a00000bb84c00000000024e0000000000000000cf00000000000000000100003fca"
        self.socket.send(bytes(avlData,FORMAT)) #send AVL data packet
        reply = self.socket.recv(SIZE) #receive confirmation records
        print(reply)
        return

     
     """ print(reply)
     if reply == b'\x00\x00\x00\x01':
        print("transfer complete")
        return """
        

#set up TCP connection
clientPort = 1234 
IP = socket.gethostbyname(socket.gethostname()) #if connecting to another computer/host change to their IP
ADDR = (IP, clientPort)
SIZE = 1024
FORMAT = "utf-8" #format for encode and decode 

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(ADDR)

clientInterface = client_interface(client) # run main client interaction loop
clientInterface.run()
client.close() #end client connection entirely