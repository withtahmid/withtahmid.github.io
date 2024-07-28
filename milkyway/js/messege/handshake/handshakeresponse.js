async function makeHandshakeResponse(message){
    const handshakeId = message.handshakeId;
    const username = message.__sender__;
    const result = await new Promise(async (resolve, reject) => {
        const aesKey = await AES.getKey();
        const stringAesKey = await AES.exportKey(aesKey);
        encryptedAESKey = RSA.encrypt(message.publicKey, stringAesKey);
        HANDSHAKE_RESPONSE_MESSAGE.__emmit__(encryptedAESKey, message);
        EVENTS.platform.addEventListener('handshakeAcknowledged', async (e)=>{
            const timerId = setTimeout(()=>{
                reject({success: false});
            }, HYPERPARAMETER.handshakeWaitTime)
            const handshakeIdReturned = e.detail.handshakeId;
            if(handshakeIdReturned == handshakeId){
                clearTimeout(timerId);
                await AES.setKeyWithUsername(username,  e.detail.aesKey);
                resolve({success: true});
                
            }
        });
    });
    if(result.success){
        console.log(`Successful handshake acknowledge with: ${username}`);
        EVENTS.emmit({
            name: 'successful-handshake',
            data: {
                username: username
            }
        })
    }else{
        console.log(`Failed handshake acknowledge with: ${username}`);
    }
    return result;
}