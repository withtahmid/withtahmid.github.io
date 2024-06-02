const MESSEGE_HANDLER = {
    
    messegeTypes: {
        existing: EXISTING_MESSEGE,
        media: MEDIA_MESSEGE,
        cuedVideo: CuedVIDEO_MESSEGE, 
        chat: CHAT_MESSEGE,
        join: JOIN_MESSEGE,
    },

    onMessege: function(json){
        
        const messege = JSON.parse(json);
        ROOM.registerPresence(messege.__sender__);
        const handler = this.messegeTypes[messege.__type__];
        if(handler.__isFor__(messege)){
            try {
                handler.__handle__(messege);
            } catch (error) {
                console.error(error);
            }
        }
    },
    emmit: function(messegeObj){
        let messege;
        if(!ROOM.isJoined() || !MQTT.isConnected()){
            messegeObj.__roomIsJoined__ = ROOM.isJoined();
            messege.__mqttIsConnected__ = MQTT.isConnected();
            this.messegeTypes[messegeObj.__type__].__onFail__(messegeObj);
            return;
        }
        try {
            messege = JSON.stringify(messegeObj);
        } catch (error) {
            console.error(error);
        }
        try {
            MQTT.publish(ROOM.getTopic(), messege);
        } catch (error) {
            console.error(error);
        }
    },
    __emmit__: function(MESSEGE_OBJECT, messegeObj){
        // let messege;
        // if(!ROOM.isJoined() || !MQTT.isConnected() || messegeObj.__dontEmmit__){
        //     messegeObj.__roomIsJoined__ = ROOM.isJoined();
        //     messege.__mqttIsConnected__ = MQTT.isConnected();
        //     MESSEGE_OBJECT.__onFail__(messegeObj);
        //     return;
        // }
        // try {
        //     messege = JSON.stringify(messegeObj);
        // } catch (error) {
        //     console.error(error);
        // }
        // try {
        //     MQTT.publish(ROOM.getTopic(), messege);
        // } catch (error) {
        //     console.error(error);
        // }
        throw new error('__emmit__ is depricated');
    }
};