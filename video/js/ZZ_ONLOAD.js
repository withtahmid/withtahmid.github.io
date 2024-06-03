

window.onload = async function() {
    const username = SETTINGS.username;
    const roomId = SETTINGS.roomId;
    const autoJoin = SETTINGS.autoJoin
    const volumeIndex = SETTINGS.notificationVolumeIndex;
    document.getElementById('username-input').value = username;
    document.getElementById('roomid-input').value = roomId;
    if(username && roomId && autoJoin == true){
        ROOM.join(username, roomId);
    }
    NOTIFICATION_BELL.setIndex(volumeIndex);
};