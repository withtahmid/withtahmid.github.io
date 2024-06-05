// events related to room

/*
    when the user first joines the room
*/ 
EVENTS.platform.addEventListener('mqtt-first-connect', (e)=>{
    if(ROOM.isJoined()){
        console.error('ROOM is joined but MQTT fired first connect event');
        return;
    }
    ROOM.joinTime = TIME.now();
    EVENTS.directEmmit('room-joined');
});

/*
    when the user leaves the room
*/ 

EVENTS.platform.addEventListener('mqtt-ended', (e)=>{
    ROOM.joinTime = null;
    EVENTS.directEmmit('room-leaved');
});
