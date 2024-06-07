class CuedVIDEO_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('cuedVideo');

    }
    __isFor__(messege){
        return messege.__sender__ != ROOM.getUsername();
    }
    __handle__(messege){
        CuedVIDEO_MESSEGE.ignoreNext = true;
        setTimeout(()=> CuedVIDEO_MESSEGE.ignoreNext = false ,HYPERPARAMETER.ignoreCue);
        try {
            VIDEO.__handleCuedByMessege__(messege);
            NOTIFICATION_MANAGER.manage(messege);
        } catch (error) {
            console.error(error);
        }
    }
}