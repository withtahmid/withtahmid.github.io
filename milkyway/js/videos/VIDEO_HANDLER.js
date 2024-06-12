
let ignoreEvent= {
    playVideo: false,
    pauseVideo: false,
    seekTo: false
};
 function ignoreNextEvent(eventType){
    ignoreEvent = {
        playVideo: true,
        pauseVideo: true,
        seekTo: true
    }
    setTimeout(()=> {
        ignoreEvent = {
            playVideo: false,
            pauseVideo: false,
            seekTo: false
        }
    }, HYPERPARAMETER.ignoreNextMedia);
}
const VIDEO = {
    
    players : {
        local : new LOCAL_VIDEO(),
        youtube: new YOUTUBE(),
    },
    
    __player__: new __VIDEO_PLAYER__(null, 'abstract'),
    // __player__: new YOUTUBE(),
    playerType: 'abstract',

    lastMediaOccured: 0,

    __init__: function(){
        try {
            this.__player__.__init__();
        } catch (error) {
            console.error(error);
        }
    },
    __destroy__: function(){
        try {
            this.__player__.__destroy__();
            this.__player__ = new __VIDEO_PLAYER__(null, 'abstract');
        } catch (error) {
            console.error(error)
        }
    },

    __handleCuedByMessege__: function(messege){
        // try {
        //     if(this.__getSourceType__() != messege.sourceType){
        //         this.__destroy__();
        //     }
        // } catch (error) {
        //     console.error(error)
        // }
        // try {
        //     this.__player__ = this.players[messege.sourceType];
        // } catch (error) {
        //     console.error(error)
        // }
        // try {
        //     this.__player__.__handleCuedByMessege__(messege);
        // } catch (error) {
        //     console.error(error)
        // }
    },

    __emmitCuedEvent__: function(){
        this.__player__.__emmitCuedEvent__();
    },

    __isCaptioning__: function(){
        try {
            return this.__player__.__isCaptioning__();
        } catch (error) {
            console.error(error)
        }
    },
    __addCaption__: function(file){
        try {
            this.__player__.__addCaption__(file);
        } catch (error) {
            console.error(error)
        }
    } ,

    // launch new video
    __cueVideo__: function(src){
        try {
            this.__player__.__cueVideo__(src)
        } catch (error) {
            console.error(error)
        }
    },
    
    // controls
    __playVideo__: function(seconds){
       try {
        this.__player__.__playVideo__(seconds);
       } catch (error) {
        console.error(error)
       }
    },
    __pauseVideo__: function(seconds){
        try {
            this.__player__.__pauseVideo__(seconds);
        } catch (error) {
            console.error(error)
        }
    },
    __seekTo__: function(seconds){
        try {
            this.__player__.__seekTo__(seconds);
        } catch (error) {
            console.error(error)
        }
    },
    
    // get informations
    __getCurrentTime__: function(){
        try {
            return this.__player__.__getCurrentTime__();
        } catch (error) {
            console.error(error);
        }
    },
    __getPlayerState__: function(){
        try {
            return this.__player__.__getPlayerState__();
        } catch (error) {
            console.error(error);
        }
    },
    __getTitle__: function(){
        try {
            return this.__player__.__getTitle__();
        } catch (error) {
            console.error(error);
        }
    },
    __getDuration__: function(){
        try {
            return this.__player__.__getDuration__();
        } catch (error) {
            console.error(error);
        }
    },
    __isPaused__: function(){
        try {
            return this.__player__.__isPaused__();
        } catch (error) {
            console.error(error);
        }
    },
    __fullscreen__: function(){
        try {
            return this.__player__.__fullscreen__();
        } catch (error) {
            console.error(error);
        }
    },
    __getIdentity__: function(){
        try {
            return this.__player__.__getIdentity__();
        } catch (error) {
            console.error(error);
        }
    },
    __getSource__: function(){
        try {
            return this.__player__.__getSource__();
        } catch (error) {
            console.error(error)
        }
        return 'null';
    },
    __getSourceType__: function(){
        try {
            return this.__player__.__getSourceType__();
        } catch (error) {
            console.error(error);
        }
        return 'null';
    },
    __isActive__: function(){
        return this.__player__.__isActive__();
    },

    __getSyncData__: function(){
        try {
            return this.__player__.__getSyncData__();
        } catch (error) {
            console.error(error);
        }
        return null;
    },
    __addToQueue__: function(video){
        try {
            this.__player__.__addToQueue__(video);
        } catch (error) {
            console.error(error);
        }
    },

    beLocal: function(){
        console.log('[CALLED] beLocal')
        try {
            if(this.__player__.__getSourceType__() != 'local'){
                this.__destroy__();
            }
        } catch (error) {
            console.error(error)
        }
        try {
            this.playerType = 'local';
            this.__player__ = this.players[this.playerType];
            this.__player__.__init__();
        } catch (error) {
            console.error(error);
        }
    },

    //
    playLocal: function(file){
        try {
            if(this.__player__.__getSourceType__() != 'local'){
                this.__destroy__();
            }
        } catch (error) {
            console.error(error)
        }
        try {
            this.playerType = 'local';
            this.__player__ = this.players[this.playerType];
            this.__player__.__cueVideo__(file);
        } catch (error) {
            console.error(error);
        }
    },
    beYouTube: function(){
        console.log('[CALLED] beYouTube')
        try {
            if(this.__player__.__getSourceType__() != 'youtube'){
                this.__destroy__();
            }
        } catch (error) {
            console.error(error)
        }
        try {
            this.playerType = 'youtube';
            this.__player__ = this.players[this.playerType];
            this.__player__.__init__();
        } catch (error) {
            console.error(error);
        }
    },
    playYouTube: function(url){
        // try {
        //     if(this.__player__.__getSourceType__() != 'youtube'){
        //         this.__destroy__();
        //     }
        // } catch (error) {
        //     console.error(error)
        // }
        // try {
        //     this.playerType = 'youtube';
        //     this.__player__ = this.players[this.playerType];
        //     this.__player__.__cueVideo__(url);
        // } catch (error) {
        //     console.error(error);
        // }
        throw new Error('playYouTube is depricated');
    },

    // event handlers
    onPlay: function(){
        this.lastMediaOccured = TIME.now();
        if(ignoreEvent.playVideo){
            ignoreEvent.playVideo = false;
            return;
        }
        try {
            EVENTS.directEmmit('video-play');
        } catch (error) {
            console.error(error);
        }
    },
    onPause: function(){
        this.lastMediaOccured = TIME.now();
        if(ignoreEvent.pauseVideo){
            ignoreEvent.pauseVideo = false;
            return;
        }
        try {
            EVENTS.directEmmit('video-pause');
        } catch (error) {
            console.error(error);
        }
    },

    onSeek: function(){
        this.lastMediaOccured = TIME.now();
        if(ignoreEvent.seekTo){
            // ignoreEvent.seekTo = false;
            return;
        }

        try {
            EVENTS.directEmmit('video-seeked');
        } catch (error) {
            console.error(error);
        }
    },

    getLastMediaTime: function(){
        return this.lastMediaOccured;
    },

    playVideoEx: function(seconds){
        ignoreNextEvent();
        try {
            this.__playVideo__(seconds);
        } catch (error) {
            console.error(error);
        }
    },
    pauseVideoEx: function(seconds){
        ignoreNextEvent();
        try {
            this.__pauseVideo__(seconds);
        } catch (error) {
            console.error(error);
        }
    },
    seekToEx: function(seconds){
        ignoreNextEvent();
        try {
            this.__seekTo__(seconds);
        } catch (error) {
            console.error(error);
        }
    },

    emmitPlayedEvent: function(){
        const event = {name: 'newVideoPlayed'};
        event.data = {};
        event.data.__sourceType__ = this.__player__.__sourceType__;
        event.data.__time__ = TIME.now();
       try {
        EVENTS.emmit(event);
       } catch (error) {
        console.error(error);
       }
    },

}