const CuedVIDEO_MESSEGE = {

    ignoreNext: false,
    
    __get__: function(){
        const messege = __MESSEGE_ABSTRACT__.get('cuedVideo', 'all');
        messege.source = VIDEO.__getSource__();
        messege.sourceType = VIDEO.__getSourceType__();
        return messege;
    },
    __emmit__: function(){
        if(this.ignoreNext){
            console.log(`Ignored to emmit cue messege`);
            this.ignoreNext = false;
            return;
        }
        const messege = this.__get__();
        MESSEGE_HANDLER.emmit(messege);
    },
    __onFail__(messege){
        console.log('failed to send cuedVideo messege');
    },
    __isFor__: function(messege){
        return messege.__sender__ != ROOM.getUsername();
    },
    __handle__: function(messege){
        this.ignoreNext = true;
        setTimeout(()=> this.ignoreNext = false ,HYPERPARAMETER.ignoreCue);
        try {
            VIDEO.__handleCuedByMessege__(messege);
            NOTIFICATION_MANAGER.manage(messege);
        } catch (error) {
            console.error(error);
        }
    }
}

EVENTS.platform.addEventListener('cuedVideo', (e)=>  CuedVIDEO_MESSEGE.__emmit__());