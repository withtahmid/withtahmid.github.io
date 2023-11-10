let start = new Date("2023-01-01");
let prev = "";
const num_of_switch = 4;
const topic = "CSE323/SEC07";
const mqttClient = mqtt.connect('wss://test.mosquitto.org:8081');
mqttClient.subscribe(topic);
mqttClient.on('message', function(topic, message) {
    payload = message.toString();
    processMessage(payload);
});
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');

});
mqttClient.on('error', (error) => {
    console.error('Error:', error);
});
mqttClient.on('close', () => {
    console.log('Disconnected from MQTT broker');
    setTimeout(() => {
        mqttClient.connect();
    }, 5000);
});
function publishMessage(message) {
    mqttClient.publish(topic, message);
    setTimeout(function() {}, 1000);
}

async function updateHT(message){
  const info = message.split('~');
  const temparature = Number(info[2]);
  const humidity = Number(info[1]);
  changeChart(temparature, humidity);
  document.getElementById('tinfo').textContent = `Temparature: ${temparature} *C`;
  document.getElementById('hinfo').textContent = `Humidity: ${humidity} %`;
}

function processMessage(message) {
    if (message[0] == "u" || message[0] != 'm') {
        return
    }
    start = new Date();
    updateHT(message);
    if (message == prev) {
        return;
    }
    prev = message;
    for (i = 1; i <= num_of_switch; ++i) {
        if (message[i] == '1') {
            turn_on_switch(i);
        } else if (message[i] == '0') {
            turn_off_switch(i);
        }
    }
}
function turn_on_switch(switch_no) {
    const button = document.getElementById("switch-" + i.toString());
    button.classList.remove("off");
    button.classList.remove("disconnect");
    button.classList.add("on");
}
function turn_off_switch(switch_no) {
    const button = document.getElementById("switch-" + i.toString());
    button.classList.remove("on");
    button.classList.remove("disconnect");
    button.classList.add("off");
}
function disconnect_switch(i) {
    const button = document.getElementById("switch-" + i.toString());
    button.classList.remove("on");
    button.classList.remove("off");
    button.classList.add("disconnect");
}
function switch_click(i) {
    let message;
    const button = document.getElementById("switch-" + i.toString());
    if (button.classList.contains('off')) {
        message = "u" + i.toString() + "1";
    } else {
        message = "u" + i.toString() + "0";
    }
    publishMessage(message);
}
function refresh_connection() {
    const now = new Date();
    const elapsedSeconds = Math.floor((now - start) / 1000);
    if (elapsedSeconds >= 10) {
        for (let i = 1; i <= num_of_switch; ++i){
            disconnect_switch(i);
        }
    }
    prev = "";
}
refresh_connection();
setInterval(refresh_connection, 1000);
