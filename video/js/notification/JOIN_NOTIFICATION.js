const JOIN_NOTIFICATION = {
    icons: {
        join: '<i class="fa-solid fa-person-through-window"></i>',
    },
    texts: {
        join: 'joined the room'
    },

    __generate__: function(messege){
        const notification = {__sender__: messege.__sender__};
        notification.__icon__= this.icons[messege.__type__];
        notification.__text__= `${this.texts[messege.__type__]}`;
        notification.__currentTime__ = null;
        return notification;
    }
}