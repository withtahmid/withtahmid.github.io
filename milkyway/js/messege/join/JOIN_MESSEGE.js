const JOIN_MESSEGE = {
    __get__: function(){
        const messege = __MESSEGE_ABSTRACT__.get('join', 'all');
        return messege;
    },
    __emmit__: function(){
        const message = this.__get__();
        MESSEGE_EMMITTER.__emmit__(message);
    },
}

EVENTS.platform.addEventListener('room-joined', (e) => {
    JOIN_MESSEGE.__emmit__();
    setTimeout(()=> EXISTING_MESSEGE.__emmit__(), 100);
});