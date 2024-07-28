class HANDSHAKE_RESPONSE_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('handshakeResponse');
    }
    
    __isFor__(messege){
        return messege.__reciever__ == ROOM.getUsername();
    }
    __handle__(messege){
        handleHandshakeResponse(messege);
    }
}
async function handleHandshakeResponse(message){
    const encryptedAESKey = message.aesKey;
    const decryptedAesKey = RSA.decrypt(encryptedAESKey);
    const aesKey = decryptedAesKey
    EVENTS.emmit({
        name: 'handshakeResponsed',
        data: {
            handshakeId: message.handshakeId,
            aesKey: aesKey,
        }
    });
    acknowledgeThisResponse(message);
}

async function acknowledgeThisResponse(message){
    const aesKey = await AES.getKey();
    const stringAesKey = await AES.exportKey(aesKey);
    encryptedAESKey = RSA.encrypt(message.publicKey, stringAesKey);
    HANDSHAKE_ACKNOWLEDGE_MESSAGE.__emmit__(encryptedAESKey, message);
}