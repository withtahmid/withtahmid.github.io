const JOIN_NOTIFICATION = {
    icons: {
        join: '<i class="fa-solid fa-person-through-window"></i>',
    },
    texts: {
        join: 'joined the room'
    },
    __generate__: function(messege){
        const notification = {__title__: messege.__sender__};
        notification.__icon__= this.icons[messege.__type__];
        notification.__text__= `${this.texts[messege.__type__]}`;
        notification.__duration__ = null;
        notification.__css__ = 'join';
        notification.__bell__ = 'join';
        notification.__disabled__=  false;
        return notification;
    }
}