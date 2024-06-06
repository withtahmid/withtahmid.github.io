const MESSEGE_HANDLER = {
    
    handlers: {
        existing: new EXISTING_MESSEGE_HANDLER(),
        media: new MEDIA_MESSEGE_HANDLER(),
        cuedVideo: new CuedVIDEO_MESSEGE_HANDLER(), 
        chatText: new CHAT_TEXT_MESSEGE_HANDLER(),
        join: new JOIN_MESSEGE_HANDLER(),
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
    },

    emmit: async function(messegeObj){
        
        // if(!ROOM.isJoined() || !MQTT.isConnected()){
        //     messegeObj.__roomIsJoined__ = ROOM.isJoined();
        //     messegeObj.__mqttIsConnected__ = MQTT.isConnected();
        //     this.handlers[messegeObj.__type__].__onFail__(messegeObj);
        //     return;
        // }

        // let messegeJSON;
        // try {
        //     messegeJSON = JSON.stringify(messegeObj);
        // } catch (error) {
        //     console.error(error);
        //     console.error('Cannot stringify');
        //     return;
        // }


        // let publishStatus;

        // // publishing the messege string
        // try {
        //     publishStatus = await MQTT.publish(ROOM.getTopic(), messegeJSON);
        // } catch (error) {
        //     console.error(error);
        // }

        // // attach the status to the messege itself to check further
        // messegeObj.publishStatus = publishStatus;

        // if(!publishStatus.published){
        //     // handle if the messege is failed to sent
        //     try {
        //         this.handlers[messegeObj.__type__].__onFail__(messegeObj);
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }else{
        //     // handle if the messege is sent
        //     try {
        //         this.handlers[messegeObj.__type__].__onSent__(messegeObj);
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
        throw new error('MESSEGE_Handler.emmit is depricated');
    },
    __emmit__: function(MESSEGE_OBJECT, messegeObj){
        throw new error('__emmit__ is depricated');
    }
};