const MEDIA_MESSEGE = {

    emmitTimeOutId: null,
    handleTimeOutId: null,
    messegeInHandleQueue: null,
    messegeInEmmitQueue: null,
    handler: {
        playVideo: VIDEO.playVideoEx.bind(VIDEO),
        pauseVideo: VIDEO.pauseVideoEx.bind(VIDEO),
        seekTo: VIDEO.seekToEx.bind(VIDEO),
    },

    __get__: function(){
        const messege =  __MESSEGE_ABSTRACT__.get('media', 'all');
        messege.currentTime = VIDEO.__getCurrentTime__();
        messege.isPaused = VIDEO.__isPaused__();
        return messege;

    },
    __emmit__: function(){
        const messege = this.__get__();
        // if(this.messegeInEmmitQueue){
        //     console.log(Math.abs(this.messegeInEmmitQueue.__emmitTime__ - messege.__emmitTime__));
        // }
        if(!this.messegeInEmmitQueue || messege.__emmitTime__ > this.messegeInEmmitQueue.__emmitTime__){
            this.messegeInEmmitQueue = messege;
        }
        if(this.emmitTimeOutId){
            clearTimeout(this.emmitTimeOutId);
        }
        this.emmitTimeOutId = setTimeout(()=>{
            MESSEGE_HANDLER.emmit(this.messegeInEmmitQueue);
            this.messegeInEmmitQueue  = null;
        }, HYPERPARAMETER.mediaMessegeEmmitDelay);
    },
    __emmitImmediate__: function(){
        const messege = this.__get__();
        MESSEGE_HANDLER.emmit(messege);
    },

    __isFor__: function(messege){
        return messege.__sender__ != ROOM.getUsername();
    },
    __onFail__(messege){
        console.log('failed to send media event messege');
    },
    __handle__: function(messege){
        // const diff = Math.abs(TIME.now() - new Date(messege.__emmitTime__));
        // console.log(diff);
        if(!this.messegeInHandleQueue || messege.__emmitTime__ > this.messegeInHandleQueue.__emmitTime__){
            this.messegeInHandleQueue = messege;
        }
        if(this.handleTimeOutId){
            clearTimeout(this.handleTimeOutId);
        }
        this.handleTimeOutId = setTimeout(()=>{
            NOTIFICATION_MANAGER.manage(this.messegeInHandleQueue);
            if(this.messegeInHandleQueue.isPaused){
                this.handler.pauseVideo(this.messegeInHandleQueue.currentTime)
            }else{
                this.handler.playVideo(this.messegeInHandleQueue.currentTime)
            }
            this.messegeInHandleQueue  = null;
        }, HYPERPARAMETER.mediaMessegeHandleDelay);
    },
}

EVENTS.platform.addEventListener('video-play', MEDIA_MESSEGE.__emmit__.bind(MEDIA_MESSEGE));

EVENTS.platform.addEventListener('video-pause', MEDIA_MESSEGE.__emmit__.bind(MEDIA_MESSEGE));

EVENTS.platform.addEventListener('video-seeked',MEDIA_MESSEGE.__emmit__.bind(MEDIA_MESSEGE));
