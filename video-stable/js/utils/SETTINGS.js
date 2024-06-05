const settingsKey = 'milkywaySettings';
let SETTINGS = {
    // inSync: true,
    // chatOnFullScreen: true,
    username: '',
    roomId: '',
    autoJoin: false,
    notificationVolumeIndex: 1,
    // showAnnounceMents: true,
    
    set: function(){
        localStorage.setItem(settingsKey, JSON.stringify({
            // insync: this.insync,
            // chatOnFullScreen: this.chatOnFullScreen,
            username: this.username,
            roomId: this.roomId,
            autoJoin: this.autoJoin,
            notificationVolumeIndex: this.notificationVolumeIndex,
            // showAnnounceMents: this.showAnnounceMents,
        }));
    },

    get: function(){
        const saved = JSON.parse(localStorage.getItem(settingsKey)) || {};
        // this.insync = saved.insync ?? true;
        // this.chatOnFullScreen = saved.chatOnFullScreen ?? true;
        this.username = saved.username ?? '';
        this.roomId = saved.roomId ?? '';
        this.autoJoin = saved.autoJoin ?? false;
        this.notificationVolumeIndex = saved.notificationVolumeIndex ?? 1;
        // this.showAnnounceMents = saved.showAnnounceMents ?? true;
    },
}

const handlerLOCAL = {
    get(target, property) {
        if (property in target && typeof target[property] !== 'function') {
            target.get();
            return target[property];
        }
        return target[property];
    },
    set(target, property, value) {
        if (property in target) {
            target[property] = value;
            target.set();
            return true;
        }
        return false;
    }
};

SETTINGS = new Proxy(SETTINGS, handlerLOCAL);

// Initialize SETTINGS from localStorage on script load
SETTINGS.get();