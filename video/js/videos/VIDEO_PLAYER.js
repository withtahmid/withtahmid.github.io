const ABSTRACTION_MESSEGE = 'This method must be implemented in child classes';
class __VIDEO_PLAYER__{
    constructor(player, sourceType){
        this.__player__ = player;
        this.__error_code__ = ERROR_CODE[sourceType];
        this.__sourceType__ = sourceType;
    }

    // abstract methods
    __init__(){}
    __destroy__(){
        try {
            document.querySelector('.video-container').classList.add('display-none');
            this.__emmitDestroyEvent__();
            this.__player__ = null;

        } catch (error) {
            console.error(error);
        }
        try{
            document.querySelector('.yt-player-container').classList.add('display-none');
            this.__player__ = null;
            this.__emmitDestroyEvent__();
        }catch( error ){
            console.error( error );
        }
    }

    // messege Handlers
    __handleCuedByMessege__(messege){}
    // launch new video
    __cueVideo__(){}
    
    // controls
    __playVideo__(seconds){}
    __pauseVideo__(seconds){}
    __seekTo__(seconds){}
    
    // get informations
    __getCurrentTime__(){return null;}
    __getPlayerState__(){return null;}
    __getTitle__(){return null;}
    __getDuration__(){return null;}
    __isPaused__(){return null;}
    __getIdentity__(){return null;}
    __fullscreen__(){return null;}
    __getSource__(){return null;}
    __getSourceType__(){return this.__sourceType__;}

    __emmitCuedEvent__(){
        const event = {name: 'cuedVideo'};
        event.data = {};
        event.data.__sourceType__ = this.__sourceType__;
        event.data.__time__ = TIME.now();
        EVENTS.emmit(event);
    }

    __emmitDestroyEvent__(){
        const event = {name: 'destroyedVideo'};
        event.data = {};
        event.data.__sourceType__ = this.__sourceType__;
        event.data.__time__ = TIME.now();
        EVENTS.emmit(event);
    }
}