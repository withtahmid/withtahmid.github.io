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
        const transmissionTime = TIME.sAgo(messege.__emmitTime__);
        if( transmissionTime >= 2){
            ret.ignore = true;
            ret.messege `transmissionTime: ${transmissionTime}`;
            return ret;
        }
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
        const playTimeGap = Math.abs(VIDEO.__getCurrentTime__() - messege.currentTime);
        const myVideoPaused = VIDEO.__isPaused__();
        if( myVideoPaused === messege.isPaused && (playTimeGap <= HYPERPARAMETER.ignoreMediaMessegeTime)){
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
            console.log(`\n[MEDIA MESSEGE IGNORED] from ${messege.__sender__}`);
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