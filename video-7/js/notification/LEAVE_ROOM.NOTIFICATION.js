const LEAVE_ROOM_NOTIFICATION = {
    __generate__: function(messege){
        const notification = {__title__: messege.__sender__};
        notification.__icon__= '<i class="fa-solid fa-door-open"></i>';
        notification.__text__= `left the room`;
        notification.__duration__ = null;
        notification.__css__ = 'leaveRoom';
        notification.__bell__ = 'join';
        notification.__disabled__=  false;
        return notification;
    }
}