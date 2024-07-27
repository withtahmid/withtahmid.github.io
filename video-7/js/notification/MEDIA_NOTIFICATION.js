const MEDIA_NOTIFICATION = {
    icons: {
        playVideo: `<i class="fa-solid fa-play"></i>`,
        pauseVideo: `<i class="fa-solid fa-circle-pause"></i>`,
        seekForward: `<i class="fa-solid fa-forward"></i>`,
        seekBackward: `<i class="fa-solid fa-backward"></i>`,
    },
    texts:{
        playVideo: `played at`,
        pauseVideo: `paused at`,
        seekForward: `seeked forward to`,
        seekBackward: `seeked backward to`,
    },
    
    getSeekType: function(message){
        let type;
        const diff = Number(message.currentTime) - VIDEO.__getCurrentTime__();
        if(Math.abs(diff) < HYPERPARAMETER.seekDiff){
            type = null;
        }else if(diff < 0){
            type =  'seekBackward';
        }else{
            type = 'seekForward';
        }
        return type;
    },

    getType: function(messege){
        const seekType = this.getSeekType(messege);
        let type;
        if((seekType!= null ) && seekType=== 'seekForward' || seekType === 'seekBackward'){
            type = seekType;
        }else{
            type = messege.isPaused ? 'pauseVideo' : 'playVideo';
        }
        return type;
    },

    __generate__: function(messege){
        const type = this.getType(messege);
        
        const notification = {__title__: messege.__sender__};
        if(!VIDEO.__isActive__()){
            notification.__disabled__=  true;
            return notification;
        }
        notification.__bell__ = 'media';
        notification.__css__ = 'default';
        notification.__icon__= this.icons[type];
        notification.__text__= `${this.texts[type]}`;
        notification.__duration__  = ` ${FORMATOR.formatDuration(messege.currentTime)}`;
        return notification;
    } 
};