#include "MPU9250.h"
#include <SoftwareSerial.h>

// an MPU9250 object with the MPU-9250 sensor on I2C bus 0 with address 0x68
MPU9250 IMU(Wire,0x68);
#define rxPin 5
#define txPin 6

int status;
float gyroX, gyroY, gyroZ;
String str;
SoftwareSerial espSerial(rxPin, txPin);

void setup() {

  pinMode(rxPin, INPUT);
  pinMode(txPin, OUTPUT);

  Serial.begin(115200);
  while (!Serial) {}
  Serial.println("Connection to serial successful!");
  
  espSerial.begin(115200);
  delay(200);

  // start communication with IMU 
  status = IMU.begin();
  if (status < 0) {
    Serial.println("IMU initialization unsuccessful");
    Serial.println("Check IMU wiring or try cycling power");
    Serial.print("Status: ");
    Serial.println(status);
    while(1) {}
  }
}

void loop() {
  // read the sensor
  IMU.readSensor();
  gyroX = IMU.getGyroX_rads();
  gyroY = IMU.getGyroY_rads();
  gyroZ = IMU.getGyroZ_rads();
  
  // display the data
  str = String("X: ") + String(gyroX) + String("   ") + String("Y: ") + String(gyroY)+ String("   ") + String("Z: ") + String(gyroZ);
  espSerial.println(str);

  delay(50);
}
