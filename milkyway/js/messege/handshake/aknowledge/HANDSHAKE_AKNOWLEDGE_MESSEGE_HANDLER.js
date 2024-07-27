class HANDSHAKE_ACKNOWLEDGE_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('handshakeAcknowledge');
    }
    __isFor__(messege){
        return messege.__reciever__ == ROOM.getUsername();
    }
    __handle__(messege){
        handlehandshakeAcknowledge(messege);
    }
}
async function handlehandshakeAcknowledge(message){
    const encryptedAESKey = message.aesKey;
    const decryptedAesKey = RSA.decrypt(encryptedAESKey);
    const aesKey = AES.importKey(decryptedAesKey);
    let ignoreAcknowledege = false;
    if(AES.peoplesKey.has(message.__sender__)){
        const previousKey = await AES.peoplesKey.get(message.__sender__);
        const keySrt = decryptedAesKey;
        const previousKeyStr = await AES.exportKey(previousKey);
        if(keySrt === previousKeyStr){
            ignoreAcknowledege = true;
        }
    }
    if(ignoreAcknowledege){
        console.log('[AES KEY IGNORED]: recieved key and previous kes are same');
        return;
    }
    AES.peoplesKey.set(message.__sender__, aesKey);
    EVENTS.emmit({
        name: 'handshakeAcknowledged',
        data: {
            handshakeId: message.handshakeId
        }
    })
}