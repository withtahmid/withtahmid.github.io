function connect() {
    
    var username = document.getElementById("usernameInputField").value;
    var roomName = document.getElementById("roomnameInputField").value;
    
    if(!inputIsValid(username, roomName)){
        return;
    }
    var topic = insertCharacterInMiddle(roomName, '/');
    setRoomName(roomName);
    setUsername(username);
    setTopic(topic);
    connectToMQTT(topic);
}
function connectToMQTT(topic){
    mqttClient = mqtt.connect('wss://test.mosquitto.org:8081');
    mqttClient.subscribe(topic);
    mqttClient.on('connect', function(){
        handelConnect();
    });
    mqttClient.on('error', (error) => {
     handelError(error);
    });
    mqttClient.on('close', function(){
        handelDisconnect();
    });
    mqttClient.on('message', function (topic, message){
        handelMessage(message.toString());
    });
}

function handelError(error){
    console.log(error);
}
function handelConnect(){
    setConnected(true);
    console.log('Connected');
    updateStatusSignal('connected');
    activateConnectionButtons();
    if(firstConncet()){
       handelFirstTimeConnection();
       publishMessage(generateMessage('join', 'null', 'null'));
    }
}
function handelDisconnect(){
    setConnected(false);
    deactivateConnectionButtons()
    console.log('Disconnected');
    updateStatusSignal('disconnected');
    if(intentionalDisconnect()){
        resetAllConnection();
    }
}

messageHandeler = new Map();
messageHandeler.set('media', handleMediaMessage);
messageHandeler.set('text', handleTextMessage);
messageHandeler.set('join', handleJoinMessage);
messageHandeler.set('leave', handleLeaveMessage);
messageHandeler.set('exist', handleExistMessage);
messageHandeler.set('poke', handlePokeMessage);
let tempTableBody;
let tempContainer;
function addLastNotification(){
    notification = notifications[notifications.length - 1];
    const newRow = document.createElement('tr');

    cell = document.createElement('td');
    cell.textContent = notification.user;
    newRow.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = notification.type;
    newRow.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = notification.event;
    newRow.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = formatDuration(notification.playTime);
    newRow.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = getTimeFromDateHMS(notification.time);
    newRow.appendChild(cell);
    newRow.classList.add('btn-hover-fx');
    tempTableBody.appendChild(newRow);
    tempContainer.scrollTop = tempContainer.scrollHeight;

}
function handelMessage(message){
    if(!sync()){
        return;
    }
    // console.log(message);
    message = decodeMessage(message);
    if(message.type != 'exist'){
        addNotification(message);
        if(showingNotification()){
           setTimeout(()=>{
             addLastNotification();
           }, 50);
        }
    }
    registerLastResponseOfUser(message.user);
    typefn = messageHandeler.get(message.type);
    typefn(message);
}

