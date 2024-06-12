class JOIN_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('join');
    }
    __isFor__(messege){
        return messege.__sender__ != ROOM.getUsername();
    }
    __handle__(messege){
        PEOPLE_STATUS.set(messege.__sender__, 'active');
        EXISTING_MESSEGE.__emmit__();
        NOTIFICATION_MANAGER.manage(messege);
    }
}