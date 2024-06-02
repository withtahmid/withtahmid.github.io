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
    __isFor__(messege){
        return messege.__sender__ != ROOM.getUsername();
    }
    __handle__(messege){
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
    }
}