const videoFileInput = document.getElementById('video-file-input');
const subtitlesFileInput = document.getElementById('subtitle-file-input');

// 



const VIDEO = {
    // 
    video: document.getElementById('videoPlayer'),
    videoSource: document.getElementById('videoSource'),
    container:  document.querySelector(".video-container"),
    // 
    subtitlesTrack: document.getElementById('subtitlesTrack'),
    
    videoFileName: null,
    // 
    subtitleURL:null,
    subtitleFileName: null,

    //
    sourceType: null,
    sourceURL: null,

    videoAdded: false,
    subtitleAdded: false,

    ignorePlay: false,
    ignorePause: false,
    ignoreSeeked: false,
    ignoreMediaEvent: false,

    allowChatOnScreen: true,


    // 
    init: function(){
        this.video.addEventListener('play', this.playEvent);
        this.video.addEventListener('pause', this.pauseEvent);
        this.video.addEventListener('seeked', this.seekEvent);

    },

    resetIgnoreMedia: function(){
        setTimeout(()=>{
            // ignorePlay = false;
            // ignorePause = false;
            // ignoreSeeked = false;
            this.ignoreMediaEvent = true;
        },2000)
    },
    
    // 
    playEvent: function(){
        if(this.ignorePlay){
            this.ignorePlay = false;
            return;
        }
        ROOM.sendMessage(MESSAGE.media('play'));
    },

    pauseEvent: function(){
        if(this.ignorePause){
            this.ignorePause = false;
            return;
        }
        ROOM.sendMessage(MESSAGE.media('pause'));
    },

    seekEvent: function(){
        if(this.ignoreSeeked){
            this.ignoreSeeked = false;
            return;
        }
        ROOM.sendMessage(MESSAGE.media('seeked'));
        
    },
   
    play: function(time){
        this.ignorePlay = true;
        this.ignoreSeeked = true;
        this.video.currentTime = Number(time);
        this.video.play()
    },

    pause: function(time){
        this.ignorePause = true;
        this.ignoreSeeked = true;
        this.video.currentTime = Number(time);
        this.video.pause()
    },

    seek: function(time){
        this.ignoreSeeked = true;
        this.video.currentTime = Number(time);
    },

    playVideo: function(source, filename, type){
        if(!source) {
            displayErrorOnScreen('No video source found')
            return;
        }
        const videoSources = ['local', 'dirLink']
        this.videoAdded = true;
        
        this.videoSource.src = source;
        this.sourceURL = source;
        
        this.changeVideoFileName(filename);
        this.sourceType = videoSources[type];
        this.video.load();
        this.changed();
        // this.resetSubtitle();
    },

    resetSubtitle: function(){
        this.subtitlesTrack.src = "";
        this.subtitleAdded = false;
        this.subtitleFileName = null;
        this.changeSubtitleFileName('No subtitle is added');
    },

    addSubtitle: function(source, filename){
        if(!source) {
            return;
        }
        this.subtitleAdded = true;
        this.subtitlesTrack.src = source;
        this.subtitleURL = source;
        this.video.textTracks[0].mode = 'showing';
        this.changeSubtitleFileName(filename);
        this.changed();
    },

    changeVideoFileName: function(fileName){
        this.videoFileName = fileName;
        document.getElementById('video-filename-tab').textContent = fileName;
        document.getElementById('video-filename-title').textContent = fileName;
    },
    changeSubtitleFileName: function(fileName){
        this.subtitleFileName = fileName;
        document.getElementById('subtile-filename-tab').textContent = fileName;
    },
    changed: function(){
        ROOM.broadcastExisTance();
    },
    isFullScreen: function(){
        return (
            document.fullscreenElement === this.container ||
            document.webkitFullscreenElement === this.container ||
            document.mozFullScreenElement === this.container ||
            document.msFullscreenElement === this.container
          );
    },
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

VIDEO.init();

// Listeners
/*-----------------------------------------------------------*/
videoFileInput.addEventListener('change', ()=> {
    // videoPlayer.setAttribute('data-yt2html5', '');
    // videoPlayer.removeAttribute('src');
    const file = videoFileInput.files[0];
    VIDEO.playVideo(URL.createObjectURL(file), file.name, 0)

});

subtitlesFileInput.addEventListener('change', function() {
    var subtitleFile = subtitlesFileInput.files[0];
    filename = subtitleFile.name;             
    // var subtitleURL;
    var subtitleExtension = subtitleFile.name.split('.').pop().toLowerCase();
    if (subtitleExtension === 'vtt') {
        VIDEO.addSubtitle(URL.createObjectURL(subtitleFile),filename )

    } 
    // else if (subtitleExtension === 'srt') {
    //     var reader = new FileReader();
    //     reader.onload = function(event) {
    //         var convertedSubtitles = convertSrtToVtt(event.target.result);
    //         var blob = new Blob([convertedSubtitles], { type: 'text/vtt' });
    //         subtitleURL = URL.createObjectURL(blob);
    //         addUrlToTrack(subtitleURL);
    //         showSubtitleName(filename);
    //     };
    //     reader.readAsText(subtitleFile);
    // } 
    else {
        alert('Unsupported subtitle format. Please choose a VTT or SRT file.');
        return;
    }
    videoContainer.classList.toggle("captions", VIDEO.video.textTracks[0].mode !== "hidden" )
});

// manual


// Functions
/*-----------------------------------------------------------*/
// function playDirectUrl(){
//     const url = ;
    
// }
