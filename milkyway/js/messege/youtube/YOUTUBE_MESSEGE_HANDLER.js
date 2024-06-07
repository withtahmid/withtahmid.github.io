const YOUTUBE_MESSEGE_TYPES = {
    addToQueue: YOUTUBE_MANAGER.addToQueueEx.bind(YOUTUBE_MANAGER),
    directPlay: YOUTUBE_MANAGER.directPlayEx.bind(YOUTUBE_MANAGER),
    playFromQueueById: YOUTUBE_MANAGER.playFromQueueByIdEx.bind(YOUTUBE_MANAGER),
    removeFromQueueById: YOUTUBE_MANAGER.removeFromQueueByIdEx.bind(YOUTUBE_MANAGER),
    moveUpInQueueById: YOUTUBE_MANAGER.moveUpInQueueByIdEx.bind(YOUTUBE_MANAGER),
    moveDownInQueueById: YOUTUBE_MANAGER.moveDownInQueueByIdEx.bind(YOUTUBE_MANAGER),
    queueLoop: YOUTUBE_MANAGER.setQueueLoopEx.bind(YOUTUBE_MANAGER),
    
};

class YOUTUBE_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    __isFor__(messege){
        return messege.__sender__ != ROOM.getUsername();
    }
    __handle__(messege){
        YOUTUBE_MESSEGE_TYPES[messege.__YTtype__](messege);
    }
}