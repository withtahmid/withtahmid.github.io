function onYTPlayerError(){
    displayErrorOnScreen('Youtube caused an error', "YouTube :')")
}
function onYTPlayerReady(){
    VIDEO.__emmitCuedEvent__();
    // const ytSync = VIDEO.ytSync;
    // if(ytSync.active){
    //     ytSync.paused ? VIDEO.pause(ytSync.time) : VIDEO.play(ytSync.time);
    //     VIDEO.ytSync = {
    //         active: false,
    //         time: 0,
    //         paused: true,
    //     };
    //     return;
    // }
    // if(VIDEO.ignoreNewVideoEvent){
    //     VIDEO.ignoreNewVideoEvent = false;
    //     return;
    // }
    // ROOM.sendMessage(MESSAGE.newVideo(VIDEO.ytPlayer.getVideoUrl()));
}

function onYTPlayerStateChange(event){
    const state = event.data;
    if(state === 1){
        VIDEO.onPlay();
    }else if(state === 2){
        VIDEO.onPause();
    }else if(state === 5){
        VIDEO.__emmitCuedEvent__();
    }
}

class YOUTUBE extends __VIDEO_PLAYER__{
    constructor(){
        super(null, 'youtube');

    }
     // abstract methods
     __init__(videoId){
        console.log(`__init__ YOUTUBE called`)
        try {
            document.querySelector('.yt-player-container').classList.remove('display-none');
            this.__player__ = new YT.Player('yt-video-player', {
                height: document.querySelector('.yt-player-container').offsetHeight.toString(),
                width: document.querySelector('.yt-player-container').offsetWidth.toString(),
                videoId: videoId,
                playerVars: {
                    'playsinline': 1
                },
                events: {
                    'onReady': onYTPlayerReady,
                    'onStateChange': onYTPlayerStateChange,
                    'onError': onYTPlayerError,
                }
            });
        } catch (error) {
            console.error(error);
        }

     }
     __destroy__(){
        try{
            document.querySelector('.yt-player-container').classList.add('display-none');
            this.__player__.destroy();
            this.__player__ = null;
            this.__emmitDestroyEvent__();
        }catch( error ){
            console.error( error );
        }
     }
     __handleCuedByMessege__(messege){
        try {
            console.log(`${messege.__sender__} played YouTube video`);
            this.__cueVideo__(messege.source);
        } catch (error) {
            console.error( error );
        }
        
     }


       // launch new video
    __cueVideo__(mediaContentUrl, startSeconds = 0){
        try {
            this.__cueVideoById(this.__urlToId(mediaContentUrl), startSeconds);
            console.log(`YOUTUBE __cueVideo__ : ${mediaContentUrl}`);
        } catch (error) {
            console.error( error );
        }
        
        
    }
    // controls
    __playVideo__(seconds){
        try{
            this.__player__.seekTo(seconds);
            this.__player__.playVideo();
        }catch( error ){
            console.error( error );
        }
    }
    __pauseVideo__(seconds){
        try{
            this.__player__.pauseVideo();
            this.__player__.seekTo(seconds);
        }catch( error ){
            console.error( error );
        }
    }
    __seekTo__(seconds, allowSeekAhead = false){
        try{
            this.__player__.seekTo(seconds, allowSeekAhead);
        }catch( error ){
            console.error( error );
        }
    }
    __getCurrentTime__(){
        try{
            return this.__player__.getCurrentTime();
        }catch( error ){
            console.error( error );
        }
        return this.__error_code__;
    }
    __getPlayerState__(){
        try {
            return this.__player__.getPlayerState();
        } catch (error) {
            console.error(error);
        }
        return this.ERROR_CODE;
    }
    __isPaused__(){
        try {
            return this.__player__.getPlayerState() === 2;
        } catch (error) {
            console.error(error);
        }
    }
    __getIdentity__(){
        try {
            return this.__urlToId(this.__getVideoUrl());
        } catch (error) {
            console.error(error);
        }
    }

    __getTitle__(){
        return 'playing from TouTube'; // need to work here
    }
    __getDuration__(){
        return this.__player__.getDuration();
    }
    __fullscreen__(){
        return false; // need to work here
    }
    __getSource__(){
        return this.__getVideoUrl();
    }

    // own functions
    __cueVideoById(videoId, startSeconds = 0){
        if(this.__player__ === null){
            this.__init__(videoId);
            return;
        }
        try {
            this.__player__.cueVideoById({
                videoId: videoId,
                startSeconds: startSeconds
            });
        } catch (error) {
            console.error(error)
        }
    }
    __cueVideoByUrl(mediaContentUrl, startSeconds = 0){
        if(this.__player__ === null){
            this.__init__(this.__urlToId(mediaContentUrl));
            return;
        }
        try {
            this.__player__.cueVideoByUrl({
                mediaContentUrl: mediaContentUrl,
                startSeconds: startSeconds
            });
        } catch (error) {
            console.error(error)
        }
    }
    __loadVideoById(videoId, startSeconds = 0){
        if(this.__player__ === null){
            this.__init__(videoId);
            return;
        }
        try {
            this.__player__.loadVideoById({
                videoId: videoId,
                startSeconds: startSeconds
            });
        } catch (error) {
            console.error(error)
        }
    }
    __loadVideoByUrl(mediaContentUrl, startSeconds = 0){
        if(this.__player__ === null){
            this.__init__(this.__urlToId(mediaContentUrl));
            return;
        }
        try {
            this.__player__.loadVideoByUrl({
                mediaContentUrl: mediaContentUrl,
                startSeconds: startSeconds
            });
        } catch (error) {
            console.error(error)
        }
    }
    __getVideoUrl(){
        try {
            return this.__player__.getVideoUrl();
        } catch (error) {
            console.error(error)
        }
    }
    __urlToId(url){
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
}