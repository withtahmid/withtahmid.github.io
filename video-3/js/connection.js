function handleConnectTimeout(){
    if(isConnected()){
        return;
    }
    mqttClient.end();
    alertUser(`failed to join room! \n Check internet connection.`);
    document.getElementById('connectButton').innerHTML = 'Join';
}

function connect() {
    button = document.getElementById('connectButton');
    button.disabled = true;
    setTimeout(function(){
        document.getElementById('connectButton').disabled = false;
    }, 1000);
    var username = document.getElementById("usernameInputField").value;
    var roomName = document.getElementById("roomnameInputField").value;
    
    if(!inputIsValid(username, roomName)){
        return;
    }
    button.innerHTML = "<i class='sync-icon fas fa-sync-alt'></i>";
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
       publishMessage(generateMessage('join', 'null', getUniqueKey()));
    }else{
        publishMessage(generateMessage('reconnect', 'null', getUniqueKey()));
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

messageHandeler = new Map();
messageHandeler.set('media', handleMediaMessage);
messageHandeler.set('text', handleTextMessage);
messageHandeler.set('join', handleJoinMessage);
messageHandeler.set('leave', handleLeaveMessage);
messageHandeler.set('exist', handleExistMessage);
messageHandeler.set('poke', handlePokeMessage);
messageHandeler.set('reconnect', handleReconnectMessage);
messageHandeler.set('conflict', handleConflictMessage);
messageHandeler.set('mediaReguest', hadleMediaReguestMessage);
messageHandeler.set('mediaResponse', handleMediaResponseMessage);
messageHandeler.set('syncRequest', handleSyncRequest);
messageHandeler.set('syncResponse', handleSyncResponse);
messageHandeler.set('change', handleChangeMessage);

ignoreMessage = ['exist', 'reconnect', 'mediaReguest', 'mediaResponse', 'poke', 'syncRequest','syncResponse', 'change'];
function resgisterActivity(message){
    if(ignoreMessage.includes(message.type)){
       return;
    }
    addNotification(message);
    if(showingNotification()){
       setTimeout(()=>{
         addLastNotification();
       }, 50);
    }
}

needtorefresh = true;
function handelMessage(message){
    message = decodeMessage(message);
    resgisterActivity(message);
    registerLastResponseOfUser(message.user);
    typefn = messageHandeler.get(message.type);
    typefn(message);
    
    if(message.type == 'join' || message.type == 'reconnect' || message.type == 'exist'){
        if(message.user == getUsername() && message.text != getUniqueKey()){
            handleConflict(message);
        }
    }
    if(needtorefresh){
        refreshConnectFeed();
        needtorefresh = false;
        setTimeout(()=>{
            needtorefresh = true;
        },2000);
    }
}

