class MEDIA_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('media');
        this.messegeInHandleQueue  = null;
        this.handleTimeOutId = null;
        this.handler = {
            playVideo: VIDEO.playVideoEx.bind(VIDEO),
            pauseVideo: VIDEO.pauseVideoEx.bind(VIDEO),
            seekTo: VIDEO.seekToEx.bind(VIDEO),
        };
    }
    canIgnore(messege){
        const emmitRecieveGap = Math.floor((TIME.now() - new Date(messege.__emmitTime__)) / 1000);
        const playTimeGap = Math.abs(VIDEO.__getCurrentTime__() - messege.currentTime);
        if(VIDEO.__isPaused__() === messege.isPaused && (playTimeGap <= HYPERPARAMETER.mediaMissMatchTol)){
            console.log('Condition');
            return true;
        }
        if(!VIDEO.__isActive__()){
            console.log('!VIDEO.__isActive__()', !VIDEO.__isActive__());
            return true;
        }
        return false;
    }
    execute(messege){
        EXISTING_MESSEGE_HTML_MANAGER.updateMediaErrorBar(messege);
        if(this.canIgnore(messege)){
            console.log('[MEDIA IGNORED]');
            return;
        }
        NOTIFICATION_MANAGER.manage(messege);
        if(messege.isPaused){
            this.handler.pauseVideo(messege.currentTime)
        }else{
            this.handler.playVideo(messege.currentTime)
        }
    }
    __isFor__(messege){
        return messege.__sender__ != ROOM.getUsername();
    }
    __handle__(messege){
        if(!this.messegeInHandleQueue || messege.__emmitTime__ > this.messegeInHandleQueue.__emmitTime__){
            this.messegeInHandleQueue = messege;
        }
        if(this.handleTimeOutId){
            clearTimeout(this.handleTimeOutId);
        }
        this.handleTimeOutId = setTimeout(()=>{
            this.execute(this.messegeInHandleQueue);
            this.messegeInHandleQueue  = null;
        }, HYPERPARAMETER.mediaMessegeHandleDelay);
    }
}