const ROOM = {

    mqttClient: null,
    username: null,
    roomId: null,
    inSync: true,
    connected: false,
    leaving: false,
    connecting: false,
    keyword: 'tahmiddd',
    topic: 'null',
    connectiontab: document.getElementById('connection-tab'),
    existingIntervalId: null,
    autoJoin: null,
    notificationVolumeIndex: 3,

    requestingForSync: false,

    connectedPeopleLsitMap: new Map(),
    connectedPeopleTimes : new Map(),
    peoplesInTheRoom: new Set(),


    refreshPeopleInterval: null,

    connectedPeopleLsit: document.getElementById('connected-people-list'),

   
    join: async function(user, roomid, autoJoin){
        this.connecting = true;
        this.makeTabConnecting();
        this.mqttClient = mqtt.connect('wss://test.mosquitto.org:8081');
        this.topic = `${this.keyword}/${roomid}`;
        this.mqttClient.subscribe(this.topic);
        this.mqttClient.on('connect', ()=>{
            this.username = user;
            this.roomId = roomid;
            this.autoJoin = autoJoin;
            this.hendleConnect();
        });
        this.mqttClient.on('error', (error) => {
         this.hendleError(error);
        });
        this.mqttClient.on('close', ()=>{
            this.hendleDisconnect();
        });
        this.mqttClient.on('message', (topic, message)=>{
            MessageHandler.handle(message.toString())
        });
    },
    hendleError: function(err){
        console.log(err);
    },

    hendleConnect: function (){
        this.connected = true;
        if(this.connecting){
            this.hendleFirstConnect();
        }
        this.connecting = false;
        this.broadcastExisTance();
        this.refreshPeopleInterval = setInterval(()=>{
            this.refreshPeopleList();
        }, 5000);
    },
    startBoradcastingExistance: function(){
        this.existingIntervalId = setInterval(()=>{
           this.broadcastExisTance();
        },10000);
    },
    sendMessage: function(object){
        if(object.type === 'media' && (VIDEO.ignoreMediaEvent || !VIDEO.videoAdded)){
            return;
        }
    
        this.broadcast(JSON.stringify(object));
    },
    broadcastExisTance: function(){
        this.sendMessage(MESSAGE.existing());
    },
    hendleDisconnect: function(){
        connected = false;
        document.getElementById('video-title-id').classList.remove('connected-title')
        if(this.leaving){
            this.handleLeave();
            return;
        }
        this.makeTabDisconnected();
        
    },
    handleLeave: function(){
        clearInterval(this.refreshPeopleInterval);
        this.leaveing = false;
        clearInterval(this.existingIntervalId);
        this.makeTabNoConnect();
        this.connectedPeopleLsitMap.clear();
        this.connectedPeopleTimes.clear();
        this.connectedPeopleLsit.innerHTML = '';
        document.getElementById('chat-box-container').innerHTML = ''; 
    },

    makeTabDisconnected: function(){
        this.connectiontab.classList.remove('no-connect');
        this.connectiontab.classList.remove('connecting');
        this.connectiontab.classList.add('connected');
        this.connectiontab.classList.add('disconnected');
    },
    makeTabNoConnect: function(){
        this.connectiontab.classList.remove('connected');
        this.connectiontab.classList.remove('connecting');
        this.connectiontab.classList.remove('disconnected');
        this.connectiontab.classList.add('no-connect');
    },
    makeTabConnected: function(){
        this.connectiontab.classList.remove('no-connect');
        this.connectiontab.classList.remove('connecting');
        this.connectiontab.classList.remove('disconnected');
        this.connectiontab.classList.add('connected');
    },
    makeTabConnecting:function(){
        this.connectiontab.classList.remove('no-connect');
        this.connectiontab.classList.remove('connected');
        this.connectiontab.classList.remove('disconnected');
        this.connectiontab.classList.add('connecting');
    },

    hendleFirstConnect: function(){
        this.sendMessage(MESSAGE.join())
        this.makeTabConnected();
        this.startBoradcastingExistance();
        this.saveConfig();
        document.getElementById('video-title-id').classList.add('connected-title')
        document.getElementById('username-label-tab').textContent = this.username;
        document.getElementById('roomid-label-tab').textContent = this.roomId;
    },

    ringNotification: function(){
        document.getElementById('notification-sound').play();
    },

    notificationVolume: function(volume){
        currentNotificationVolume = volume;
        document.getElementById('notification-sound').volume = volume;
        this.ringNotification();

    },

    notificationVolumeToggle: function(){
        this.notificationVolumeIndex = this.notificationVolumeIndex + 1;
        if(!this.notificationVolumeIndex){
            this.notificationVolumeIndex = 3;
        }
        this.volumeIndxSet(this.notificationVolumeIndex);
    },

    volumeIndxSet: function(indx){
        const notificationVolumeRanges = [
          [0.00, '<i class="fa-solid fa-volume-xmark"></i>'],
          [0.25, '<i class="fa-solid fa-volume-off"></i>'],
          [0.60, '<i class="fa-solid fa-volume-low"></i>'],
          [1.00, '<i class="fa-solid fa-volume-high"></i>']
        ]
        this.notificationVolumeIndex = indx;
        this.notificationVolumeIndex = this.notificationVolumeIndex % notificationVolumeRanges.length;
        this.notificationVolume(notificationVolumeRanges[this.notificationVolumeIndex][0]);
        document.getElementById('chatVolumeBtn').innerHTML = notificationVolumeRanges[this.notificationVolumeIndex][1];
        localStorage.setItem('notificationVolume', this.notificationVolumeIndex);
    },

    registerPresence: function (message){
        this.connectedPeopleTimes.set(message.username, TIME.now());
    },
    

    refreshOnePeople(username){
        if(!this.connectedPeopleLsitMap.has(username)){
            return;
        }
        const div = this.connectedPeopleLsitMap.get(username);
        const diff = Math.floor((TIME.now() - this.connectedPeopleTimes.get(username)) / 1000);
        if(diff >= 20){

            div.classList.remove('people-active');
            div.classList.remove('people-late');
            div.classList.add('people-disconnect');
        }
        else if(diff >= 10){
            div.classList.remove('people-active');
            div.classList.remove('people-disconnect');
            div.classList.add('people-late');
        }
        else{

            div.classList.remove('people-disconnect');
            div.classList.remove('people-late');
            div.classList.add('people-active');
        }
    },

    refreshPeopleList: function (){
        this.peoplesInTheRoom.forEach(user =>{
            this.refreshOnePeople(user)
        });
    },

    requestForSync: function(){
        this.requestForSync = true;
        this.sendMessage(MESSAGE.syncRequest());
        setTimeout(()=>{
            if(this.requestForSync){
                this.requestForSync = false;
                displayErrorOnScreen('No one responded!', 'Oh No :(')
            }
        }, 4000);
    },

    leave: async function(){
        if(!this.connected){
            return;
        }
        this.sendMessage(MESSAGE.leave());
        this.leaving = true;
        setTimeout(()=>{
            this.mqttClient.end();
        }, 100);
    },
    saveConfig: function(){
        localStorage.setItem('username', this.username);
        localStorage.setItem('roomId', this.roomId);
        localStorage.setItem('autoJoin', this.autoJoin);
        localStorage.setItem('notificationVolume', this.currentNotificationVolume);
    },

    toggleSync: function(sync){
        if(!sync){
            this.inSync = false;
        }
        else{
            this.inSync = true;
        }
        this.broadcastExisTance();

    },

    broadcast: function(message){
        if(!this.connected){
            return;
        }
        this.mqttClient.publish(this.topic, message);
    }
}

