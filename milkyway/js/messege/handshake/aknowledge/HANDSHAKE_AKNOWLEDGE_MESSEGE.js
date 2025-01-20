const HANDSHAKE_ACKNOWLEDGE_MESSAGE = {
    __get__: function(username){
        const message = __MESSEGE_ABSTRACT__.get('handshakeAcknowledge', username);
        return message;
    },
    __emmit__: function(aesKey, messageRecieved){
        const message = this.__get__(messageRecieved.__sender__);
        message.aesKey = aesKey;
        message.handshakeId = messageRecieved.handshakeId;
        MESSEGE_EMMITTER.__emmit__(message);
    },
}