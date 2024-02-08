#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "SoftwareSerial.h"


const int SENSOR_PIN = 4; // Arduino pin connected to DS18B20 sensor's DQ pin
OneWire oneWire(SENSOR_PIN);         // setup a oneWire instance
DallasTemperature tempSensor(&oneWire); // pass oneWire to DallasTemperature library
float tempCelsius;    // temperature in Celsius

SoftwareSerial btSerial(6,5); // TX RX
const int btState = 7;  // 0 = waiting to pair, 1 = pairing. 1 can be wrong if pairing failamp

const int r = 12;
const int y = 11;
const int g = 10;
const int lampArray[3] = {r, y, g};
int mCounter = 0;
int lamp = 0;

void setup() {
  btSerial.begin(9600); // 38400 for AT commands, 9600 for BT connections
  Serial.begin(9600);
  tempSensor.begin();    // initialize the sensor
  pinMode(btState, INPUT);
  pinMode(r, OUTPUT);
  pinMode(y, OUTPUT);
  pinMode(g, OUTPUT);

}

void loop() {
  if (btSerial.available()) {
    // Strings written to the serial (ie "m010") are read one char per loop iteration
    char txt = btSerial.read();
    lamp = 99;
    switch (txt) {
      case 'r': lamp = r; break;
      case 'y': lamp = y; break;
      case 'g': lamp = g; break;
      case 'm':
        // m code is for multi read. This starts a counter which increments on lamp changes
        // After all lamp changes are complete the timer clears and sends back the new state
        mCounter = 1;
        break;
      case 't':
        tempSensor.requestTemperatures();
        tempCelsius = tempSensor.getTempCByIndex(0);
        btSerial.println(tempCelsius);
        break;
      case 's':
        btSerial.println(String(digitalRead(r)) + String(digitalRead(y)) + String(digitalRead(g)));
        break;
      default:
        // Default call is for 0's (char code 48) and 1's (char code 49)
        if (txt != 48 && txt != 49) { break; }
        int lampValue = txt == 48 ? 0 : 1;
        digitalWrite(lampArray[mCounter-1], lampValue);
        if (mCounter == 3) {
          mCounter = 0;
          btSerial.println(String(digitalRead(r)) + String(digitalRead(y)) + String(digitalRead(g)));
        } else {
          mCounter++;
        }
        break;
    }

    // If an lamp value has been set, flip that lamp and return a read
    if (lamp != 99) {
      digitalWrite(lamp, abs(digitalRead(lamp) - 1));
      // After flipping light return the state of all apps to the mobile app.
      // This reduces state request calls
      btSerial.println(String(digitalRead(r)) + String(digitalRead(y)) + String(digitalRead(g)));
    }
  }
}