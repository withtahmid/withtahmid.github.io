const MESSEGE_EMMITTER = {
    __emmit__: async function(messegeObj){
        if(messegeObj.__dontEmmit__){
            console.log(`\nIGNORED MESSGE OF TYPE ${messegeObj.__type__} becase '__dontEmmit__' flag is set`);
            return;
        }
        try {
            var messegeJSON = JSON.stringify(messegeObj);
        } catch (error) {
            console.error(error);
            console.error('Cannot stringify');
            return;
        }


        // encrypting
        try {
            var encryptedString = encryptString(messegeJSON)
        } catch (error) {
            console.error(error);
            console.error('Cannot encrypt');
            return;
        }

        // publishing the messege string
        try {
            var publishStatus = await MQTT.publish(ROOM.getTopic(), encryptedString);
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
