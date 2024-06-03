
const EXISTING_MESSEGE = {
    __get__: function(){
        const messege =  __MESSEGE_ABSTRACT__.get('existing', 'all');
        messege.isOnSync = VIDEO.isOnSync();
        messege.fullscreen = VIDEO.__fullscreen__();
        messege.title = VIDEO.__getTitle__();
        messege.currentTime = VIDEO.__getCurrentTime__();
        messege.sourceType = VIDEO.__getSourceType__();
        messege.identity = VIDEO.__getIdentity__();
        messege.isPaused = VIDEO.__isPaused__();
        messege.inTab = userOnThisTab();
        messege.caption = VIDEO.__isCaptioning__();
        messege.videoIsActive = VIDEO.isActive();
        return messege;
    },
    
    __emmit__: function(){
        const messege = this.__get__();
        MESSEGE_EMMITTER.__emmit__(messege);
    },
}

EVENTS.platform.addEventListener('room-joined', (e)=>{
    EXISTING_MESSEGE.__emmit__();
    EXISTING_MESSEGE.intervalId = setInterval(()=>{
        EXISTING_MESSEGE.__emmit__();
    },10000)
});

EVENTS.platform.addEventListener('room-leaved', (e)=>{
    clearInterval(EXISTING_MESSEGE.intervalId);
});

EVENTS.platform.addEventListener('cuedVideo', ()=> EXISTING_MESSEGE.__emmit__());
document.addEventListener("fullscreenchange", () => EXISTING_MESSEGE.__emmit__());
document.addEventListener("visibilitychange", ()=> EXISTING_MESSEGE.__emmit__());
  
