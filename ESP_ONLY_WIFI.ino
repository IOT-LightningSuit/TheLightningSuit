#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid="G5_8704";
const char* password = "qp836gd27A324";

void setup() {

  Serial.begin(115200);
  Serial.println();
  Serial.print("Wifi connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  Serial.println();
  Serial.print("Connecting");

  while(WiFi.status() != WL_CONNECTED ){
      delay(500);
      Serial.print(".");        
  }

  Serial.println();

  Serial.println("Wifi Connected Success!");
  Serial.print("NodeMCU IP Address : ");
  Serial.println(WiFi.localIP() );
}

void loop() {
  HTTPClient http;
  http.begin("http://192.168.43.115:5000/weatherforecast");
  http.addHeader("Content-Type", "text/plain");

  String res;
  char c = ' ';
  
  if (Serial.available()) {
    while(c != 'E' && c != '\n') {
      c = Serial.read();
      res += c;
    }
  }
  
  http.POST(res);
  http.end();
}
