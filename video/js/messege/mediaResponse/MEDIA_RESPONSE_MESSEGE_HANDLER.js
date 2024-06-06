class MEDIA_RESPONSE_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('mediaResponse');
    }
    
    __isFor__(messege){
        return messege.__reciever__ == ROOM.getUsername();
    }
    __handle__(messege){
        SYNC_MEDIA_HANDLER.handle(messege);
    }
}

const localSyncHandler = (messege) =>{
    VIDEO.beLocal();
    if(!VIDEO.__isActive__()){
        console.log('[SYNC FAILED]: cannot sync LOCAL file unless open by the user');
        return;
    }
    const fn = !messege.syncData.isPaused ? VIDEO.playVideoEx.bind(VIDEO) : VIDEO.pauseVideoEx.bind(VIDEO);
    fn(messege.syncData.currentTime);
};

const youtubeSyncHandler = async(messege) =>{
    try {
        await YOUTUBE_MANAGER.beYouTube();
    } catch (error) {
        console.error(error);
    }
    const syncData = messege.syncData;
    YOUTUBE_MANAGER.pushQueueData(syncData);
    YOUTUBE_MANAGER.playIndex(syncData.queueIndex);
    const status = await new Promise((resolve, reject)=>{
        const timeout = setTimeout(()=>{
            reject({errro: 'Failed to play youtube'});
        }, 5000);
        EVENTS.platform.addEventListener('youtube-new-video-loaded', ()=> {
            clearTimeout(timeout);
            resolve({error: false});
        });
    });
    if(!status.error){
        const fn = !syncData.isPaused ? VIDEO.playVideoEx.bind(VIDEO) : VIDEO.pauseVideoEx.bind(VIDEO);
        fn(syncData.currentTime + (syncData.isPaused ? 0 : TIME.sAgo(messege.__emmitTime__)));
    }
}


const SYNC_MEDIA_HANDLER = {
    handler:{
        local: localSyncHandler,
        youtube: youtubeSyncHandler,
    },
    handle: function(messege){
        if(!MEDIA_REQUEST_MESSEGE.active){
            console.log('[IGNORED MEDIA SYNC RESPONSE]');
        }
        const syncData = messege.syncData;
        if(syncData != null){
            this.handler[syncData.playerType](messege);
            MEDIA_REQUEST_MESSEGE.active = false;
        }
    }
};