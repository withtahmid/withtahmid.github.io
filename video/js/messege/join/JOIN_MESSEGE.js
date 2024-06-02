const JOIN_MESSEGE = {
    __get__: function(){
        const messege = __MESSEGE_ABSTRACT__.get('join', 'all');
        return messege;
    },
    __emmit__: function(){
        const message = this.__get__();
        MESSEGE_HANDLER.emmit(message);
    },
    __onFail__(messege){

    },
    __isFor__: function(messege){
        return messege.__sender__ != ROOM.getUsername();
    },
    __handle__: function(messege){
        EXISTING_MESSEGE.__emmit__();
        NOTIFICATION_MANAGER.manage(messege);
    }
}

EVENTS.platform.addEventListener('room-joined', (e) => JOIN_MESSEGE.__emmit__());