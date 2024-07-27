/**
 * Events: 
        'people-disconnected' -> when a people is not seen for a while, with uername
 * */ 


const ROOM_HTML_MANAGER = {
    
    tab_html: document.getElementById('connection-tab'),

    onTryingToJoin: function(){
        this.tab_html.classList.remove('no-connect');
        this.tab_html.classList.remove('connected');
        this.tab_html.classList.remove('disconnected');
        this.tab_html.classList.add('connecting');
    },
    onLeave: function(){
        this.tab_html.classList.remove('connected');
        this.tab_html.classList.remove('connecting');
        this.tab_html.classList.remove('disconnected');
        this.tab_html.classList.add('no-connect');
    },
    onConnect: function(){
        document.getElementById('video-title-id').classList.add('connected-title');
        this.tab_html.classList.remove('no-connect');
        this.tab_html.classList.remove('connecting');
        this.tab_html.classList.remove('disconnected');
        this.tab_html.classList.add('connected');
    },
    onJoin: function(){
        this.onConnect();
        document.getElementById('username-label-tab').textContent = ROOM.username;
        document.getElementById('roomid-label-tab').textContent = ROOM.roomId;
    },
    onDisconnect: function(){
        document.getElementById('video-title-id').classList.remove('connected-title');
        // this.tab_html.classList.remove('no-connect');
        // this.tab_html.classList.remove('connecting');
        // this.tab_html.classList.remove('connected');
        // this.tab_html.classList.add('disconnected');
    },
    
   

    joinRoom: function(){
        
        const username = document.getElementById('username-input').value;
        const roomId = document.getElementById('roomid-input').value;
        if(!validRoomInfo(username, roomId)){
            displayErrorOnScreen('Invalid username or room id format');
            return;
        }
        ROOM.join(username, roomId);
        SETTINGS.username = username;
        SETTINGS.roomId = roomId;
    },

    leaveRoom: function(){
        try {
            ROOM.leave();
        } catch (error) {
            console.error(error);
        }
    },
}

EVENTS.platform.addEventListener('room-tryingToJoin', (e)=>{
    ROOM_HTML_MANAGER.onTryingToJoin();
});

EVENTS.platform.addEventListener('room-joined', (e)=>{
    ROOM_HTML_MANAGER.onJoin();
});

EVENTS.platform.addEventListener('room-leaved', (e)=>{
    ROOM_HTML_MANAGER.onLeave();
    EXISTING_MESSEGE_HTML_MANAGER.people_html.innerHTML = '';
    EXISTING_MESSEGE_HTML_MANAGER.peopleDivs.clear();   
});

EVENTS.platform.addEventListener('mqtt-connected', (e)=>{
    ROOM_HTML_MANAGER.onConnect();
});

EVENTS.platform.addEventListener('mqtt-disconnected', (e)=>{
    ROOM_HTML_MANAGER.onDisconnect();
});


document.getElementById('roomid-input').addEventListener('keypress', (event)=>{
    if (event.key === 'Enter') {
      ROOM_HTML_MANAGER.joinRoom();
    }
});

