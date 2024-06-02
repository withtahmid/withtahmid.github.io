const NOTIFICATION_MANAGER = {

    showTimeOutId: null,
    clearTimeoutId: null,

    container: document.querySelector('.notification-box'),
    managers: {
        media: MEDIA_NOTIFICATION,
        cuedVideo: CuedVIDEO_NOTIFICATION,
        join: JOIN_NOTIFICATION,
    },

    generateNotificationDiv: function(notificationObj){
        const notificationDiv = document.createElement('div');
        notificationDiv.classList.add('notification');

            const iconDiv = document.createElement('div');
            iconDiv.classList.add('notification-type-icon');
            iconDiv.innerHTML = notificationObj.__icon__;
            notificationDiv.appendChild(iconDiv);

            const sender = document.createElement('p');
            sender.classList.add('notification-user');
            sender.textContent = notificationObj.__sender__;
            notificationDiv.appendChild(sender);

            const text = document.createElement('p');
            text.classList.add('notification-type');
            text.textContent = notificationObj.__text__;
            notificationDiv.appendChild(text);
            
            if(notificationObj.__currentTime__){
                const currentTime = document.createElement('p');
                currentTime.classList.add('notification-mediatime');
                currentTime.textContent = notificationObj.__currentTime__;
                notificationDiv.appendChild(currentTime);
            }
            
        return notificationDiv; 

    },
    // this function will be depricated soon and managers will be  independent
    __putNotification__: function(notification){
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
        }, HYPERPARAMETER.showNotificationFor)
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