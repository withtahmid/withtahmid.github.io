const settingsKey = 'milkywaySettings';
let SETTINGS = {
    inSync: true,
    // chatOnFullScreen: true,
    username: '',
    roomId: '',
    autoJoin: false,
    notificationVolumeIndex: 1,
    allowChatOnFullScreen: true,
    // showAnnounceMents: true,
    autoSyncRequestOnJoin: true,

    // Encryption
    AES: null,
    RSA: null,

    aesKeys: {},

    set: function(){
        localStorage.setItem(settingsKey, JSON.stringify({
            inSync: this.inSync,
            username: this.username,
            roomId: this.roomId,
            autoJoin: this.autoJoin,
            notificationVolumeIndex: this.notificationVolumeIndex,
            allowChatOnFullScreen: this.allowChatOnFullScreen,
            autoSyncRequestOnJoin: this.autoSyncRequestOnJoin,

            AES: this.AES,
            RSA: this.RSA,

            aesKeys: this.aesKeys,
        }));
    },

    get: async function(){
        const saved = await JSON.parse(localStorage.getItem(settingsKey)) || {};
        this.inSync = saved.inSync ?? true;
        this.username = saved.username ?? '';
        this.roomId = saved.roomId ?? '';
        this.autoJoin = saved.autoJoin ?? false;
        this.notificationVolumeIndex = saved.notificationVolumeIndex ?? 1;
        this.allowChatOnFullScreen = saved.allowChatOnFullScreen ?? true;
        this.autoSyncRequestOnJoin = saved.autoSyncRequestOnJoin ?? true;

        this.AES = saved.AES ?? null;
        this.RSA = saved.RSA ?? null;
        this.aesKeys = saved.aesKeys ?? {};

    },
    retrive: function(){
        const settings = {};
        for(i in this){
            settings[i] = this[i];
        }
        return settings;
    },
    apply: function(){
        const settings = this.retrive();
        document.getElementById('username-input').value = settings.username;
        document.getElementById('roomid-input').value = settings.roomId;
        
        document.getElementById('sync-checkbox-input').checked = settings.inSync;
        document.getElementById('chat-on-viddeo-checkbox-input').checked = settings.allowChatOnFullScreen;
        document.getElementById('auto-sync-checkbox-input').checked = settings.autoSyncRequestOnJoin;
        
        SETTINGS.autoJoin = document.getElementById('remember-connection').checked = settings.autoJoin;
        NOTIFICATION_BELL.setIndex(settings.notificationVolumeIndex);
    }
    
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


document.getElementById('sync-checkbox-input').addEventListener('change', ()=>{
    SETTINGS.inSync = document.getElementById('sync-checkbox-input').checked;
})
  
document.getElementById('chat-on-viddeo-checkbox-input').addEventListener('change', ()=>{
    SETTINGS.allowChatOnFullScreen = document.getElementById('chat-on-viddeo-checkbox-input').checked;
})

document.getElementById('auto-sync-checkbox-input').addEventListener('change', ()=>{
    SETTINGS.autoSyncRequestOnJoin = document.getElementById('auto-sync-checkbox-input').checked;
})

document.getElementById('remember-connection').addEventListener('change', ()=>{
    SETTINGS.autoJoin = document.getElementById('remember-connection').checked;
})


