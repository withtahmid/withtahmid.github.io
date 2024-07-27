
const EXISTING_MESSEGE = {
    lastTime: 0,
    pauseFlag: false,
    __get__: function(){
        const messege =  __MESSEGE_ABSTRACT__.get('existing', 'all');
        messege.isOnSync = SETTINGS.inSync;
        messege.fullscreen = VIDEO.__fullscreen__();
        messege.title = VIDEO.__getTitle__();
        messege.currentTime = VIDEO.__getCurrentTime__();
        messege.sourceType = VIDEO.__getSourceType__();
        messege.identity = VIDEO.__getIdentity__();
        messege.isPaused = VIDEO.__isPaused__();
        messege.inTab = userOnThisTab();
        messege.caption = VIDEO.__isCaptioning__();
        messege.videoIsActive = VIDEO.__isActive__();
        messege.__dontEmmit__ = this.pauseFlag;
        return messege;
    },
    
    __emmit__: function(){
        const messege = this.__get__();
        MESSEGE_EMMITTER.__emmit__(messege);
    },
    pauseForAWhile:function(){
        this.pauseFlag = true;
        setTimeout(()=> this.pauseFlag = false, HYPERPARAMETER.existingPauseForAWhile);
    }
}

EVENTS.platform.addEventListener('room-joined', (e)=>{
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
  
