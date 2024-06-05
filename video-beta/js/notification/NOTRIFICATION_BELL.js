const NOTIFICATION_BELL = {
    volumeranges: [
        [0.00, '<i class="fa-solid fa-volume-xmark"></i>'],
        [0.25, '<i class="fa-solid fa-volume-off"></i>'],
        [0.60, '<i class="fa-solid fa-volume-low"></i>'],
        [1.00, '<i class="fa-solid fa-volume-high"></i>']
    ],

    default: function(){
        document.getElementById('chatText-sound').cureentTime = 0;
        document.getElementById('chatText-sound').play();
    },

    setVolume: function(index){
        const volume = this.volumeranges[index][0];
        document.getElementById('media-sound').volume = volume;
        document.getElementById('chatText-sound').volume = volume;
        document.getElementById('join-sound').volume = volume;
        document.getElementById('chatSent-sound').volume = volume;
        document.getElementById('warning-sound').volume = volume;
        // document.getElementById('chatText-sound').volume = volume;
    },

    setIcon: function(index){
        document.getElementById('chatVolumeBtn').innerHTML = this.volumeranges[index][1];
    },
    toggleVolume: function(){
        
        let = currentIndex = SETTINGS.notificationVolumeIndex;
        const newIndex = (currentIndex + 1) % this.volumeranges.length;
        this.setIcon(newIndex);
        this.setVolume(newIndex);
        this.default()
        SETTINGS.notificationVolumeIndex = newIndex;
    },
    setIndex(index){
        this.setIcon(index);
        this.setVolume(index);
    },
    chatText: function(){
        document.getElementById('chatText-sound').cureentTime = 0;
        document.getElementById('chatText-sound').play();
    },
    chatSent: function(){
        document.getElementById('chatSent-sound').cureentTime = 0;
        document.getElementById('chatSent-sound').play();
    },
    join: function(){
        document.getElementById('join-sound').cureentTime = 0;
        document.getElementById('join-sound').play();
    },
    media: function(){
        document.getElementById('media-sound').currentTime = 0;
        document.getElementById('media-sound').play();
    },

    warning: function(){
        document.getElementById('warning-sound').currentTime = 0;
        document.getElementById('warning-sound').play();
    }
};