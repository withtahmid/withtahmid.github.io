const YOUTUBE_MESSEGE = {
    __get__: function(){
        return  __MESSEGE_ABSTRACT__.get('youtube', 'all')
    },
    __emmit__: function(){

    },
    addToQueue: function(video){
        const messege = this.__get__();
        messege.__YTtype__ = 'addToQueue';
        messege.video = video;
        MESSEGE_EMMITTER.__emmit__(messege);
    },
    directPlay: function(video){
        const messege = this.__get__();
        messege.__YTtype__ = 'directPlay';
        messege.video = video;
        MESSEGE_EMMITTER.__emmit__(messege);
    },
    playFromQueueById: function(video){
        const messege = this.__get__();
        messege.__YTtype__ = 'playFromQueueById';
        messege.video = video;
        MESSEGE_EMMITTER.__emmit__(messege);
    },
    removeFromQueueById: function(video){
        const messege = this.__get__();
        messege.__YTtype__ = 'removeFromQueueById';
        messege.video = video;
        MESSEGE_EMMITTER.__emmit__(messege);
    },
    moveUpInQueueById: function(video){
        const messege = this.__get__();
        messege.__YTtype__ = 'moveUpInQueueById';
        messege.video = video;
        MESSEGE_EMMITTER.__emmit__(messege);
    },
    moveDownInQueueById: function(video){
        const messege = this.__get__();
        messege.__YTtype__ = 'moveDownInQueueById';
        messege.video = video;
        MESSEGE_EMMITTER.__emmit__(messege);
    },
    queueLoop: function(set){
        const messege = this.__get__();
        messege.__YTtype__ = 'queueLoop';
        messege.video = video;
        messege.loopSet = set;
        MESSEGE_EMMITTER.__emmit__(messege);
    }
}