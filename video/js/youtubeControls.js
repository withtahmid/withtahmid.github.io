function onYTPlayerError(){
    displayErrorOnScreen('Youtube caused an error', "YouTube :')")
}
function onYTPlayerReady(){
    const ytSync = VIDEO.ytSync;
    if(ytSync.active){
        ytSync.paused ? VIDEO.pause(ytSync.time) : VIDEO.play(ytSync.time);
        VIDEO.ytSync = {
            active: false,
            time: 0,
            paused: true,
        };
        return;
    }
    if(VIDEO.ignoreNewVideoEvent){
        VIDEO.ignoreNewVideoEvent = false;
        return;
    }
    ROOM.sendMessage(MESSAGE.newVideo(VIDEO.ytPlayer.getVideoUrl()));
}
function onYTPlayerStateChange(event){
    const state = event.data;
    if(state === 1){
        VIDEO.playEvent();
    }else if(state === 2){
        VIDEO.pauseEvent();
    }
}
