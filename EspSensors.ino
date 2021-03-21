#include "MPU9250.h"
#include <Wire.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "Pixel_7023";
const char* password = "b67032f0959d";

const int rxPin = 5;
const int txPin = 4;

int status;
int accX, accY, accZ;
String str;
int printSensor = 7;

typedef enum ESensors {
  LEFT_LOWER_ARM,
  LEFT_UPPER_ARM,
  SHINS,
  LEFT_THIGH,
  RIGHT_THIGH,
  RIGHT_UPPER_ARM,
  RIGHT_LOWER_ARM,
  NUM_OF_CONNECTED_SENSORS
};

const String partsStrings[NUM_OF_CONNECTED_SENSORS] = {
  "Left Forearm",
  "Left Shoulder",
  "Left Thigh",
  "Right Thigh",
  "Shins",
  "Right Bicep",
  "Right Arm"
};

MPU9250 IMU(Wire, 0x68);

void TCA9548A(uint8_t bus) {
  Wire.beginTransmission(0x70);  // TCA9548A address is 0x70
  Wire.write(1 << bus);          // send byte to select bus
  Wire.endTransmission();
}

void setup() {
  // Define I/O pins with the mux
  pinMode(rxPin, INPUT);
  pinMode(txPin, OUTPUT);

  Serial.begin(115200);
  while (!Serial) {}
  Serial.println("Connection to serial successful!");
  Serial.setTimeout(20);

  delay(2000);

  Serial.print("Wifi connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED ) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi Connected Success!");
  Serial.print("NodeMCU IP Address : ");
  Serial.println(WiFi.localIP() );

  delay(200);

  // Setup communication with mux
  Wire.begin();

  // Initialize sensors
  for (int i = 0; i < static_cast<int>(NUM_OF_CONNECTED_SENSORS); i++) {
    TCA9548A(i);
    Serial.print("Initializing sensor ");
    Serial.println(partsStrings[i]);
    status = IMU.begin();
    if (status < 0) {
      Serial.println("IMU sensor initialization unsuccessful");
      Serial.println("Check IMU wiring or try cycling power");
      Serial.print("Status: ");
      Serial.println(status);
    }
    else {
      Serial.println("Initialization successful!");
    }
  }
}

void loop() {
  // Read the sensors
  for (int i = 0; i < static_cast<int>(NUM_OF_CONNECTED_SENSORS); i++) {
    // Choose which sensor to communicate with
    TCA9548A(i);

    IMU.readSensor();

    accX = IMU.getAccelX_mss();
    accY = IMU.getAccelY_mss();
    accZ = IMU.getAccelZ_mss();

    int x = RAD_TO_DEG * (atan2(-accY, -accZ));
    int y = RAD_TO_DEG * (atan2(-accX, -accZ));
    int z = RAD_TO_DEG * (atan2(-accY, -accX));

    // Display the data
    str = String("S") + String(i) + String("X") + String(x) + String("Y") + String(y) + String("Z") + String(z) + String("E");
    String tmp = Serial.readStringUntil('\n');
    if (tmp != String("")) {
      printSensor = tmp.toInt();
    }
    if (printSensor >= 7 || i == printSensor) {
      Serial.println(str);
    }

    HTTPClient http;
    http.begin("http://192.168.0.97:5000/sensorsdata");
    http.addHeader("Content-Type", "text/plain");
    http.POST(str);
    delay(30);
  }
}
