const MEDIA_MESSEGE = {

    emmitTimeOutId: null,
    messegeInEmmitQueue: null,
    
    __get__: function(){
        const messege =  __MESSEGE_ABSTRACT__.get('media', 'all');
        messege.currentTime = VIDEO.__getCurrentTime__();
        messege.isPaused = VIDEO.__isPaused__();
        messege.__dontEmmit__ = SETTINGS.inSync ? false : true;
        return messege;
    },
    __emmit__: function(){
        const messege = this.__get__();
        if(!this.messegeInEmmitQueue || messege.__emmitTime__ > this.messegeInEmmitQueue.__emmitTime__){
            this.messegeInEmmitQueue = messege;
        }
        if(this.emmitTimeOutId){
            clearTimeout(this.emmitTimeOutId);
        }
        this.emmitTimeOutId = setTimeout(()=>{
            EXISTING_MESSEGE.pauseForAWhile();
            MESSEGE_EMMITTER.__emmit__(this.messegeInEmmitQueue);
            this.messegeInEmmitQueue  = null;
        }, HYPERPARAMETER.mediaMessegeEmmitDelay);
    },
    __emmitImmediate__: function(){
        const messege = this.__get__();
        MESSEGE_EMMITTER.__emmit__(messege);
    },
}

EVENTS.platform.addEventListener('video-play', MEDIA_MESSEGE.__emmit__.bind(MEDIA_MESSEGE));

EVENTS.platform.addEventListener('video-pause', MEDIA_MESSEGE.__emmit__.bind(MEDIA_MESSEGE));

EVENTS.platform.addEventListener('video-seeked',MEDIA_MESSEGE.__emmit__.bind(MEDIA_MESSEGE));
