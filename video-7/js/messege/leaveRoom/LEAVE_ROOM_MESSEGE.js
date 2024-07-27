const LEAVE_ROOM_MESSEGE = {
    __get__: function(){
        const messege = __MESSEGE_ABSTRACT__.get('leaveRoom', 'all');
        return messege;
    },
    __emmit__: function(){
        const message = this.__get__();
        MESSEGE_EMMITTER.__emmit__(message);
    },
}