document.getElementById('roomid-input').addEventListener('keypress', (event)=>{
    if (event.key === 'Enter') {
      joinRoom()
    }
  });

  document.getElementById('chat-input-field').addEventListener('keypress', (event)=>{
    if (event.key === 'Enter') {
      sendTextMessage()
    }
  });

function validRoomInfo(username, roomId){
    const regex = /^[A-Za-z]+$/;
    if(regex.test(username) && 
    regex.test(roomId) &&
    3 <= username.length && username.length <= 10 &&
    5 <= roomId.length && roomId.length <= 10
    ){
        return true;
    }
    return false;
}

function  joinRoom(){
    const username = document.getElementById('username-input').value;
    const roomId = document.getElementById('roomid-input').value;
    if(!validRoomInfo(username, roomId)){
        displayErrorOnScreen('Invalid username or room id format');
        return;
    }

    const autoJoin = document.getElementById('remember-connection').checked;
    ROOM.join(username, roomId, autoJoin);
}
function sendTextMessage(inputFiledId){
    if(!ROOM.connected) return;
    // const input = document.getElementById(inputFiledId);
    const input = document.getElementById('chat-input-field');
    ROOM.sendMessage(MESSAGE.text(input.value));
    input.value = '';
}
document.querySelector('emoji-picker')
  .addEventListener('emoji-click', (event) =>{
    document.getElementById('chat-input-field').value += event.detail.unicode;
});