class LOCAL_VIDEO extends __VIDEO_PLAYER__{
    constructor(){
        super(null, 'local');
        this.source_html = document.getElementById('videoSource');
        this.caption_html = document.getElementById('subtitlesTrack');
        this.title = null;
        this.container_html =  document.querySelector(".video-container");
        this.initiated = false;
        this.caption = false;
    }
     // abstract methods
     __init__(){
        console.log(`__init__ LOCAL_VIDEO called`)
        try {
            document.getElementById('video-section').classList.add('local-video-player');
            this.__player__ = document.getElementById('videoPlayer');
            this.__player__.addEventListener('play', VIDEO.onPlay.bind(VIDEO));
            this.__player__.addEventListener('pause', VIDEO.onPause.bind(VIDEO));
            this.__player__.addEventListener('seeked', VIDEO.onSeek.bind(VIDEO));
        } catch (error) {
            console.error(error);
        }
     }
     __destroy__(){
        try {
            document.getElementById('video-section').classList.remove('local-video-player');
            document.getElementById('video-filename-tab').textContent = '';
            document.getElementById('video-filename-title').textContent = '';
            this.__player__.pause();
            this.source_html.src = '';
            this.__player__.load();
            this.__emmitDestroyEvent__();
            this.__player__ = null;
            this.caption_html.src = '';
            this.caption = false;
            this.title = null;

        } catch (error) {
            console.error(error);
        }
     }
    __handleCuedByMessege__(messege){
        try {
            console.log(`${messege.__sender__} played local video`);
            if(this.__player__ === null){
                this.__init__();
            }
        } catch (error) {
            console.error( error );
        }
    }
       // launch new video
    __cueVideo__(file){
        if(this.__player__ == null){
            this.__init__();
        }
        if(!file){
            return; // need to work here
        }
        try{
            console.log(`LOCAL_VIDEO __cueVideo__ : ${file.name}`);
            this.source_html.src = URL.createObjectURL(file);
            this.__resetCaption()
            this.__player__.load();
            this.title = file.name;
            this.__emmitCuedEvent__();
            this.__setVideoTitle()
        }catch(error){
            console.error(error);
        }
    }

    __addCaption__(file){
        if(!file){
            return;
        }
        this.caption = true;
        try {
            this.caption_html.src = URL.createObjectURL(file);
            this.captionTitle = file.name;
            this.__setCaptionTitle();
            console.log(`[CALLED] __addCaption__ with ${file.name}`);
        } catch (error) {
            console.error(error);
        }
        try {
            this.__player__.textTracks[0].mode = 'showing'
        } catch (error) {
            console.error(error);
        }
        
        this.container_html.classList.toggle("captions", VIDEO.__isCaptioning__())
    }
    __setVideoTitle(){
        document.getElementById('video-filename-tab').textContent = this.title;
        document.getElementById('video-filename-title').textContent = this.title;
    }
    __setCaptionTitle(){
        document.getElementById('subtile-filename-tab').textContent = this.captionTitle;
    }
    __isCaptioning__(){
        return this.__player__.textTracks[0].mode !== "hidden"
    }
    __resetCaption(){
        this.caption_html.src = '';
        this.__player__.textTracks[0].mode = 'hidden'
        document.getElementById('subtile-filename-tab').textContent = '';
    }
    // controls
    __playVideo__(seconds){
        try {
            this.__player__.currentTime = seconds;
            this.__player__.play();
        } catch (error) {
            console.error(error);
        }
    }
    __pauseVideo__(seconds){
        try {
            this.__player__.pause();
            this.__player__.currentTime = seconds;
        } catch (error) {
            console.error(error);
        }
    }
    __seekTo__(seconds){
        try {
            this.__player__.currentTime = seconds;
        } catch (error) {
            console.error(error);
        }
    }
    __getCurrentTime__(){
        return this.__player__.currentTime ?? 0;
    }
    __getPlayerState__(){
        return this.__player__.paused ? 2 : 1;
    }

    __getTitle__(){
        return this.title;
    }
    __getDuration__(){
        return video.duration;
    }
    __isPaused__(){
        try {
            return this.__player__.paused;
        } catch (error) {
            console.error(error);
        }
    }
    __getIdentity__(){
        try {
            return 'LOCAL_VIDEO_DOESNT_MATCH_NAME';
        } catch (error) {
            console.error(error);
        }
    }
    __fullscreen__(){
        return (
                document.fullscreenElement === this.container_html ||
                document.webkitFullscreenElement === this.container_html ||
                document.mozFullScreenElement === this.container_html ||
                document.msFullscreenElement === this.container_html
            );
    }
    __getSource__(){
        return ''
    }
    __isActive__(){return this.title!= null;}
    __getSyncData__(){
        const syncData = {};
        syncData.playerType = 'local';
        syncData.currentTime = this.__getCurrentTime__();
        syncData.isPaused = this.__isPaused__();
        return syncData;
    }
}

// will work later
const videoFileInput = document.getElementById('video-file-input');
videoFileInput.addEventListener('change', ()=> {
    const file = videoFileInput.files[0];
    try {
        VIDEO.beLocal();
    } catch (error) {
        console,error(error);
    }
    try {
        VIDEO.playLocal(file);
    } catch (error) {
        console,error(error);
    }
});