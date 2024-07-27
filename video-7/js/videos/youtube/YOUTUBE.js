
class YOUTUBE extends __VIDEO_PLAYER__{
    constructor(){
        super(null, 'youtube');

    }
     // abstract methods
     __init__(videoId = null){
        console.log(`__init__ YOUTUBE called`)
        try {
            document.getElementById('video-section').classList.add('youtube-player');
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
            document.getElementById('video-section').classList.remove('youtube-player');
            this.__player__.destroy();
            this.__player__ = null;
            this.__emmitDestroyEvent__();
            YOUTUBE_MANAGER.__destroy__();
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
        // try {
        //     this.__cueVideoById(this.__urlToId(mediaContentUrl), startSeconds);
        //     console.log(`YOUTUBE __cueVideo__ : ${mediaContentUrl}`);
        // } catch (error) {
        //     console.error( error );
        // }
        throw new Error('__cueVideo__ of Youtube should not be called');
        
    }
    __isCaptioning__(){
        return false;
    }
    __addCaption__(file){}
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
            
            return  this.__player__.getCurrentTime ? this.__player__.getCurrentTime() : 0;
        }catch( error ){
            console.error( error );
        }
        return this.__error_code__;
    }
    __getPlayerState__(){
        try {
            return this.__player__.getPlayerState ? this.__player__.getPlayerState() : null;
        } catch (error) {
            console.error(error);
        }
        return this.ERROR_CODE;
    }
    __isPaused__(){
        try {
            return this.__player__.getPlayerState ? this.__player__.getPlayerState() === 2 : true;
        } catch (error) {
            console.error(error);
        }
    }
    __getIdentity__(){
        try {
            return YOUTUBE_MANAGER.getCurrentVideoId();
        } catch (error) {
            console.error(error);
        }
        return null;
    }

    __getTitle__(){
        try {
            return YOUTUBE_MANAGER.getCurrentVideoTitle() ?? null;
        } catch (error) {
            console.error(error);
        }
        return null;
    }
    __getDuration__(){
        return this.__player__.getDuration();
    }
    __fullscreen__(){
        return (
            document.fullscreenElement === this.__player__ ||
            document.webkitFullscreenElement === this.__player__ ||
            document.mozFullScreenElement === this.__player__ ||
            document.msFullscreenElement === this.__player__
        );
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
    __isPaused__(){
        const state = this.__player__.getPlayerState();
        return state !=  1;
    }
    __getSyncData__(){
        return getYoutubeSyncData();
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
    __isActive__(){
       try {
        return YOUTUBE_MANAGER.__isActive__();
       } catch (error) {
        console.error(error)
       }
       return false;
    }

    __addToQueue__(url){
        return;
    }
}