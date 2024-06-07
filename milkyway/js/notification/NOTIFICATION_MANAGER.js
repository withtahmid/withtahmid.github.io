const NOTIFICATION_MANAGER = {

    showTimeOutId: null,
    clearTimeoutId: null,

    container: document.querySelector('.notification-box'),
    managers: {
        media: MEDIA_NOTIFICATION,
        cuedVideo: CuedVIDEO_NOTIFICATION,
        join: JOIN_NOTIFICATION,
        existing: EXISTING_NOTIFICATION,
        leaveRoom : LEAVE_ROOM_NOTIFICATION,
    },
    bell:{
        media: NOTIFICATION_BELL.media,
        join: NOTIFICATION_BELL.join,
        chatText: NOTIFICATION_BELL.chatText,
        warning: NOTIFICATION_BELL.warning,
        noSound: ()=>{},
    },

    generateNotificationDiv: function(notificationObj){
        const notificationDiv = document.createElement('div');
        notificationDiv.classList.add('notification');
        notificationDiv.classList.add(`${notificationObj.__css__ ?? 'default'}-notification`)
            const iconDiv = document.createElement('div');
            iconDiv.classList.add('notification-icon');
            iconDiv.innerHTML = notificationObj.__icon__ ?? '';
            notificationDiv.appendChild(iconDiv);

            const sender = document.createElement('p');
            sender.classList.add('notification-title');
            sender.textContent = notificationObj.__title__ ?? '';
            notificationDiv.appendChild(sender);

            const text = document.createElement('p');
            text.classList.add('notification-text');
            text.textContent = notificationObj.__text__ ?? '';
            notificationDiv.appendChild(text);
            
            if(notificationObj.__duration__){
                const currentTime = document.createElement('p');
                currentTime.classList.add('notification-duration');
                currentTime.textContent = notificationObj.__duration__;
                notificationDiv.appendChild(currentTime);
            }
            
        return notificationDiv; 

    },
    // this function will be depricated soon and managers will be  independent
    __putNotification__: function(notification){
        if(notification.__disabled__){
            return;
        }

        // play notification sound
        try {
            notification.__bell__ && this.bell[notification.__bell__] ? this.bell[notification.__bell__]() : this.bell.noSound();
        } catch (error) {
            console.error(error);
        }
        // stop conrtainer from cvanishing

        clearTimeout(this.clearTimeoutId);
        clearTimeout(this.showTimeOutId);
        
        const notificationDiv = this.generateNotificationDiv(notification);
        this.container.appendChild(notificationDiv);
        this.container.classList.add('show-notification');

        this.showTimeOutId = setTimeout(()=>{
            this.container.classList.remove('show-notification');
            this.clearTimeoutId = setTimeout(()=>{
                this.container.innerHTML = '';
            }, HYPERPARAMETER.clearNotificationAfter)   
        }, notification.__stayTime__ ?? HYPERPARAMETER.showNotificationFor);
    },


    manage: function(messege){
        if(!this.managers[messege.__type__]){
            // console.error(`Cannot put notifuication for '${messege.__type}' type messege`);
            return;
        }
        let notificationObj;
        try {
            notificationObj= this.managers[messege.__type__].__generate__(messege);
        } catch (error) {
            console.error(error);
            console.error('Failed to generate notififation');
            return;
        }
        try {
            this.__putNotification__(notificationObj);
        } catch (error) {
            console.error(error);
        }
    }
};


/*
__title__
__text__
__duration__
__css__ optional
__bell__optional
__icon__ optional

*/ 