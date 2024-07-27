async function makeHandshakeWIth(username){
    const handshakeId = `${Date.now()}${'handshake'}${Math.floor(Math.random() * 1000)}`;
    const result = await new Promise((resolve, reject) => {
        HANDSHAKE_REQUEST_MESSAGE.__emmit__(username, handshakeId);
        EVENTS.platform.addEventListener('handshakeResponsed', (e)=>{
            const timerId = setTimeout(()=>{
                reject({success: false});
            }, HYPERPARAMETER.handshakeWaitTime)
            const handshakeIdReturned = e.detail.handshakeId;
            if(handshakeIdReturned == handshakeId){
                clearTimeout(timerId);
                resolve({success: true});
            }
        });
    });
    if(result.success){
        console.log(`Successful handshake with: ${username}`);
        EVENTS.emmit({
            name: 'successful-handshake',
            data: {
                username: username
            }
        })
    }else{
        console.log(`Failed handshake with: ${username}`);
    }
    return result;
}