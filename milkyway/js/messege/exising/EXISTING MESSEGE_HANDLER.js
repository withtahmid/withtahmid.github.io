class EXISTING_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('existing');
    }
    __isFor__(messege){ return messege.__reciever__ === 'all'}
    
    __handle__(messege){
        NOTIFICATION_MANAGER.manage(messege);
        EXISTING_MESSEGE_HTML_MANAGER.manage(messege);
    }
}