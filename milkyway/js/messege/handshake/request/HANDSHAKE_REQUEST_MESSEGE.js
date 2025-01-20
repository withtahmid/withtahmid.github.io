const HANDSHAKE_REQUEST_MESSAGE = {
    __get__: function(username){
        const message = __MESSEGE_ABSTRACT__.get('handshakeRequest', username);
        message.publicKey = RSA.getPublicKey();
        return message;
    },
    __emmit__: function(username, handshakeId){
        const message = this.__get__(username);
        message.handshakeId = handshakeId;
        MESSEGE_EMMITTER.__emmit__(message);
    },
}