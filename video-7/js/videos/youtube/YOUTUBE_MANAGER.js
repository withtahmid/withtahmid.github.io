function onYTPlayerError(event){
    console.log(event);
    displayErrorOnScreen('Youtube caused an error', "YouTube :')")
}
function onYTPlayerReady(){
    // VIDEO.__emmitCuedEvent__();
    // if(YOUTUBE_MANAGER.queueIndex != -1){
    //     const idx = YOUTUBE_MANAGER.queueIndex;
    //     const id = YOUTUBE_MANAGER.queue[idx].videoId;
    //     VIDEO.__player__.__loadVideoById(id);
    //     // console.log(id);
    //     // console.log(YOUTUBE_MANAGER.queue)
    // }
    console.log('[READY] Youtube player is ready')
    EVENTS.directEmmit('youtube-player-ready');
}

function onYTPlayerStateChange(event){
    const state = event.data;
    if(state === 1){
        VIDEO.onPlay();
    }else if(state === 2){
        VIDEO.onPause();
    }else if(state === 5){
        EXISTING_MESSEGE.__emmit__();
    }else if(state === -1){
        EXISTING_MESSEGE.__emmit__();
    }else if(state === 0){
        YOUTUBE_MANAGER.playNextInQueue();
    }
    if(state == 1 || state == 5 || state == 3){
        EVENTS.directEmmit('youtube-new-video-loaded');
    }    
}

const API = 'AIzaSyDUjyB82R7zwWccZtIkZUQsVPAI6g_u-4s';

