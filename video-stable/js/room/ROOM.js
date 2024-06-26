
const ROOM = {
    uniqueKey: 'ttaahhmmiidd',
    joinTime: null,
    connectedPeople: new Set(),
    peopleLastMessegeTimes : new Map(),
    inSync: true,

    join: function(username, roomId){
        this.username = username;
        this.roomId = roomId;
        EVENTS.directEmmit('room-tryingToJoin')
        try {
            MQTT.connect();
        } catch (error) {
            console.error(error);
        }
        
    },

    leave: function(){
        this.tryingToLeave = true;
        setTimeout(()=>{
            if(this.tryingToLeave){
                this.tryingToLeave = false;
            }
        }, 8000);
        try {
            MQTT.end();
        } catch (error) {
            console.error(error);
        }
    },
    
    isJoined: function(){
        return this.joinTime != null;
    },
    getJoinTime: function(){
        return this.joinTime;
    },
    getUsername: function(){
        return this.username || null;
    },
    getRoomId: function(){
        return this.roomId || null;
    },

    getTopic: function(){
        return `${this.uniqueKey}/${this.roomId}`;
    },
    isPresentInRoom: function(username){
        return this.peopleLastMessegeTimes.has(username);
    },
    registerPresence: function(username){
        try {
            this.peopleLastMessegeTimes.set(username, TIME.now());
        } catch (error) {
            console.error(error);
        }
    },
        
    isOnSync: function(){
        return this.inSync ?? true;
    },
    
    timeAgo(username){
        if(!this.peopleLastMessegeTimes.has(username)){
            console.error('[ROOM] could not calculate timeAgo');
            return;
        }
        return Math.floor((TIME.now() - this.peopleLastMessegeTimes.get(username)) / 1000);
    },

    refreshPeopleList: function(){
        this.connectedPeople.forEach(username => {
            try {
                EXISTING_MESSEGE_HTML_MANAGER.refreshPeopleStatus(username);
            } catch (error) {
                console.error(error);
            }
        })
    },
};


EVENTS.platform.addEventListener('room-joined', (e)=> ROOM.intervalId = setInterval(ROOM.refreshPeopleList.bind(ROOM),10000));

EVENTS.platform.addEventListener('room-leaved', (e)=> clearInterval(ROOM.intervalId.intervalId));
