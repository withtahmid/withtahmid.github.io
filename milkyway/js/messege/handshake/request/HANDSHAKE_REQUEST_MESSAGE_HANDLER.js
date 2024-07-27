class HANDSHAKE_REQUEST_MESSAGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT {
    constructor(){
        super('handshakeRequest');
    }
    
    __isFor__(messege){
        return messege.__reciever__ == ROOM.getUsername();
    }
    __handle__(messege){
        handleHandshakeRequest(messege);
    }
}

async function handleHandshakeRequest(message){
    // const aesKey = await AES.getKey();
    // const stringAesKey = await AES.exportKey(aesKey);
    // encryptedAESKey = RSA.encrypt(message.publicKey, stringAesKey);
    // HANDSHAKE_RESPONSE_MESSAGE.__emmit__(encryptedAESKey, message);
    makeHandshakeResponse(message);
}