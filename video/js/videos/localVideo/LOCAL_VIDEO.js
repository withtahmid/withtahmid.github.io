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
            document.querySelector('.video-container').classList.remove('display-none');
            this.__player__ = document.getElementById('videoPlayer');
            this.__player__.addEventListener('play', VIDEO.onPlay);
            this.__player__.addEventListener('pause', VIDEO.onPause);
            this.__player__.addEventListener('seeked', VIDEO.onSeek);
        } catch (error) {
            console.error(error);
        }
     }
     __destroy__(){
        try {
            document.querySelector('.video-container').classList.add('display-none');
            this.__player__.pause();
            this.source_html.src = '';
            this.__player__.load();
            this.__emmitDestroyEvent__();
            this.__player__ = null;
            this.caption_html.src = '';
            this.caption = false;

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
            document.querySelector('.video-container').classList.remove('display-none');
            this.source_html.src = URL.createObjectURL(file);
            this.__resetCaption()
            this.__player__.load();
            this.title = file.name;
            this.__emmitCuedEvent__();
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
            console.log(`caption added`);
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
    __isCaptioning__(){
        return this.__player__.textTracks[0].mode !== "hidden"
    }
    __resetCaption(){
        this.caption_html.src = '';
        this.__player__.textTracks[0].mode = 'hidden'
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
        return this.__player__.currentTime;
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
            return this.__getTitle__();
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
}

// will work later
const videoFileInput = document.getElementById('video-file-input');
videoFileInput.addEventListener('change', ()=> {
    const file = videoFileInput.files[0];
    try {
        VIDEO.playLocal(file);
    } catch (error) {
        
    }
});