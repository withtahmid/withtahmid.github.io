const MEDIA_REQUEST_MESSEGE =  {
    active: false,
    __get__: function(){
        const message = __MESSEGE_ABSTRACT__.get('mediaRequest', 'all');
        return message;
    },
    __emmit__: function(){
        this.active = true;
        MESSEGE_EMMITTER.__emmit__(this.__get__());
        setTimeout(()=> this.active = false, 5000);
    },
}

EVENTS.platform.addEventListener('room-joined', (e)=>{
    if(SETTINGS.autoSyncRequestOnJoin){
        MEDIA_REQUEST_MESSEGE.__emmit__();
    }
});