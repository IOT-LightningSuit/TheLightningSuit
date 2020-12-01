#include "MPU9250.h"
#include <SoftwareSerial.h>

const int rxPin = 5;
const int txPin = 6;

int status;
float gyroX, gyroY, gyroZ;
String str;
SoftwareSerial espSerial(rxPin, txPin);

typedef enum ESensors {
  CENTER_BACK,
  RIGHT_SHOULDER,

  NUM_OF_CONNECTED_SENSORS,
  
  RIGHT_FOREARM,
  RIGHT_WRIST,
  LEFT_SOULDER,
  LEFT_FOREARM,
  LEFT_WRIST,
  RIGHT_THIGH,  
  RIGHT_SHIN,
  RIGHT_ANKLE,
  LEFT_THIGH,
  LEFT_SHIN,
  LEFT_ANKLE
};

MPU9250 IMU(Wire, 0x68);

void TCA9548A(uint8_t bus) {
  Wire.beginTransmission(0x70);  // TCA9548A address is 0x70
  Wire.write(1 << bus);          // send byte to select bus
  Wire.endTransmission();
}

void setup() {

  pinMode(rxPin, INPUT);
  pinMode(txPin, OUTPUT);

  Serial.begin(115200);
  while (!Serial) {}
  Serial.println("Connection to serial successful!");
  
  espSerial.begin(115200);
  delay(200);

  // Set communication with mux
  Wire.begin();

  // Setup sensors
  for (int i = 0; i < static_cast<int>(NUM_OF_CONNECTED_SENSORS); i++) {
    TCA9548A(i);
    status = IMU.begin();
    if (status < 0) {
      Serial.println("IMU initialization unsuccessful");
      Serial.println("Check IMU wiring or try cycling power");
      Serial.print("Status: ");
      Serial.println(status);
      while(1) {}
    }
  }
}

void loop() {
  // read the sensor
  for (int i = 0; i < static_cast<int>(NUM_OF_CONNECTED_SENSORS); i++) {
    TCA9548A(i);

    IMU.readSensor();
    gyroX = IMU.getGyroX_rads();
    gyroY = IMU.getGyroY_rads();
    gyroZ = IMU.getGyroZ_rads();
  
    // display the data
    str = String("Sensor ") + String(i) + String(" X: ") + String(gyroX) + String("   ") + String("Y: ") + String(gyroY)+ String("   ") + String("Z: ") + String(gyroZ);
    espSerial.println(str);
  }
  
  delay(50);
}
