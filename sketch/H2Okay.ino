#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <Ultrasonic.h>

// Update these with values suitable for your network.
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
byte server[] = { 192,168,10,103 };
byte ip[] = { 192, 168, 10, 130 };
//#define server "iot.arquitetaweb.com"

// Callback function header
void callback(char* topic, byte* payload, unsigned int length);

EthernetClient ethClient;
PubSubClient client(server, 1883, callback, ethClient);

String textoString = String(" ");
char* textoByte = "xxxxxxxxxxxxxxxxxxx";


// Callback function
void callback(char* topic, byte* payload, unsigned int length) {
	// In order to republish this payload, a copy must be made
	// as the orignal payload buffer will be overwritten whilst
	// constructing the PUBLISH packet.

	// Allocate the correct amount of memory for the payload copy
	byte* p = (byte*)malloc(length);
	// Copy the payload to the new buffer
	memcpy(p, payload, length);
	client.publish("t1", p, length);
	// Free the memory
	free(p);
}


//criando objeto ultrasonic e definindo as portas digitais 
//do Trigger - 6 - e Echo - 7
Ultrasonic ultrasonic(7,6);

long microsec = 0;
int distanciaCM = 0;
int giro = 0;
int umidade = 0;
int chuva = 0;

int passo = 0;
int lumAnterior = 0;
int lumAtual = 0;

void setup()
{
  Serial.begin(9600);
	Ethernet.begin(mac, ip);
  client.connect("ac");
}
int count = 0;

void loop()
{

  lumAnterior = lumAtual;
  lumAtual = analogRead(0);

  if(lumAnterior<350 && lumAtual > 450)
  {
    giro = giro + 1;  
  }

  passo = passo +1;

  if(passo == 10)
  {
    //Lendo o sensor
    microsec = ultrasonic.timing(); 
   
    //Convertendo a distância em CM
    distanciaCM = ultrasonic.convert(microsec, Ultrasonic::CM); 
    umidade = analogRead(1);
    chuva = analogRead(2);

    String transmitir = textoString + "C:"+ distanciaCM + "|U:" + umidade + "|A:" + chuva + "|G:" + giro  + ";";
    transmitir.toCharArray(textoByte, transmitir.length());

    delay(600);
    client.publish("t1",textoByte);
    delay(600);
    
    passo = 0;
    giro = 0;
  }	
  delay(100);
}
