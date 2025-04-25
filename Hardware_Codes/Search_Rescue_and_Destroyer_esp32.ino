#include <BluetoothSerial.h>
#include <ESP32Servo.h>

BluetoothSerial btSerial;
String receivedData = "";
 
#define IN1  18 
#define IN2  19 

#define IN3  22 
#define IN4  23 
Servo myServo; 

int servoPin = 13;

void setup() {
  Serial.begin(9600);
  btSerial.begin("Smart_Car");

  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  myServo.attach(servoPin);
  myServo.write(90);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}

void loop() {
  while (btSerial.available()) {
    char receivedChar = btSerial.read();
    Serial.println(receivedChar);
    if (receivedChar == '\n') {
      
       
       if (receivedData == "F") {
        myServo.write(90);  
        digitalWrite(IN1, HIGH);
        digitalWrite(IN2, LOW);
        Serial.println("Motor Forward");
      } 
      else if (receivedData == "G") {
        myServo.write(90);  
        digitalWrite(IN1, LOW);
        digitalWrite(IN2, HIGH);
        Serial.println("Motor Backward");
      }
      else if (receivedData == "L") {  
         myServo.write(155);
        digitalWrite(IN1, HIGH);
        digitalWrite(IN2, LOW);
        Serial.println("LET Forward");
      } 
      else if (receivedData == "R") {  
        myServo.write(25);
        digitalWrite(IN1, HIGH);
        digitalWrite(IN2, LOW);
        Serial.println("RIGHT Forward");
      }
     
      
     else if (receivedData == "Y") {  
        
        digitalWrite(IN3, HIGH);
        digitalWrite(IN4, LOW);
        Serial.println("DOWN");
      }
      else if (receivedData == "X") {  
        
        digitalWrite(IN4, HIGH);
        digitalWrite(IN3, LOW);
        Serial.println("UP");
      }
      else if (receivedData == "M" || receivedData == "N") {  
        digitalWrite(IN4, LOW);
        digitalWrite(IN3, LOW);
        Serial.println("OFFFF");
      }
       else if (receivedData == "S") { 
        myServo.write(90); 
        digitalWrite(IN1, LOW);
        digitalWrite(IN2, LOW);
        Serial.println("Motor Stopped");
      } 
      receivedData = ""; 
    } else {
      receivedData += receivedChar;
    }
  }
}
