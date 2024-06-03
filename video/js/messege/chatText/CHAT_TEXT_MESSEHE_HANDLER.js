class CHAT_TEXT_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('chatText');
    }
    __onSent__(message){
        NOTIFICATION_BELL.chatSent()
    }
    __isFor__(messege){
        return messege.__reciever__ === 'all';
    }
    __handle__(messege){
        CHAT_MESSEGE_HTML_MANAGER.manageText(messege);
        if(messege.__sender__ != ROOM.getUsername()){
            NOTIFICATION_BELL.chatText();
        }
    }
}