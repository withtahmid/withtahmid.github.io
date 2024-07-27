class CHAT_TEXT_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('chatText');
    }
    __onFail__(message){
        CHAT_STATUS_HANDLER.fail(message);
    }
    __onSent__(message){
        CHAT_STATUS_HANDLER.sent(message);
        NOTIFICATION_BELL.chatSent()
    }
    __isFor__(message){
        return message.__sender__ != ROOM.getUsername();
    }
    __handle__(message){
        handleChatTextMessege(message);
    }
}

async function handleChatTextMessege(message){
    if(!AES.peoplesKey.has(message.__sender__)){
        const result = await makeHandshakeWIth(message.__sender__);
    }
    const aesKey = await AES.peoplesKey.get(message.__sender__);
    if(!aesKey){
        console.error('[AES ERROR]: aesKey not exist on the Map');
        return;
    }
    try {
        var decryptedText = await AES.decrypt(aesKey, message.text);
    } catch (error) {
        console.error('[AES ERROR] Failed to decrypt');
        console.error(error);
        makeHandshakeWIth(message.__sender__);
        return;
    }
    message.text = decryptedText;
    try {
        CHAT_MESSEGE_HTML_MANAGER.manageText(message);
    } catch (error) {
        console.error(error);
    }
    if(message.__sender__ != ROOM.getUsername()){
        NOTIFICATION_BELL.chatText();
    }
    setTimeout(()=> CHAT_DELIVERY_MESSEGE.__emmit__(message.chatId), 200);
}