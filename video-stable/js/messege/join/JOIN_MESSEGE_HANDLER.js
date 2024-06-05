class JOIN_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('join');
    }
    __isFor__(messege){
        return messege.__sender__ != ROOM.getUsername();
    }
    __handle__(messege){
        EXISTING_MESSEGE.__emmit__();
        NOTIFICATION_MANAGER.manage(messege);
    }
}