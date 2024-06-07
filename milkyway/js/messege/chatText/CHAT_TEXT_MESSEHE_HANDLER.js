class CHAT_TEXT_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('chatText');
    }
    __onFail__(messege){
        CHAT_STATUS_HANDLER.fail(messege);
    }
    __onSent__(messege){
        CHAT_STATUS_HANDLER.sent(messege);
        NOTIFICATION_BELL.chatSent()
    }
    __isFor__(messege){
        return messege.__sender__ != ROOM.getUsername();
    }
    __handle__(messege){
        CHAT_MESSEGE_HTML_MANAGER.manageText(messege);
        if(messege.__sender__ != ROOM.getUsername()){
            NOTIFICATION_BELL.chatText();
        }
        setTimeout(()=> CHAT_DELIVERY_MESSEGE.__emmit__(messege.chatId), 200);
    }
}