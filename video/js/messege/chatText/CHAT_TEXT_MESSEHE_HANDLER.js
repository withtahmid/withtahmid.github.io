class CHAT_TEXT_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('chatText');
    }
    __isFor__(messege){
        return messege.__reciever__ === 'all';
    }
    __handle__(messege){
        CHAT_MESSEGE_HTML_MANAGER.manageText(messege);
    }
}