async function getYouTubeInfo(videoId) {
    if(YOUTUBE_MANAGER.infoCache.has(videoId)){
        return YOUTUBE_MANAGER.infoCache.get(videoId);
    }
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&fields=items(id%2Csnippet)&key=${API}`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            throw new Error(`No video found with ID: ${videoId}`);
        }

        const { title, thumbnails, channelTitle} = data.items[0].snippet;
        const thumbnail = thumbnails.default.url;
        YOUTUBE_MANAGER.infoCache.set(videoId, { title, thumbnail, channelTitle});
        return { title, thumbnail, channelTitle};
    } catch (error) {
        console.error('Failed to fetch video details:', error.messege);
        return { error: error.messege };
    }
}

function youtubeURLtoId(url){
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const YOUTUBE_MANAGER = {
    queueItemContainer: document.getElementById('youtube-queue-container'),
    queue: [],
    
    infoCache: new Map(),
    queueIndex: -1,    
    createVideoObj: async function(url){
        const videoId = youtubeURLtoId(url);
        if(!videoId){
            return;
        }
        let youtubeInfo;
        try {
            youtubeInfo = await getYouTubeInfo(videoId);
        } catch (error) {
            console.error(error);
        }
        if(youtubeInfo.error){
            console.error(youtubeInfo.error);
            return;
        }
        const video = new YOUTUBE_VIDEO_ITEM(videoId, ROOM.getUsername() ?? 'unknown', youtubeInfo.title ?? '', youtubeInfo.thumbnail ?? '', youtubeInfo.channelTitle ?? '');
        return video;
    },

    currentId: function(){
        return this.queue.length > 0 ? this.queue[this.queueIndex].__id__ : null;
    },
    
    renderQueueHTML: async function(){
        this.queueItemContainer.innerHTML = '';
        for(i = 0; i < this.queue.length; i++){
            const div = createQueueItemDiv(this.queue[i], i === this.queueIndex, i == 0, i == (this.queue.length - 1));
            this.queueItemContainer.appendChild(div);
        }

        document.getElementById('youtube-queue-serial-info').textContent = `${this.queueIndex + 1} / ${this.queue.length}`
    },
    
    addToIndex: function(index, video){
        this.queue.splice(index, 0, video);
    },

    addToQueueByUrl: async function(url){
        const video = await this.createVideoObj(url);
        this.addToIndex(this.queue.length, video);
        this.renderQueueHTML();
        YOUTUBE_MESSEGE.addToQueue(video);
    },

    addToQueueEx: async function(messege){
        const video = messege.video;
        this.addToIndex(this.queue.length, video);
        this.renderQueueHTML();
    },
    directPlayEx: async function(messege){
        try {
            await this.beYouTube();
        } catch (error) {
            console.error(error);
            return;
        }
        const video = messege.video;
        this.queueIndex++;
        this.addToIndex(this.queueIndex, video);
        this.playIndex(this.queueIndex);
        // VIDEO.__player__.__loadVideoById(video.videoId);
        this.renderQueueHTML();
    },
    playFromQueueByIdEx: async function(messege){
        try {
            await this.beYouTube();
        } catch (error) {
            console.error(error);
            return;
        }
        const videomsq = messege.video;
        let index = this.queue.findIndex(video => video.__id__ === videomsq.__id__);
        if(index === -1){
            this.addToIndex(this.queueIndex + 1, videomsq);
            index = this.queueIndex + 1;
        }
        this.playIndex(index);
       
    },
    removeFromQueueById: function(__id__){
        const active_id = this.queueIndex >= 0 ? this.queue[this.queueIndex].__id__ : null;
        const index = this.queue.findIndex(video => video.__id__ === __id__);
        if(index === -1){
            return;
        }
        YOUTUBE_MESSEGE.removeFromQueueById(this.queue[index]);
        this.queue.splice(index, 1);
        this.queueIndex = active_id ? this.queue.findIndex(video => video.__id__ === active_id) : -1;
        this.renderQueueHTML();
    },
    removeFromQueueByIdEx: function(messege){
        const active_id = this.queueIndex >= 0 ? this.queue[this.queueIndex].__id__ : null;
        const index = this.queue.findIndex(video => video.__id__ === messege.video.__id__);
        if(index === -1){
            return;
        }
        this.queue.splice(index, 1);
        this.queueIndex = active_id ? this.queue.findIndex(video => video.__id__ === active_id) : -1;
        this.renderQueueHTML();
    },
    moveUpInQueueById: function(__id__){

        const active_id = this.queueIndex >= 0 ? this.queue[this.queueIndex].__id__ : null;

        const index = this.queue.findIndex(video => video.__id__ === __id__);
        if(index === -1 || index == 0){
            return;
        }
        const video = this.queue[index];
        this.queue.splice(index, 1);
        this.queue.splice(index - 1, 0, video);
        YOUTUBE_MESSEGE.moveUpInQueueById(video);
        
        this.queueIndex = active_id ? this.queue.findIndex(video => video.__id__ === active_id) : -1;
        this.renderQueueHTML();

    },
    moveDownInQueueById: function(__id__){
        const active_id = this.queueIndex >= 0 ? this.queue[this.queueIndex].__id__ : null;

        const index = this.queue.findIndex(video => video.__id__ === __id__);
        if(index === -1 || index == this.queue.length - 1){
            return;
        }
        const video = this.queue[index];
        this.queue.splice(index, 1);
        this.queue.splice(index + 1, 0, video);
        YOUTUBE_MESSEGE.moveDownInQueueById(video);
        this.queueIndex = active_id ? this.queue.findIndex(video => video.__id__ === active_id) : -1;
        this.renderQueueHTML();
    },
    moveUpInQueueByIdEx: function(messege){
        const active_id = this.queueIndex >= 0 ? this.queue[this.queueIndex].__id__ : null;

        const index = this.queue.findIndex(video => video.__id__ === messege.video.__id__);
        if(index === -1 || index == 0){
            return;
        }
        const video = this.queue[index];
        this.queue.splice(index, 1);
        this.queue.splice(index - 1, 0, video);
        this.queueIndex = active_id ? this.queue.findIndex(video => video.__id__ === active_id) : -1;
        this.renderQueueHTML();
    },
    moveDownInQueueByIdEx: function(messege){
        const active_id = this.queueIndex >= 0 ? this.queue[this.queueIndex].__id__ : null;

        const index = this.queue.findIndex(video => video.__id__ === messege.video.__id__);
        if(index === -1 || index == this.queue.length - 1){
            return;
        }
        const video = this.queue[index];
        this.queue.splice(index, 1);
        this.queue.splice(index + 1, 0, video);
        this.queueIndex = active_id ? this.queue.findIndex(video => video.__id__ === active_id) : -1;
        this.renderQueueHTML();
    },

    playFromQueueById: function(__id__){
        const index = this.queue.findIndex(video => video.__id__ === __id__);
        this.playIndex(index);
        YOUTUBE_MESSEGE.playFromQueueById(this.queue[index]);
    },

    playNextInQueue: function(){
        if(this.queueIndex + 1 < this.queue.length){
            this.playIndex(this.queueIndex + 1);
            return;
        }
        if(this.queueInLoop()){
            this.playIndex(0);
        }
    },

    queueInLoop: function(){
        return document.getElementById('youtube-loop-queue-btn').classList.contains('youtube-media-button-active');
    },

    toggleLoopQueue: function(){
        document.getElementById('youtube-loop-queue-btn').classList.toggle('youtube-media-button-active');
        YOUTUBE_MESSEGE.queueLoop(this.queueInLoop());
    },

    setQueueLoop: function(set = true){
        if(set){
            document.getElementById('youtube-loop-queue-btn').classList.add('youtube-media-button-active');
        }else{
            document.getElementById('youtube-loop-queue-btn').classList.remove('youtube-media-button-active');
        }
    },
    setQueueLoopEx: function(messege){
        if(messege.loopSet){
            document.getElementById('youtube-loop-queue-btn').classList.add('youtube-media-button-active');
        }else{
            document.getElementById('youtube-loop-queue-btn').classList.remove('youtube-media-button-active');
        }
    },

    // setLoopById: function(__id__){
    //     if(this.currentId() != __id__){
    //         return;
    //     }
    // },

    setLoopByIdEx: function(__id__){
        
    },

    setTitle: function(title){
        document.getElementById('video-filename-tab').textContent = title;
        document.getElementById('video-filename-title').textContent = title;
    },
    

    playIndex: async function(index){
        try {
            await this.beYouTube();
        } catch (error) {
            console.error(error);
            return;
        }
        if(index < 0 || index >= this.queue.length){
            console.error(`Cannot play index: ${index}`)
        }
        if(this.queue[index].videoId){
            VIDEO.__player__.__loadVideoById(this.queue[index].videoId);
            this.queueIndex = index;
            this.renderQueueHTML();
            this.setTitle(this.queue[index].title)
        }
        
    },
    beYouTube: async function(){
        if(VIDEO.__getSourceType__() != 'youtube'){
            const status = await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject({error: 'Youtube player is not ready on due time'});
                }, 5000);
                VIDEO.beYouTube();
                EVENTS.platform.addEventListener('youtube-player-ready', ()=> {
                    clearTimeout(timeout);
                    resolve({error: false});
                });
            });
            if(status.error){
                throw new Error(status.error);
            }
        }
    },
    playDirectByUrl: async function(url){
        try {
            await this.beYouTube();
        } catch (error) {
            console.error(error);
            return;
        }
        const video = await this.createVideoObj(url);
        this.queueIndex++;
        this.addToIndex(this.queueIndex, video);
        this.playIndex(this.queueIndex);
        // VIDEO.__player__.__loadVideoById(youtubeURLtoId(url));
        this.renderQueueHTML();
        YOUTUBE_MESSEGE.directPlay(video);
    },

    getCurrentVideoTitle: function(){
        if(this.queueIndex === -1){
            return null;
        }
        const video = this.queue[this.queueIndex];
        return video.title ?? 'unknown'
    },
    getCurrentVideoId: function(){
        if(this.queueIndex === -1){
            return null;
        }
        const video = this.queue[this.queueIndex];
        return video.videoId ?? 'unknown'
    },
    __isActive__: function(){
        return (this.queue.length) > 0 && (this.queueIndex !== -1);
    },

    __destroy__: function(){
        this.queueIndex = -1;
        this.renderQueueHTML();
    },

    pushQueueData: function(syncData){
        this.queue = syncData.queue;
        this.queueIndex = syncData.queueIndex;
        this.renderQueueHTML();
        this.setQueueLoop(syncData.queueInLoop);
    }

};

function getYoutubeSyncData(){
    const syncData = {};
    syncData.playerType = 'youtube';
    syncData.currentTime = VIDEO.__getCurrentTime__();
    syncData.isPaused = VIDEO.__isPaused__();
    syncData.queue = YOUTUBE_MANAGER.queue;
    syncData.queueIndex = YOUTUBE_MANAGER.queueIndex;
    syncData.queueInLoop = YOUTUBE_MANAGER.queueInLoop();
    return syncData;
}

function playYoutubeById(){
    const input = document.getElementById('youtube-url-input');
    if(!input.value){
        return;
    }
    try {
        YOUTUBE_MANAGER.playDirectByUrl(input.value)
        input.value = '';
    } catch (error) {
        console.error(error)
    }
}

function addToYouTubeQueue(){
    const input = document.getElementById('youtube-url-input');
    if(!input.value){
        return;
    }
    try {
        YOUTUBE_MANAGER.addToQueueByUrl(input.value);
        // VIDEO.__addToQueue__(input.value);
        input.value = '';
    } catch (error) {
        console.error(error)
    }
}


function createQueueItemDiv (video, current = false, first, last){
    
    // if(YOUTUBE_MANAGER.queueItemDivCache.has(video.videoId)){
    //     return YOUTUBE_MANAGER.queueItemDivCache.get(video.videoId);
    // }
    
    const div = document.createElement('div');
    div.classList.add('youtube-queue-item');


        const leftBtn = document.createElement('button');
        leftBtn.classList.add('youtube-queue-item-left-icon');
        
        
        if(current){
            div.classList.add('youtube-queue-currenty-playing');
            leftBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            // leftBtn.innerHTML = '<i class="fa-solid fa-repeat"></i>';
            // leftBtn.onclick = ()=>{
            //     // YOUTUBE_MANAGER.setLoopById(`${video.__id__}`);
            // }
        }else{
            leftBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
            leftBtn.classList.add('ease-btn')
            leftBtn.onclick = (eve) =>{
                eve.stopPropagation();
                YOUTUBE_MANAGER.removeFromQueueById(`${video.__id__}`);
            }
        }

        div.appendChild(leftBtn);

        const thumbnail = document.createElement('img');
        thumbnail.classList.add('youtube-queue-item-thumbnail');
        thumbnail.setAttribute('src', video.thumbnail);
        div.appendChild(thumbnail);

        const infoBox = document.createElement('div');
        infoBox.classList.add('youtube-queue-item-info-box');

            const title = document.createElement('p');
            title.classList.add('youtube-queue-item-title');
            title.textContent = video.title;
            infoBox.appendChild(title);
            
            const additionalInfo = document.createElement('div');
            additionalInfo.classList.add('youtube-queue-item-additional-info');

                const channelTitle = document.createElement('p');
                channelTitle.classList.add('youtube-queue-item-chanleTitle');
                channelTitle.textContent = video.channelTitle;
                additionalInfo.appendChild(channelTitle);

                const addedBy = document.createElement('p');
                addedBy.classList.add('youtube-queue-item-addedBy');
                addedBy.textContent = video.addedBy == ROOM.getUsername() ? 'You' : video.addedBy;
                additionalInfo.appendChild(addedBy);

            infoBox.appendChild(additionalInfo);
            
        div.appendChild(infoBox);


        const upDownBtn = document.createElement('div');
        upDownBtn.classList.add('youtube-queue-item-button-box');

        if(!first){
            const moveUpBtn = document.createElement('button');
            moveUpBtn.classList.add('youtube-queue-item-btn');
            moveUpBtn.classList.add('ease-btn');
            moveUpBtn.innerHTML = '<i class="fa-solid fa-chevron-up">';
            moveUpBtn.onclick = (eve)=>{
                eve.stopPropagation();
                YOUTUBE_MANAGER.moveUpInQueueById(`${video.__id__}`);
            }
            upDownBtn.appendChild(moveUpBtn);
        }

        if(!last){
            const moveDownBtn = document.createElement('button');
            moveDownBtn.classList.add('youtube-queue-item-btn');
            moveDownBtn.classList.add('ease-btn');
            moveDownBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
            moveDownBtn.onclick = (eve)=>{
                eve.stopPropagation();
                YOUTUBE_MANAGER.moveDownInQueueById(`${video.__id__}`);
            }
            upDownBtn.appendChild(moveDownBtn);
        }
        div.appendChild(upDownBtn);

        div.onclick = (eve)=>{
            YOUTUBE_MANAGER.playFromQueueById(`${video.__id__}`)
        };
    
    return div;
}