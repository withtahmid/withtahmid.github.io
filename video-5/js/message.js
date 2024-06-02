const MESSAGE = {
    existing: function(){
        return {
            type: 'existing',
            username: ROOM.username,
            video: VIDEO.videoAdded,
            subtitle: VIDEO.subtitleAdded,
            inSync: ROOM.inSync,
            fullScreen: VIDEO.isFullScreen(),
            tab: userOnThisTab(),
            videoFileName: VIDEO.videoFileName ? VIDEO.videoFileName : 'No video is added',
            subtitleFileName: VIDEO.subtitleFileName ? VIDEO.subtitleFileName : 'No subtitle is added',
            currentTime: VIDEO.currentTime(),
            sourceType: VIDEO.sourceType,
        }
    },
    text: function(text){
        return {
            type: 'text',
            username: ROOM.username,
            time: TIME.now(),
            text: text
        }
    },

    media: function(mediaType){
        return {
            type: 'media',
            username: ROOM.username,
            mediaType: mediaType,
            time: VIDEO.currentTime() || 0,
        }
    },

    newVideo: function(){
        return{
            type: 'newVideo',
            username: ROOM.username,
            sourceType: VIDEO.sourceType,
            sourceURL: VIDEO.sourceURL,
            videoFileName: VIDEO.videoFileName
        }
    },

    join: function(){
       return { 
        type: 'join',
        username: ROOM.username
       }
    },
    leave: function(){
        return { 
         type: 'leave',
         username: ROOM.username
        }
     },
    syncRequest: function(){
        return {
            type : 'syncRequest',
            username: ROOM.username
        }
    },
    syncResponse: function(forUser){
        return {
            type : 'syncResponse',
            username: ROOM.username,

            forUser: forUser,

            sourceType: VIDEO.sourceType,
            sourceURL: VIDEO.sourceURL,
            
            currentTime: VIDEO.currentTime(),
            paused: VIDEO.isPaused(),

        }
    }
};

const notificationIcons = {
    join: '<i class="fa-solid fa-person-through-window"></i>',
    leave: '<i class="fa-solid fa-person-walking-arrow-right"></i>',
    play: '<i class="fa-solid fa-play"></i>',
    pause: '<i class="fa-solid fa-circle-pause"></i>',
    seeked: '<i class="fa-solid fa-forward"></i>',
    youtube: '<i class="fa-brands fa-youtube"></i>',
    local: '<i class="fa-solid fa-file-video"></i>',
    syncResponse: '<i class="fa-solid fa-rotate"></i>',
}

const notificationContainer = document.querySelector('.notification-box');
let notificationTimerId, notificationTimerId2;
function addNotification(notification){
    clearTimeout(notificationTimerId);
    clearTimeout(notificationTimerId2);
    let notificationDiv = `<div class="notification">
                            <div class="notification-type-icon">
                                ${notificationIcons[notification.type]}
                            </div>
                            <p class="notification-user">${notification.username}</p>
                            <p class="notification-type">${notification.text}</p>
                            ${notification.playTime >= 0 ? `<p class="notification-mediatime">${formatDuration(notification.playTime)}</p>`: ""}
                        </div>
                        `;
    notificationContainer.innerHTML += notificationDiv;
    notificationContainer.classList.add('show-notification');
    notificationTimerId = setTimeout(()=>{
        notificationContainer.classList.remove('show-notification');
        notificationTimerId2 = setTimeout(()=>{
            notificationContainer.innerHTML  = '';
        }, 500);
    }, 3000);
}

const messageText = {
    join: 'joined the room',
    leave: 'left the room'
}

function generateNotification(message){
    if(message.type === 'media'){
        return {
            type: message.mediaType,
            username: message.username,
            text: `${message.mediaType}ed at`,
            playTime: message.time
        }
    }
    else if(message.type === 'newVideo'){
        return {
            type: message.sourceType,
            username: message.username,
            text: `Played a new video from ${message.sourceType}`,
            playTime: message.currentTime
        }
    }
    else if(message.type === 'syncResponse'){
        return {
            type: message.type,
            username: message.username,
            text: `${message.username} is playing from ${message.sourceType}`,
            playTime: message.currentTime
        }
    }
    return{
        type: message.type,
        username: message.username,
        text: messageText[message.type],
    }
}

