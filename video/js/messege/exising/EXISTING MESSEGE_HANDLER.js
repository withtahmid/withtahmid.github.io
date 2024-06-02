class EXISTING_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('existing');
    }
    __isFor__(messege){ return messege.__reciever__ === 'all'}
    

    // this wil go inside notification area
    checkForMissMatch(messege){
        if(messege.__sender__ === ROOM.getUsername()){
            return;
        }
        if(!VIDEO.isActive()){
            return;
        }
        const diff = Math.abs(messege.currentTime - VIDEO.__getCurrentTime__());
        const diffState = diff >= HYPERPARAMETER.mediaMissMatchTol;
        const pauseState = VIDEO.__isPaused__() && messege.isPaused;
        if(diffState || !pauseState){
            const notification = {__sender__: '[ WARNING] '};
            notification.__icon__ = `<i class="fa-solid fa-triangle-exclamation"></i>`;
            notification.__text__ = `${!pauseState ? `${messege.__sender__} is ${messege.isPaused ? 'paused' : 'playing'} and `: ''}Time difference:`;
            notification.__currentTime__  = ` ${FORMATOR.formatDuration(diff)}`;
            NOTIFICATION_MANAGER.__putNotification__(notification);
        }
    }
    __handle__(messege){
        this.checkForMissMatch(messege);
        EXISTING_MESSEGE_HTML_MANAGER.manage(messege);
    }
}