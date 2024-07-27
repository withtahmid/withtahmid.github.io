window.onload = async function() {
    SETTINGS.apply();
    const username = SETTINGS.username;
    const roomId = SETTINGS.roomId;
    const autoJoin = SETTINGS.autoJoin   
    if(username && roomId && autoJoin == true){
        ROOM.join(username, roomId);
    }
};

