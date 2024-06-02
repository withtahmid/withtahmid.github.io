const __MESSEGE_ABSTRACT__ = {
    get(type, reciever){
        if(!type || !reciever){
            throw new Error('__MESSEGE_ABSTRACT__ requires type and reciever')
        }
        const message = {
            __type__: type,
            __sender__: ROOM.username,
            __reciever__: reciever,
            __emmitTime__: TIME.now(),
            // __dontEmmit__: false,
            // __issue__: null,
        }
        return message;
    }
}


/*
    const TEMPLATE = {
    __get__: function(){

    },
    __emmit__: function(){

    },
    __isFor__: function(message){

    },
    __handle__: function(message){

    }
}
*/ 