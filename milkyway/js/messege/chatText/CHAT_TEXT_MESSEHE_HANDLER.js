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
    try {
        var aesKey = await AES.getKeyWithUsername(message.__sender__);
    } catch (error) {
        console.error(error);   
    }
    try {
        var decryptedText = await AES.decrypt(aesKey, message.text);
    } catch (error) {
        console.error('[AES ERROR] Failed to decrypt');
        console.error(error);
        await makeHandshakeWIth(message.__sender__);
        try {
            var aesKey = await AES.getKeyWithUsername(message.__sender__);
        } catch (error) {
            console.error(error);   
        }
        try {
            decryptedText = await AES.decrypt(aesKey, message.text);
        } catch (error) {
            console.error(error);
        }
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