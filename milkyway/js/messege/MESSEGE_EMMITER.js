const MESSEGE_EMMITTER = {
    __emmit__: async function(messegeObj){
        let messegeJSON;
        try {
            messegeJSON = JSON.stringify(messegeObj);
        } catch (error) {
            console.error(error);
            console.error('Cannot stringify');
            return;
        }


        let publishStatus;

        // publishing the messege string
        try {
            publishStatus = await MQTT.publish(ROOM.getTopic(), messegeJSON);
        } catch (error) {
            console.error(error);
        }

        // attach the status to the messege itself to check further
        messegeObj.publishStatus = publishStatus;

        if(!publishStatus.published){
            // handle if the messege is failed to sent
            try {
                MESSEGE_HANDLER.handlers[messegeObj.__type__].__onFail__(messegeObj);
            } catch (error) {
                console.error(error);
            }
        }else{
            // handle if the messege is sent
            try {
                MESSEGE_HANDLER.handlers[messegeObj.__type__].__onSent__(messegeObj);
            } catch (error) {
                console.error(error);
            }
        }
    },
};