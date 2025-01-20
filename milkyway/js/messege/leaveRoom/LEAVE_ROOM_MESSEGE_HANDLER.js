class LEAVE_ROOM_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('leaveRoom');
    }
    __isFor__(messege){
        return messege.__sender__ != ROOM.getUsername();
    }
    __handle__(messege){
        EXISTING_MESSEGE.__emmit__();
        NOTIFICATION_MANAGER.manage(messege);
        handlePeopleLeft(messege.__sender__)
    }
}

function handlePeopleLeft(username){
    ROOM.removeDisconnectedPeople(username);
    EXISTING_MESSEGE_HTML_MANAGER.eliminatePeople(username);
}