
/*
Methods
    MQTT.connect(): void -> connects to mqtt broker and subscribes to topic from ROOM
    MQTT.end(): void -> disconnects from broker
    MQTT.isConnected(): Boolean -> return if MQTT  is connedted to the broker
    MQTT.publish(topic:str, messege:str): void -> publishes messege on topic

*/

/*
Events:

    'mqtt-disconnected' -> on every disconnect
    'mqtt-connected' -> on every connect
    'mqtt-ended' -> on disconnect by calling MQTT.end()
    'mqtt-first-connect' -> on connect by callinmg MQTT.connect()
*/

const MQTT = {

    ending: false,
    connecting: false,
    client: {connected: false},

    connect: function(){
        this.connecting = true;

        this.client = mqtt.connect('wss://test.mosquitto.org:8081');
        
        this.client.on('error', (error)=>{
            console.error(error);
        });
        this.client.on('close', ()=>{
            try {
                EVENTS.directEmmit('mqtt-disconnected');
            } catch (error) {
                console.error(error);
            }
            
            if(this.ending){
                this.ending = false;
                try {
                    EVENTS.directEmmit('mqtt-ended');
                } catch (error) {
                    console.error(error);
                }
            }

        });
        this.client.on('message', (topic, message)=>{
            try {
                MESSEGE_HANDLER.onMessege(message.toString());
            } catch (error) {
                console.error(error);
            }
        });

        this.client.on('connect', (error)=>{
            this.client.subscribe(ROOM.getTopic())
            try {
                EVENTS.directEmmit('mqtt-connected');
            } catch (error) {
                console.error(error);
            }
            if(this.connecting){
                this.connecting = false;
                try {
                    EVENTS.directEmmit('mqtt-first-connect');
                } catch (error) {
                    
                }
            }
            
        });
        this.client.on('reconnect', function () {
            console.log('Reconnecting... MQTT');
        });

    },
    reconnect: function(){
        this.client = mqtt.connect('wss://test.mosquitto.org:8081');
        this.client.on('error', (error)=>{
            console.error(error);
        });
        this.client.on('close', ()=>{
            try {
                EVENTS.directEmmit('mqtt-disconnected');
            } catch (error) {
                console.error(error);
            }
            
            if(this.ending){
                this.ending = false;
                try {
                    EVENTS.directEmmit('mqtt-ended');
                } catch (error) {
                    console.error(error);
                }
            }

        });
        this.client.on('message', (topic, message)=>{
            try {
                MESSEGE_HANDLER.onMessege(message.toString());
            } catch (error) {
                console.error(error);
            }
        });

        this.client.on('connect', (error)=>{
            this.client.subscribe(ROOM.getTopic())
            try {
                EVENTS.directEmmit('mqtt-connected');
            } catch (error) {
                console.error(error);
            }
        });
        this.client.on('reconnect', function () {
            console.log('Reconnecting... MQTT');
        });

    },

    end: function(){
        if(!this.isConnected()){
            return;
        }
        try {
            this.ending = true;
            setTimeout(()=>{
                this.client.end();
            }, 100);
        } catch (error) {
            console.error(error);
        }
    },
    isConnected(){
        try {
            return this.client.connected;
        } catch (error) {
            console.error(`Failed to read this.client.connected`);
            return false;
        }
        
    },

    publish: async function(topic, messege){
        let status = undefined;
        
        if(!this.isConnected()){
            console.error('cannot publish. mqtt is not connected');
            status = {
                published: false,
                error: `MQTT is not connected`
            };
            return status;
        }
        
        try {
            status = await new Promise((resolve, reject) => {
                this.client.publish(topic, messege, (error) => {
                    if (error) {
                        resolve({
                            published: false,
                        });
                    } else {
                        resolve({
                            published: true,
                        });
                    }
                });
            });
        } catch (error) {
            status = {
                published: false,
                error: `${error}`
            };
        }
        
        return status;
    },
}


// document.addEventListener("visibilitychange", ()=> MQTT.reconnect());