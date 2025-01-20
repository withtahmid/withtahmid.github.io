
const ROOM = {
    uniqueKey: 'ttaahhmmiidd',
    joinTime: 0,
    connectedPeople: new Set(),
    peopleLastMessegeTimes : new Map(),
    username: 'null',
    roomId: null,
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
            LEAVE_ROOM_MESSEGE.__emmit__();
            setTimeout(()=> MQTT.end(), 500);
        } catch (error) {
            console.error(error);
        }
    },
    
    isJoined: function(){
        return this.joinTime != 0;
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
        
    timeAgo(username){
        if(!this.peopleLastMessegeTimes.has(username)){
            console.error('[ROOM] could not calculate timeAgo');
            return null;
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
    removeDisconnectedPeople: function(username){
        this.connectedPeople.delete(username);
    },
    
    destroy: function(){
        clearInterval(this.intervalId);
        this.connectedPeople.clear();
        this.peopleLastMessegeTimes.clear();
        this.username = 'null';
        this.joinTime = 0;
    }
};


EVENTS.platform.addEventListener('room-joined', (e)=> ROOM.intervalId = setInterval(ROOM.refreshPeopleList.bind(ROOM),5000));

EVENTS.platform.addEventListener('room-leaved', ROOM.destroy.bind(ROOM));
