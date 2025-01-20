// events related to room

/*
    when the user first joines the room
*/ 
EVENTS.platform.addEventListener('mqtt-first-connect', (e)=>{
    if(ROOM.isJoined()){
        console.error('ROOM is joined but MQTT fired first connect event');
        console.log(ROOM.joinTime)
        return;
    }
    ROOM.joinTime = TIME.now();
    EVENTS.directEmmit('room-joined');
});

/*
    when the user leaves the room
*/ 

EVENTS.platform.addEventListener('mqtt-ended', (e)=>{
    EVENTS.directEmmit('room-leaved');
});


