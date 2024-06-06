class MEDIA_REQUEST_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('mediaRequest');
    }
    
    __isFor__(messege){
        return messege.__sender__ != ROOM.getUsername();
    }
    __handle__(messege){
        MEDIA_RESPONSE_MESSEGE.__emmit__(messege);
    }
}