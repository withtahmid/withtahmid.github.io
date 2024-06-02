const settingsKey  = 'milkywaySettings';
let SETTINGS = {
    keepInSync: true,
    chatOnFullScreen: true,
    autoSync: true,
    username: null,
    roomid: null,
    notificationVolume: 1,
    showAnnounceMents: true,
    
    set: function(){
        localStorage.setItem(settingsKey, JSON.stringify({
            keepInSync,
            chatOnFullScreen,
            autoSync,
            username,
            roomid,
            notificationVolume,
            showAnnounceMents,
        }));
    },
    get: function(){
        const saved = JSON.parse(localStorage.getItem(settingsKey));
        this.keepInSync = saved.keepInSync;
        this.chatOnFullScreen = saved.chatOnFullScreen;
        this.autoSync = saved.autoSync;
        this.username = saved.username;
        this.roomid = saved.roomid;
        this.notificationVolume = saved.notificationVolume;
        this.showAnnounceMents = saved.showAnnounceMents;
    },
    execute: function(){
        // eita pore kora lagbe
    }
}

const handlerLOCAL = {
    set(target, property, value) {
        target[property] = value;
        target.set();
        return true;
    }
};

SETTINGS = new Proxy(SETTINGS, handlerLOCAL);