const messageHandeler = new Map();
messageHandeler.set('existing', handleExistMessage);
messageHandeler.set('text', handleTextMessage);
messageHandeler.set('media', handleMediaMessage);
messageHandeler.set('join', handleJoinMessage);
messageHandeler.set('leave', handleLeaveMessage);
messageHandeler.set('syncRequest', handleSyncRequest);
messageHandeler.set('syncResponse', handleSyncResponse);
messageHandeler.set('newVideo', handleNewVideoMessage);


// messageHandeler.set('poke', handlePokeMessage);
// messageHandeler.set('reconnect', handleReconnectMessage);
// messageHandeler.set('conflict', handleConflictMessage);
// messageHandeler.set('mediaReguest', hadleMediaReguestMessage);
// messageHandeler.set('mediaResponse', handleMediaResponseMessage);



// messageHandeler.set('change', handleChangeMessage);

const ignorePeopleMessageType = ['leave'];

const MessageHandler = {
    handle: function(json){
        const message = JSON.parse(json);
        ROOM.registerPresence(message);
        messageHandeler.get(message.type)(message);
        logMessage(message)
        // ROOM.refreshOnePeople(message.username);
    }
}

const connectedPeopleTimes = new Map();

const connectedPleopleKeyPair = {
    video: 'people-video',
    subtitle: 'people-caption',
    inSync: 'people-sync',
    fullScreen: 'people-fullscreen',
    tab: 'people-tab',
}

const sourceIcons = {
    youtube: '<i class="fa-brands fa-youtube"></i>',
    local: '<i class="fa-solid fa-file-video"></i>',
    null: '',
}

function handleTimeDifference(message){
    if((message.username === ROOM.username) || (!VIDEO.videoAdded)){
        return;
    }
    // if()
    // console.log(message.currentTime, VIDEO.currentTime());
    // displayErrorOnScreen('Playtime mismatch ditedted');
}

