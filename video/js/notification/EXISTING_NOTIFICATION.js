const EXISTING_NOTIFICATION = {
    __ring__: function(){
        NOTIFICATION_BELL.warning();
    },
    __generate__: function(messege){
        let notification = {__disabled__: true};
        if(messege.__sender__ === ROOM.getUsername()){
            return notification;
        }
        if(!VIDEO.isActive() || !messege.videoIsActive){
            return notification;
        }
        const diff = messege.currentTime - VIDEO.__getCurrentTime__();
        const diffState = Math.abs(diff) >= HYPERPARAMETER.mediaMissMatchTol;
        const pauseState = VIDEO.__isPaused__() != messege.isPaused;

        notification.__title__ = ' WARNING !!!';
        notification.__icon__ = `<i class="fa-solid fa-triangle-exclamation"></i>`;
        
        // if(messege.identity != VIDEO.__getIdentity__()){
        //     notification.__disabled__ = false;
        //     notification.__currentTime__ = null;
        //     notification.__text__ = `${messege.__sender__} is playing differetn Video !!! ${messege.identity}`
        // }
        // else 
        // console.log(VIDEO.__isPaused__(), messege.isPaused);
        // console.log(diffState, pauseState);
        
        if(diffState /*|| diffState*/){
            this.__ring__()
            notification.__disabled__ = false;
            notification.__css__ = 'warning';
            // const pauseText = `${pauseState ? `${messege.__sender__} is ${messege.isPaused ? 'paused' : 'playing'} and `: ''}`;
            notification.__text__= `${messege.__sender__} is ${`${messege.isPaused ? 'paused' : 'playing'}`} and ${diff < 0 ? 'behind': 'ahead'} by`
            notification.__duration__  = `${FORMATOR.formatDuration(Math.abs(diff))}`;
        }
        return notification;
    }
}