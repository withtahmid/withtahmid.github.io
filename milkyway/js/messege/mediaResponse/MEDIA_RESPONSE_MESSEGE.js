const MEDIA_RESPONSE_MESSEGE = {
    __get__: function(username){
        const message = __MESSEGE_ABSTRACT__.get('mediaResponse', username);
        return message;
    },
    __emmit__: function(messege){
        const message = this.__get__(messege.__sender__);
        message.syncData = VIDEO.__getSyncData__();
        MESSEGE_EMMITTER.__emmit__(message);
    },
}