function handleExistMessage(message){
    let div;

    handleTimeDifference(message);

    if(!ROOM.connectedPeopleLsitMap.has(message.username)){
        ROOM.peoplesInTheRoom.add(message.username);
        div = document.createElement('div');
        div.classList.add('one-people');
        div.setAttribute('id', `people-${message.username}`);
        div.innerHTML = `
                        <div>
                            <i class="fa-solid fa-signal status-icon"></i>
                            </div>
                            <img height="30" width="30" src="./elements/img/avaters/avater-1.png" alt="">
                            <p style="flex-grow: 1;">${message.username}</p>
                            <div>
                                <i class=" people-video-no fa-regular fa-file-video"></i>
                                <i class="people-video-yes fa-solid fa-file-video"></i>
                            </div>
                            <div>
                                <i class="people-caption-yes fa-solid fa-closed-captioning"></i>
                                <i class="people-caption-no fa-regular fa-closed-captioning"></i>
                            </div>

                            <div>
                                <i class="people-fullscreen-yes fa-solid fa-expand"></i>
                                <i class="people-fullscreen-no fa-solid fa-compress"></i>
                            </div>
                            <div>

                                <i class="people-tab-yes fa-solid fa-t"></i>
                                <i class="people-tab-no fa-solid fa-text-slash"></i>
                            </div>
                            <div>
                                <i class="people-sync-yes fa-solid fa-rotate fa-spin"></i>
                                <i class="people-sync-no fa-solid fa-rotate"></i>
                            </div>
 
                            <input type="checkbox" id="${message.username}-section" class="accordion-checkbox" checked = "checked"/>
                            <label style ="cursor: pointer;" for="${message.username}-section" class="accordion-header">
                                <i class="fa-solid fa-circle-info"></i>
                            </label>
                            <div class="accordion-content one-people-info">
                            <div class="one-info">
                                <p class="icon">
                                <i class=" people-video-no fa-regular fa-file-video"></i>
                                <i class="people-video-yes fa-solid fa-file-video"></i>
                                </p>
                                <p id = "${message.username}-videoFileName">...</p>
                            </div>
                            <div class="one-info">
                                <p class="icon">
                                    <i class="people-caption-yes fa-solid fa-closed-captioning"></i>
                                    <i class="people-caption-no fa-regular fa-closed-captioning"></i>
                                </p>
                                <p id = "${message.username}-subtitleFileName">...</p>
                            </div>
                            <div class="one-info">
                                <p class="icon">
                                    <i class="people-fullscreen-yes fa-solid fa-expand"></i>
                                    <i class="people-fullscreen-no fa-solid fa-compress"></i>
                                </p>
                                <p id = "${message.username}-fullScreen">...</p>
                            </div>
                            <div class="one-info">
                                <p class="icon">
                                <i class="people-tab-yes fa-solid fa-t"></i>
                                <i class="people-tab-no fa-solid fa-text-slash"></i>
                                </p>
                                <p id = "${message.username}-inTab">...</p>
                            </div>
                            <div class="one-info">
                                <p class="icon">
                                    <i class="people-sync-yes fa-solid fa-rotate fa-spin"></i>
                                    <i class="people-sync-no fa-solid fa-rotate"></i>
                                </p>
                                <p id = "${message.username}-inSync">...</p>
                            </div>
                        </div>
                        `;

        ROOM.connectedPeopleLsit.appendChild(div);
        ROOM.connectedPeopleLsitMap.set(message.username, document.getElementById(`people-${message.username}`));
        ROOM.refreshOnePeople(message.username)

    }
    else{
        div = ROOM.connectedPeopleLsitMap.get(message.username)
    }

    const connectedpeopleDetailInfo = {
        videoFileName: message.videoFileName,
        subtitleFileName: message.subtitleFileName,
        fullScreen: message.fullScreen ? 'Full Screen' : 'Not Full Screen',
        inSync: message.inSync ? 'In Sync' : 'Not in Sync',
        inTab: message.tab ? "In Tab" : "Not in tab",
    }

    for(i in connectedPleopleKeyPair){
        if(message[i]){
            div.classList.add(connectedPleopleKeyPair[i]);
        }
        else{
            div.classList.remove(connectedPleopleKeyPair[i]);
        }
    }

    for(let i in connectedpeopleDetailInfo){
        document.getElementById(`${message.username}-${i}`).textContent = connectedpeopleDetailInfo[i];
    }
    ROOM.refreshOnePeople(message.username);
}
function handleTextMessage(message){
    appendTextToTextBox(message);
}


