
// 




const VIDEO = {
    // 
    // video: document.getElementById('videoPlayer'),
    // videoSource: document.getElementById('videoSource'),
    // container:  document.querySelector(".video-container"),
    // 
    // subtitlesTrack: document.getElementById('subtitlesTrack'),
    
    // videoFileName: null,
    // 
    // subtitleURL:null,
    // subtitleFileName: null,

    //
    // diffToll: 5,
    
    //
    // sourceType: 'null',
    // sourceURL: null,

    // videoAdded: false,
    // subtitleAdded: false,

    // ignorePlay: false,
    // ignorePause: false,
    // ignoreSeeked: false,
    // ignoreMediaEvent: false,

    // ignoreNewVideoEvent: false,

    allowChatOnScreen: true,


    // /*YouTube*/
    // ytPlayer:  null,
    // ytContainer: document.querySelector('.yt-player-container'),
    // ytSync:{
    //     active: false,
    //     time: 0,
    //     paused: true
    // },
    // // 
  

    // resetIgnoreMedia: function(){
    //     setTimeout(()=>{
    //         // ignorePlay = false;
    //         // ignorePause = false;
    //         // ignoreSeeked = false;
    //         this.ignoreMediaEvent = true;
    //     },2000)
    // },
    
    // // 
    // playEvent: function(){
    //     if(this.ignorePlay){
    //         this.ignorePlay = false;
    //         return;
    //     }
    //     ROOM.sendMessage(MESSAGE.media('play'));
    // },

    // pauseEvent: function(){
    //     if(this.ignorePause){
    //         this.ignorePause = false;
    //         return;
    //     }
    //     ROOM.sendMessage(MESSAGE.media('pause'));
    // },

    // seekEvent: function(){
    //     if(this.ignoreSeeked){
    //         this.ignoreSeeked = false;
    //         return;
    //     }
    //     ROOM.sendMessage(MESSAGE.media('seeked'));
        
    // },
    // init: function(){
    //     this.video.addEventListener('play', this.playEvent);
    //     this.video.addEventListener('pause', this.pauseEvent);
    //     this.video.addEventListener('seeked', this.seekEvent);

    // },
    // play: function(time){
    //     if(this.sourceType == 'youtube'){
    //         this.ytPlayer.seekTo(Number(time));
    //         this.ytPlayer.playVideo();
    //         return;
    //     }
    //     this.ignorePlay = true;
    //     this.ignoreSeeked = true;
    //     this.video.currentTime = Number(time);
    //     this.video.play()
    // },

    // pause: function(time){
    //     if(this.sourceType == 'youtube'){
    //         this.ytPlayer.pauseVideo();
    //         this.ytPlayer.seekTo(Number(time));
    //         return;
    //     }
    //     this.ignorePause = true;
    //     this.ignoreSeeked = true;
    //     this.video.currentTime = Number(time);
    //     this.video.pause()
    // },

    // seek: (time)=>{
    //     if(this.sourceType == 'youtube'){
    //         return;
    //     }
    //     this.ignoreSeeked = true;
    //     this.video.currentTime = Number(time);
    // },

    // currentTime: function(){
    //     if(!this.videoAdded){
    //         return 0;
    //     }
    //     if(this.sourceType == 'youtube'){
    //         return this.ytPlayer.getCurrentTime();
    //     }
    //     return this.video.currentTime;
    // },

    // isPaused: function(){
    //     if(!this.videoAdded){
    //         return true;
    //     }
    //     if(this.sourceType == 'youtube'){
    //         return this.ytPlayer.getPlayerState() == 2;
    //     }
    //     return this.video.paused;
    // },
 
    // playLocalVideo: function(source, filename){
    //     try{
    //         this.sourceURL = null;
    //         this.ytPlayer.destroy();
    //     }
    //     catch(e){
    //         console.error(e);
    //     }
    //     document.querySelector('.video-container').classList.remove('display-none');
    //     document.querySelector('.yt-player-container').classList.add('display-none');
    //     this.changeVideoFileName(filename);
    //     this.videoSource.src = source;
    //     this.video.load();
    //     ROOM.sendMessage(MESSAGE.newVideo());
    // },


    //YOUTUBE STARTS 
    
    // playYouTubeVideo: function(url, filename){
    //     try{
    //         moveOffVideo();
    //     }catch(e){
    //         console.error(e)
    //     }
    //     try{
    //         this.video.pause();
    //         this.videoSource.src = '';
    //         this.video.load();
    //         this.ytPlayer.destroy();
    //     }
    //     catch(e){
    //         console.error(e);
    //     }
       
    //     document.querySelector('.video-container').classList.add('display-none');
    //     document.querySelector('.yt-player-container').classList.remove('display-none');
    //     YOUTUBE.cueVideoByUrl(url);
    //     // this.changeVideoFileName(filename);
    // },

    // playVideo: function(source, type, filename){
    //     if(!source) {
    //         displayErrorOnScreen('No video source found')
    //         return;
    //     }
        
    //     this.videoAdded = true;
    //     this.sourceType = type;
    //     if(this.sourceType === 'local'){
    //         this.playLocalVideo(source, filename);
    //     }else if(this.sourceType === 'youtube'){
    //        this.playYouTubeVideo(source, filename); 
    //     } 
    //     this.sourceURL = source;
    //     this.changed();
    //     this.resetSubtitle();
    // },

    // resetSubtitle: function(){
    //     this.subtitlesTrack.src = "";
    //     this.subtitleAdded = false;
    //     this.subtitleFileName = null;
    //     this.changeSubtitleFileName('No subtitle is added');
    // },

    // addSubtitle: function(source, filename){
    //     if(!source) {
    //         return;
    //     }
    //     this.subtitleAdded = true;
    //     this.subtitlesTrack.src = source;
    //     this.subtitleURL = source;
    //     this.video.textTracks[0].mode = 'showing';
    //     this.changeSubtitleFileName(filename);
    //     this.changed();
    // },

    // changeVideoFileName: function(fileName){
    //     this.videoFileName = fileName;
    //     document.getElementById('video-filename-tab').textContent = fileName;
    //     document.getElementById('video-filename-title').textContent = fileName;
    // },
    // changeSubtitleFileName: function(fileName){
    //     this.subtitleFileName = fileName;
    //     document.getElementById('subtile-filename-tab').textContent = fileName;
    // },
    changed: function(){
        ROOM.broadcastExisTance();
    },
    // isFullScreen: function(){
    //     return (
    //         document.fullscreenElement === this.container ||
    //         document.webkitFullscreenElement === this.container ||
    //         document.mozFullScreenElement === this.container ||
    //         document.msFullscreenElement === this.container
    //       );
    // },
    toggleChatOnVideoPermission: function(val){
        if(val){
            this.allowChatOnScreen = true;
        }
        else{
            this.allowChatOnScreen = false;
        }
        // ROOM.broadcastExisTance();
    },

}

// VIDEO.init();

/*-----------------------------------------------------------*/





// Functions
/*-----------------------------------------------------------*/
// function playDirectUrl(){
//     const url = ;
    
// }
// function playYoutubeById(){
//     const url = document.getElementById('youtube-url-input').value;
//     VIDEO.playYouTube(url);
// }


