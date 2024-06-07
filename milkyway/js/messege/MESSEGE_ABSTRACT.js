const __MESSEGE_ABSTRACT__ = {
    get(type, reciever){
        if(!type || !reciever){
            throw new Error('__MESSEGE_ABSTRACT__ requires type and reciever')
        }
        const message = {
            __id__: `${ROOM.getUsername()}${Date.now()}${type}${Math.floor(Math.random() * 1000)}`,
            __type__: type,
            __sender__: ROOM.username,
            __reciever__: reciever,
            __emmitTime__: TIME.now(),
            __dontEmmit__: false,
        }
        return message;
    }
}

/*
   const _MESSEGE = {
        __get__: function(){
            const message = __MESSEGE_ABSTRACT__.get('youtube', 'all')
        },
        __emmit__: function(){

        },
    }
*/ 