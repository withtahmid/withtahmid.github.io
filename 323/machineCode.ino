#include <ESP8266WiFi.h>
#include "DHT.h"
#include <PubSubClient.h>

const char * ssid = "Tahmid";
const char * password = "passwordnai";
const char * mqtt_server = "91.121.93.94"; // test.mosquitto.org
const char * pubSubTopic = "CSE323/SEC07";

DHT dht(D5, DHT22);

const int PIN_NUM = 4;
const int PINS[] = { -1, D1, D2, D7, D8};

int pin_status[] = {-1, 0, 0, 0, 0};

String status_message = "m0000";

WiFiClient espClient;
PubSubClient client(espClient);

const int MSG_BUFFER_SIZE = 50;

char msg[MSG_BUFFER_SIZE];

void turn_on(const int pin) {
  digitalWrite(PINS[pin], HIGH);
  pin_status[pin] = 1;
}
void turn_off(const int pin) {
  digitalWrite(PINS[pin], LOW);
  pin_status[pin] = 0;
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
char buffer[10];
void reportStatus() {
  for (int i = 1; i <= PIN_NUM; ++i) {
    status_message[i] = pin_status[i] + '0';
  }
  String report = status_message;
  report += '~';
  report += dtostrf(dht.readHumidity(), 5, 2, buffer);
  report += '~';
  report += dtostrf(dht.readTemperature(), 5, 2, buffer);

  client.publish(pubSubTopic, report.c_str());
}

void callback(char * topic, byte * payload, unsigned int length) {
  if (payload[0] == 'm') {
    return;
  }
  if ((char) payload[2] == '1') {
    turn_on((char) payload[1] - '0');
  } else if ((char) payload[2] == '0') {
    turn_off((char) payload[1] - '0');
  }
  reportStatus();
}

void reconnect() {

  digitalWrite(BUILTIN_LED, HIGH);

  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");

    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      digitalWrite(BUILTIN_LED, LOW);
      client.subscribe(pubSubTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  dht.begin();
  pinMode(BUILTIN_LED, OUTPUT);
  for (int i = 1; i <= PIN_NUM; ++i) {
    pinMode(PINS[i], OUTPUT);
  }
  for (int i = 1; i <= PIN_NUM; ++i) {
    digitalWrite(PINS[i], LOW);
  }
  digitalWrite(BUILTIN_LED, HIGH);
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

unsigned long last_refresh_time = 0;
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  unsigned long now = millis();
  if (now - last_refresh_time >= 2000) {
    last_refresh_time = now;
    reportStatus();
  }
}