function appendTextToTextBox(message){
    const chatBox = document.getElementById('chat-box-container');
    ROOM.ringNotification();
    const container = document.createElement('div');
    container.classList.add('message-container');
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    if(message.username === ROOM.username){
        messageDiv.classList.add('you');
    }
    
    const img = document.createElement('img');
    img.setAttribute('height', '30');
    img.setAttribute('width', '30');
    img.setAttribute('src', './elements/img/avaters/avater-1.png');
    messageDiv.appendChild(img);
    
    const text = document.createElement('p');
    text.classList.add('text');
    text.textContent = message.text;
    messageDiv.appendChild(text);
    
    const time = document.createElement('p');
    time.classList.add('time');
    time.textContent = TIME.format12h(new Date(message.time));
    messageDiv.appendChild(time);
    
    container.appendChild(messageDiv);

    const sender = document.createElement('p');
    sender.classList.add('sender');
    sender.textContent = message.username;
    container.appendChild(sender);
    chatBox.appendChild(container);
    if(VIDEO.isFullScreen() && VIDEO.allowChatOnScreen){
        videoContainer.classList.add('on-video-chat');
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}




const mediaHandlers = {
    play: function(time){
        VIDEO.play(time);

    },
    pause: function(time){
        VIDEO.pause(time);
    },
    seeked: function(time){
        VIDEO.seek(time);
    }
}
function handleMediaMessage(message){
    if(message.username === ROOM.username){
        return;
    }
    if(!VIDEO.videoAdded){
        return;
    }
    
    addNotification(generateNotification(message));
    VIDEO.ignoreMediaEvent = true;
    mediaHandlers[message.mediaType](message.time);   
    setTimeout(()=>{
        VIDEO.ignoreMediaEvent = false;
    },1500);
}
function handleJoinMessage(message){
    ROOM.broadcastExisTance();
    if(message.username == ROOM.username){
        return;
    }
    addNotification(generateNotification(message));

}
function handleLeaveMessage(message){
    if(message.username == ROOM.username){
        return;
    }
    addNotification(generateNotification(message));

    const removeChiled = document.getElementById(`people-${message.username}`);
    
    for([key, val] of ROOM.connectedPeopleTimes){
        console.log(key);
    }

    ROOM.connectedPeopleLsitMap.delete(message.username);
    ROOM.connectedPeopleTimes.delete(message.username);
    ROOM.peoplesInTheRoom.delete(message.username);
    if(removeChiled){
        ROOM.connectedPeopleLsit.removeChild(removeChiled);  
    }
}

function handleSyncRequest(message){
    if(!VIDEO.videoAdded || message.username == ROOM.username){
        return;
    }
    ROOM.sendMessage(MESSAGE.syncResponse(message.username)); 
}

const syncHandler = new Map();
syncHandler.set('local', hanleSyncResponseLocal);
// syncHandler.set('gdrive', hanleSyncResponseGDrive);
syncHandler.set('youtube', hanleSyncResponseYouTube);
function hanleSyncResponseLocal(message){
    if(!VIDEO.videoAdded){
        displayErrorOnScreen('Cannon open local media');
        return;
    }
    message.paused ? VIDEO.pause() : VIDEO.play(message.currentTime);
}
function hanleSyncResponseYouTube(message){
    try{
        VIDEO.ytSync = {
            active: true,
            time: message.currentTime,
            paused: message.paused
        };
        VIDEO.ignoreNewVideoEvent = true;
        VIDEO.playVideo(message.sourceURL, 'youtube', `Synced from ${message.username}`);
    }
    catch(e){
        console.error(e);
    }
}
function handleSyncResponse(message){
    if((message.username == ROOM.username) || (message.forUser != ROOM.username)){
        return;
    }
    ROOM.requestForSync = false;
    addNotification(generateNotification(message));
    VIDEO.ignoreMediaEvent = true;
    syncHandler.get(message.sourceType)(message);
    setTimeout(()=>{
        VIDEO.ignoreMediaEvent = false;
    },1500);
}

const newVideoHandler = new Map();
newVideoHandler.set('local', playNewLocalVideo);
// newVideoHandler.set('gdrive', playNewDriveVideo);
newVideoHandler.set('youtube', playNewYoutubeVideo);

function playNewLocalVideo(message){
    return; // will fix later
}

function playNewYoutubeVideo(message){
    try{
        VIDEO.ignoreNewVideoEvent = true;
        VIDEO.playVideo(message.sourceURL, 'youtube', `playing from ${message.username}`);
    }
    catch(e){
        console.error(e);
    }
}

function handleNewVideoMessage(message){
    if(message.username === ROOM.username){
        return;
    }
    addNotification(generateNotification(message));
    newVideoHandler.get(message.sourceType)(message);
}

const logTable = document.querySelector('.log-table');
const ignoredMessageTypes = ['existing'];
function logMessage(message){
    if(ignoredMessageTypes.includes(message.type)){
        return;
    }
    const row = document.createElement('tr');
    row.innerHTML = `<tr>
                    <td>${message.username === ROOM.username ? "You" : message.username}</td>
                    <td>${message.type}</td>
                    <td>${message.mediaType ? message.mediaType : 'N/A'}</td>
                    <td>${formatDuration(VIDEO.video.currentTime)}</td>
                    <td>${TIME.formatHMS(TIME.now())}</td>
                    </tr>`
    logTable.appendChild(row);
}
function clearLog(){
    logTable.innerHTML = `<tr>
                            <td>User</td>
                            <td>Type</td>
                            <td>Event</td>
                            <td>Play</td>
                            <td>Time</td>
                        </tr>`;
}
