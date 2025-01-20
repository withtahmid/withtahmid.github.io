const HANDSHAKE_RESPONSE_MESSAGE = {
    __get__: function(username){
        const message = __MESSEGE_ABSTRACT__.get('handshakeResponse', username);
        return message;
    },
    __emmit__: function(aesKey, messageRecieved){
        const message = this.__get__(messageRecieved.__sender__);
        message.aesKey = aesKey;
        message.handshakeId = messageRecieved.handshakeId;
        message.publicKey = RSA.getPublicKey();
        MESSEGE_EMMITTER.__emmit__(message);
    },
}