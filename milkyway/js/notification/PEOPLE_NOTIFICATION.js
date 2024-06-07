const PEOPLE_STATUS = {
    status: new Map(),
    get: function(username){
        if(!this.status.has(username)){
            return null;
        }
        return this.status.get(username);
    },
    set: function(username, status){
        this.status.set(username, status);
    },
    delete: function(username){
        this.status.delete(username);
    }
}

const PEOPLE_NOTIFICATION = {
    people: new Map(),

    disconnect: function(username){
        // NOTIFICATION_BELL.join();
        const notification = {__title__: 'DISCONNECTED!!'};
        notification.__icon__= `<i class="fa-solid fa-person-circle-exclamation"></i>`;
        notification.__text__= `${username === ROOM.getUsername() ? 'You are offline' : `${username} is not seen in a while`}`;
        notification.__duration__ = null;
        notification.__css__ = 'people-disconnected';
        notification.__disabled__=  username != ROOM.getUsername() && PEOPLE_STATUS.get(ROOM.getUsername()) !== 'active';
        NOTIFICATION_MANAGER.__putNotification__(notification);
    },
    reconnect: function(username){
        // NOTIFICATION_BELL.join();
        const notification = {__title__: 'RECONNECTED'};
        notification.__icon__= `<i class="fa-solid fa-signal"></i>`;
        notification.__text__= `${username === ROOM.getUsername() ? 'Connection is restored' : `${username} is back!`}`;
        notification.__duration__ = null;
        notification.__css__ = 'join';
        notification.__disabled__=  username != ROOM.getUsername() && PEOPLE_STATUS.get(ROOM.getUsername()) !== 'active';
        NOTIFICATION_MANAGER.__putNotification__(notification);
    }
}

EVENTS.platform.addEventListener('people-eliminated', (e)=>{
    PEOPLE_STATUS.delete(e.detail.username);
});

EVENTS.platform.addEventListener('people-disconnected', (e)=>{
    const username = e.detail.username;
    if(PEOPLE_STATUS.get(username) === 'disconnected'){
        return;
    }
    PEOPLE_STATUS.set(username, 'disconnected');
    PEOPLE_NOTIFICATION.disconnect(username);
});

EVENTS.platform.addEventListener('people-active', (e)=>{
    const username = e.detail.username;
    const status = PEOPLE_STATUS.get(username)
    if( status === 'active'){
        return;
    }else if(status === 'disconnected'){
        PEOPLE_NOTIFICATION.reconnect(username);
    }
    PEOPLE_STATUS.set(username, 'active');
    
});

// EVENTS.platform.addEventListener('people-late', async(e)=>{
//     const username = e.detail.username;
//     if(PEOPLE_STATUS.get(username) === 'late'){
//         return;
//     }
//     PEOPLE_STATUS.set(username, 'late');
//     PEOPLE_NOTIFICATION.disconnect(username);
// });