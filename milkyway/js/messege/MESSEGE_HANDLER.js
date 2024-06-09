const MESSEGE_HANDLER = {
    
    handlers: {
        existing: new EXISTING_MESSEGE_HANDLER(),
        media: new MEDIA_MESSEGE_HANDLER(),
        cuedVideo: new CuedVIDEO_MESSEGE_HANDLER(), 
        chatText: new CHAT_TEXT_MESSEGE_HANDLER(),
        join: new JOIN_MESSEGE_HANDLER(),
        leaveRoom: new LEAVE_ROOM_MESSEGE_HANDLER(),
        youtube: new YOUTUBE_MESSEGE_HANDLER(),
        chatDelivery: new CHAT_DELIVERY_MESSEGE_HANDLER(),
        mediaRequest: new MEDIA_REQUEST_MESSEGE_HANDLER(),
        mediaResponse: new MEDIA_RESPONSE_MESSEGE_HANDLER(),

    },

    onMessege: function(json){
        
        const messege = JSON.parse(json);
        ROOM.registerPresence(messege.__sender__);
        const handler = this.handlers[messege.__type__];
        if(handler.__isFor__(messege)){
            try {
                handler.__handle__(messege);
            } catch (error) {
                console.error(error);
            }
        }
        if(HYPERPARAMETER.existingMessegeGap < TIME.sAgo(EXISTING_MESSEGE.lastTime)){
            EXISTING_MESSEGE.__emmit__();
            console.log('\n[TRIGGERED EXISTING_MESSEGE explicitly]')
        }
    },
};