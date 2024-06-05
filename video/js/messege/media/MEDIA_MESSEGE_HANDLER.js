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
        const ret = {ignore: false};
        if(!SETTINGS.inSync){
            ret.ignore = true;
            ret.messege = `inSync: ${SETTINGS.inSync}`;
            return ret;
        }
        const myVideoActive = VIDEO.__isActive__()
        if(!myVideoActive){
            ret.ignore = true;
            ret.messege = `myVideoActive: ${myVideoActive}`;
            return ret;
        }
        const emmitRecieveGap = Math.floor((TIME.now() - new Date(messege.__emmitTime__)) / 1000);
        const playTimeGap = Math.abs(VIDEO.__getCurrentTime__() - messege.currentTime);
        const myVideoPaused = VIDEO.__isPaused__();
        if( myVideoPaused === messege.isPaused && (playTimeGap <= HYPERPARAMETER.mediaMissMatchTol)){
            ret.ignore = true;
            ret.messege = `myVideoPaused: ${VIDEO.__isPaused__()}\nmessege.isPaused: ${messege.isPaused}\nplayTimeGap: ${playTimeGap}`;
            return ret;
        }
        
        return ret;
    }
    execute(messege){
        EXISTING_MESSEGE_HTML_MANAGER.updateMediaErrorBar(messege);
        const ignoreStatus = this.canIgnore(messege);
        if(ignoreStatus.ignore){
            console.log('[MEDIA MESSEGE IGNORED]');
            console.log(ignoreStatus.messege);
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