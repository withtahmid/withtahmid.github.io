function insertCharacterInMiddle(str, character) {
    const middleIndex = Math.floor(str.length / 2);
    const firstHalf = str.slice(0, middleIndex);
    const secondHalf = str.slice(middleIndex);
    return firstHalf + character + secondHalf;
}
function inputIsValid(username, roomName){
    warning = "";
    if(username == "" || username.includes(' ')){
      warning += "Username is empty or contains space\n";
    }
    if(roomName.length < 5 || roomName.length > 10 || roomName.includes(' ')){
      warning += "Room name must be between 5 and 10 character without space\n";
    }
    if(warning !== ""){
      alertUser(warning);
      return false;
    }
    return true
}

function makeStatusBarFullWidth(){
   label = document.getElementById('connedtion-status');
   label.classList.remove('zero-width');
   label.classList.add('full-width-90');
}

function makeStatusBarZero(){
   label = document.getElementById('connedtion-status');
   label.classList.add('zero-width');
   label.classList.remove('full-width-90');
}

function updateStatusSignal(status){
    if(status === 'connected' && firstConncet()){
        makeStatusBarFullWidth();
    }
    const statusSignal = document.getElementById('connedtion-status');
    statusSignal.classList.remove('not-connected');
    statusSignal.classList.remove('connected');
    statusSignal.classList.remove('disconnected');
    statusSignal.classList.add(status);
}

function makeDivZero(divID){
  const div = document.getElementById(divID);
  var height = div.offsetHeight;
  
  storeHtmlById(divID, div.innerHTML);
  storeHeightbyId(divID, height);

  div.style.height = height;

  var intervalId = setInterval(function() {
      height -= 1;
      div.style.height = height + 'px';
      if (height <= 0) {
        clearInterval(intervalId);
        div.innerHTML = '';
        div.style.height = '0';
      }
    }, 10);
}

function makeDivFullHeight(divID){
  const div = document.getElementById(divID);
  target = Number(getHeightById(divID));
  height = 0;
  var intervalId = setInterval(function() {
      height += 1;
      div.style.height = height + 'px';
      if (height >= target) {
        clearInterval(intervalId);
        div.innerHTML = getHtmlById(divID);
        div.style.height = 'auto';
      }
    }, 10);
}
function activateConnectionButtons(){
  removeClass('connection-roomname', 'roomDisconnect');
  addClass('connection-roomname', 'roomConnect');
  if(sync()){
    removeClass('connection-sync', 'noSync');
    addClass('connection-sync', 'sync'); 
  }
}

function deactivateConnectionButtons(){
  removeClass('connection-roomname', 'roomConnect');
  addClass('connection-roomname', 'roomDisconnect');

  removeClass('connection-sync', 'sync');
  addClass('connection-sync', 'noSync');
}
function ButtonInputOff(id, val){
  const div = document.getElementById(id);
  var buttons = div.querySelectorAll('button');
  var inputs = div.querySelectorAll('input');
  buttons.forEach(function(button) {
    button.disabled = val;
  });

  inputs.forEach(function(input) {
    input.disabled = val;
  });
}

function handelFirstTimeConnection(){
  makeUniqueKey();
  requestForSync();
  document.getElementById('connectButton').innerHTML = 'Join';


  inputField = document.getElementById('connectionInputField');
  inputField.classList.add('zero-height');
  inputField.classList.remove('full-height-10');
  // 
  removeClass('connectionSettings', 'inactive');
  addClass('connectionSettings', 'active');

  removeClass('connectedPeopleList', 'inactive');
  addClass('connectedPeopleList', 'active');

  removeClass('message-box', 'inactive');
  addClass('message-box', 'active');

  // addClass('connectionInputField', 'inactive');

  ButtonInputOff('connectionSettings', false);
  ButtonInputOff('message-box', false);
  
  removeClass('room-info', 'inactive');
  addClass('room-info', 'active');

  document.getElementById('connection-username').innerHTML = "<i class='fas fa-user'></i> " + getUsername();
  document.getElementById('connection-roomname').innerHTML = "<i class='fas fa-home'></i> " + getRoomName();
  // document.getElementById('connection-sync').
  firstHappened();
  existanceBroadcastIntervalId = setInterval(broadCastExistance, 5000);
  refreshConnectedPeopleIntervalId = setInterval(refreshConnectFeed, 4000);
}

function resetAllConnection(){
  resetFirst();
  ButtonInputOff('connectionSettings', true);
  ButtonInputOff('message-box', true);
  removeClass('connection-roomname', 'roomDisconnect');
  removeClass('connection-roomname', 'roomConnect');
  removeClass('connection-sync', 'noSync');
  removeClass('connection-sync', 'sync');
  
  addClass('room-info', 'inactive');
  removeClass('room-info', 'active');


  removeClass('connectionInputField', 'inactive');
  addClass('connectionInputField', 'active');
  
  removeClass('connectionSettings', 'active');
  addClass('connectionSettings', 'inactive');

  addClass('connectedPeopleList', 'inactive');
  removeClass('connectedPeopleList', 'active');

  addClass('message-box', 'inactive');
  removeClass('message-box', 'active');
  
  // makeDivFullHeight('connectionInputField');
  inputField = document.getElementById('connectionInputField');
  inputField.classList.remove('zero-height');
  inputField.classList.add('full-height-10');

  document.getElementById('connection-username').innerHTML = '<i class="fas fa-globe rotate-globe"></i> Username';
  document.getElementById('connection-roomname').textContent = "Room Name";
  document.getElementById('peopleRefreshList').innerHTML = '';
  document.getElementById('messageContainer').innerHTML = '';
  makeStatusBarZero();
  setSync(true);
  setIntentonalDisconnect(false);
  clearInterval(existanceBroadcastIntervalId);
  clearInterval(refreshConnectedPeopleIntervalId);
  resetPeopleList();
  resetNotification();
}
function toggleSync(){
  if(!isConnected()){
    return;
  }
  btn = document.getElementById('connection-sync');
  if(btn.classList.contains('sync')){
    removeClass('connection-sync', 'sync');
    addClass('connection-sync', 'noSync');
    setSync(false);
  }
  else{
    addClass('connection-sync', 'sync');
    removeClass('connection-sync', 'noSync');
    setSync(true);
    requestForSync();
  }
}

function disconnectConnection(){
  setIntentonalDisconnect(true);
  publishMessage(generateMessage('leave', 'null', 'null'));
  setTimeout(function(){
    mqttClient.end();
  }, 200);
}

function removeClass(id, className){
  document.getElementById(id).classList.remove(className);
}

function addClass(id, className){
  document.getElementById(id).classList.add(className);
}

function publishMessage(payload){
  if((!isConnected()) || (!getPublishFlag())){
    return;
  }
  mqttClient.publish(getTopic(), payload);
} 

setInterval(function(){
  if(!isConnected()){
    return;
  }
  mqttClient.publish('withtahmidxyz', `withtahmid$${getRoomName()}$${getUsername()}`);
},15000);

function broadCastExistance(){
  media = 'null';
  if(isPlaying() && sync()){
    media = 'true';
    if(subTitleAded()){
      media += '$true';
    }else{
       media += "$null";
    }

    if(isVideoPlayerFullScreen()){
      media += '$FULL';
    }else{
      media += '$!FULL';
    }

    if(videoPlayer.paused){
      media += "$pause";
    }else{
      media += "$play";
    }
  }
  message = generateMessage('exist', media, getUniqueKey());
  publishMessage(message);
}
function requestMedia(username){
  if(username == getUsername()){
    return;
  }
  publishMessage(generateMessage('mediaReguest', username, 'null'));
}
function createPeopleForList(username, now){
  people = document.createElement('div');
  people.setAttribute('id', 'prople-username');
  people.setAttribute('class', 'eachPeople');
  timeAgo = userLastResponseTime(username, now);
  timeMessage = '';
  
  let subtitle = '';
  let sub_Title = '';
  if(getUserSubtitleName(username) !== 'null'){
    subtitle = " <i class='fas fa-closed-captioning'></i>";
    sub_Title = getUserSubtitleName(username);
  }

  let screenMode = '';
  if(getUserScreenMode(username) == 'FULL'){
    screenMode = "<i class='fas fa-expand'></i>"
  }

  let videoFile;
  click = `onclick = "requestMedia('${username}')"`;
  if(getUserVideoFileName(username) !== 'null'){
    title = "playing video";
    if(sub_Title != ''){
      title += "\nwith subtitle";
    }
    if(screenMode !== ''){
      title += "\nin full screen";
    }
    // click =`onclick = "putNotificationOnScreen('${getUserVideoFileName(username)}')"`;
    

    videoFile = "<span><label " + click + " title ='"+title+"'><i class='fas fa-film'></i>"+subtitle+ " " + screenMode +"</label></span>";
  }else{
    videoFile = "<span><lebel " + click + " title ='Not playing'><i class='fas fa-exclamation-circle'></i></label></span>";
  }


  var media = videoFile;

  if(timeAgo > 60){
    if(username != getUsername()){
      removeUser(username);
    }
    timeMessage = 'Disconnected';
    people.classList.add('disconnected');
  }
  else if(timeAgo > 20){
    timeMessage = 'Disconnected';
    people.classList.add('disconnected');
  }
  else if(timeAgo > 8){
    timeMessage = 'Connecting';
    people.classList.add('late');
  }
  else{
    timeMessage = 'Active';
    people.classList.add('active')
  }
  people.innerHTML = "<span>" + username + "</span><span>" + timeMessage +"</span> " +  media;//  + "<span><button onclick='poke(\"" + username + "\")'><i class='fas fa-hand-point-right'></i></button></span>";
  if(username == getUsername()){
    people.classList.remove('disconnected');
    people.classList.remove('late');
    people.classList.remove('active');
    people.classList.add('thisUser');
    people.innerHTML = "<span> You </span><span>" + timeMessage+ "</span> " +  media;//  + "<span><button><i class='fas fa-user-circle'></i></button></span>";
  }
 
  return people;
}

function refreshConnectFeed(){
  if(isVideoPlayerFullScreen()){
    return;
  }
  peoples = [];
  const now = currentTime();
  for (const [username, lastResponseTime] of getPeopleList()) {
    peoples.push(createPeopleForList(username, now));
  }
  peopleList = document.getElementById('peopleRefreshList');
  const temp = document.createElement('div');
  peoples.forEach(function(child){
    temp.appendChild(child);
  });
  peopleList.innerHTML = temp.innerHTML;
}

squeezed = true;

function squeeze(){

  document.getElementById('src-local').classList.add('src-zero-width');
  document.getElementById('src-drive').classList.add('src-zero-width');
  document.getElementById('src-youtube').classList.add('src-zero-width');
  
  document.getElementById('src-local').classList.remove('src-full-width');
  document.getElementById('src-drive').classList.remove('src-full-width');
  document.getElementById('src-youtube').classList.remove('src-full-width');
  squeezed = true;

} 

function unsqueeze(){
  document.getElementById('src-local').classList.remove('src-zero-width');
  document.getElementById('src-drive').classList.remove('src-zero-width');
  document.getElementById('src-youtube').classList.remove('zero-width');

  document.getElementById('src-local').classList.add('src-full-width');
  document.getElementById('src-drive').classList.add('src-full-width');
  document.getElementById('src-youtube').classList.add('src-full-width');
  squeezed = false;
} 

function src_option_clicked(){
  if(squeezed){
    unsqueeze();
  }else{
    squeeze();
  }
}

function source_local_select(){
  label = document.getElementById('videoFileInputdiv');
  label.classList.remove('hidden');
  document.getElementById('youtubeLabel').classList.add('hidden');
  document.getElementById('driveLinkInputField').classList.add('hidden');
  // document.getElementById('driveLinkButton').classList.add('hidden');
}

function source_drive_select(){
  
  input = document.getElementById('driveLinkInputField');
  input.classList.remove('hidden');
  
  document.getElementById('videoFileInputdiv').classList.add('hidden');
  document.getElementById('youtubeLabel').classList.add('hidden');
}
function source_youtube_select(){
  label = document.getElementById('youtubeLabel');
  label.classList.remove('hidden');
  
  document.getElementById('videoFileInputdiv').classList.add('hidden');
  document.getElementById('driveLinkInputField').classList.add('hidden');
}

source_select_functions = new Map();
source_select_functions.set('src-local', source_local_select);
source_select_functions.set('src-drive', source_drive_select);
source_select_functions.set('src-youtube', source_youtube_select);

function addSubtlieTheme(source){
  const div = document.getElementById('subtitleBox');
  var buttons = div.querySelectorAll('button');
  var labels = div.querySelectorAll('label');
  buttons.forEach(function(button) {
    button.classList.add(source);
  });
  labels.forEach(function(label) {
    label.classList.add(source);
  });
}
function removeSubtileTheme(source){
  const div = document.getElementById('subtitleBox');
  var buttons = div.querySelectorAll('button');
  var labels = div.querySelectorAll('label');
  buttons.forEach(function(button) {
    button.classList.remove(source);
  });
  labels.forEach(function(label) {
    label.classList.remove(source);
  });
  
}

function matchSubtitleTosrcTheme(){
  removeSubtileTheme('default');
  source = getSelectedSource();
  if(source !== 'src-local'){
    removeSubtileTheme('src-local');
    removeClass('videoFileNameLabel', 'src-local');
    removeClass('subtitleFileNameLabel', 'src-local');
  }
  if(source !== 'src-drive'){
    removeSubtileTheme('src-drive');
    removeClass('videoFileNameLabel', 'src-drive');
    removeClass('subtitleFileNameLabel', 'src-drive');
  }
  if(source !== 'src-youtube'){
    removeSubtileTheme('src-youtube');
    removeClass('videoFileNameLabel', 'src-youtube');
    removeClass('subtitleFileNameLabel', 'src-youtube');
  }

  addClass('videoFileNameLabel', source);
  addSubtlieTheme(source);
}


function selectSource(source){
  const previousButton = document.getElementById(getSelectedSource());
  previousButton.classList.remove('hidden');

  const sourceButton = document.getElementById(source);
  const destinationButton = document.getElementById('src-option-button');

  selectedSource(source);

  destinationButton.innerHTML = sourceButton.innerHTML;
  destinationButton.className = sourceButton.className;
  destinationButton.classList.add('playing');
  sourceButton.classList.add('hidden');
  squeeze();
  fn = source_select_functions.get(source);
  fn();

}

function showVideoFileName(){
  filename = videoFileName();
  label = document.getElementById('videoFileNameLabel');
  label.textContent = '';
  i = 0;
  var intervalName = setInterval(function() {
     label.textContent  += filename[i];
     i += 1;
     if(i >= filename.length){
      clearInterval(intervalName);
     }
    }, 20);
}
function videoFileChanged(){

  setPlaying(true);

  container = document.getElementById('videoContainer');
  container.classList.remove('inactive');
  container.classList.add('active');
  document.getElementById('subtitleFileNameLabel').textContent = '';
  removeClass('subtitleFileNameLabel', 'src-local');
  removeClass('subtitleFileNameLabel', 'src-drive');
  removeClass('subtitleFileNameLabel', 'src-youtube');

  document.getElementById('subtitlesTrack').src = '';
  document.getElementById('subtitleFileNameLabel').textContent = '';
  ButtonInputOff('subtitleBox', false);
  removeClass('subtitleBox','inactive');
  // addClass('subtitleBox', 'active');
  addClass('showSubBtn', 'inactive');
  subtitleStatus(false);
  matchSubtitleTosrcTheme();
  showVideoFileName();
  document.getElementById('showSubBtn').disabled = true;
  mediaSource = getSelectedSource();
  if(sync() && isConnected()){
    publishMessage(generateMessage('change', mediaSource , getFileLink()));
  }
  broadCastExistance();
}

function displaySubtitles() {
  subtitleContainer = document.createElement('div');
  subtitleContainer.classList.add('subtitle-text');
  subtitleContainer.innerHTML = '';
  const currentTime = videoPlayer.currentTime;
  const cues = subtitlesTrack.track.cues;
  const rangeStart = currentTime - subtitleTolRange();
  const rangeEnd = currentTime + subtitleTolRange();

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];

    if (cue.startTime > rangeEnd) {
      break;
    }

    if (cue.endTime >= rangeStart && cue.startTime <= rangeEnd) {
      const subtitleText = cue.text.replace('\n', '<br>');
      const className = (cue.startTime <= currentTime && cue.endTime >= currentTime) ? 'currentSubtitle' : 'normalSubtitle';
      subtitleContainer.innerHTML += `<span class="${className}">${subtitleText}</span><br>`;
    }
  }
  popupContent.innerHTML = '';
  popupContent.appendChild(subtitleContainer);
}
function subtitleLoop(){
  if(!showSubtitleEnabled()){
    return;
  }
  displaySubtitles();
}

function showSubtitle(){
  subtitleVisible(true);
  displaySubtitles();
  removeClass('subtitleTolRange', 'hidden');
  showpopup();
}

videoPlayer.addEventListener('timeupdate', subtitleLoop);
function trimFileName(name){
  if(name.length > 25){
    name = name.slice(0,24) + ' ...';
  }
  return name;
}

function hidepopup(){
  const div = document.getElementById('popupdiv');
  div.classList.remove('full-height-92');
  div.classList.add('zero-height');

  subtitleVisible(false);
  notificationShowMode(false);
  addClass('subtitleTolRange', 'hidden');
}
function showpopup(){
  document.getElementById('popupcontentDiv').innerHTML = '';
  const div = document.getElementById('popupdiv');

  div.classList.remove('zero-height');
  div.classList.add('full-height-92');
}

function formatDuration(duration) {
  var hours = Math.floor(duration / 3600);
  var minutes = Math.floor((duration % 3600) / 60);
  var seconds = duration % 60;
  var hoursStr = hours.toString().padStart(2, "0");
  var minutesStr = minutes.toString().padStart(2, "0");
  var secondsStr = seconds.toString().padStart(2, "0");
  return `${hoursStr}:${minutesStr}:${parseInt(secondsStr)}`;
}

function getTimeFromDateHMS(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const amPm = hours >= 12 ? 'PM' : 'AM';

  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  return hours + ':' + minutes + ':' + seconds;
}

function showActivityList(){
  
  showpopup();


  container = document.createElement('div');
  container.classList.add('table-container');
  document.getElementById('popupcontentDiv').appendChild(container);
  tempContainer = container;
  table = document.createElement('table');
  thread = document.createElement('thead');

  table.style.color = 'white';
  table.style.width = '100%';
  const tableBody = document.createElement('tbody');
  tempTableBody = tableBody;
  const headingRow = document.createElement('tr');
  
  cell = document.createElement('th');
  cell.textContent = 'User';
  headingRow.appendChild(cell);

  cell = document.createElement('th');
  cell.textContent = 'Type';
  headingRow.appendChild(cell);

  cell = document.createElement('th');
  cell.textContent = 'Event';
  headingRow.appendChild(cell);

  cell = document.createElement('th');
  cell.textContent = 'Play';
  headingRow.appendChild(cell);

  cell = document.createElement('th');
  cell.textContent = 'Time';
  headingRow.appendChild(cell);

  thread.appendChild(headingRow);
 
  table.appendChild(thread);
  table.appendChild(tableBody);
  container.appendChild(table);
  
  notificationList = getNotificationList();
  notificationList.forEach(function(notification){
    const newRow = document.createElement('tr');

    cell = document.createElement('td');
    cell.textContent = notification.user;
    newRow.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = notification.type;
    newRow.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = notification.event;
    newRow.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = formatDuration(notification.playTime);
    newRow.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = getTimeFromDateHMS(notification.time);
    newRow.appendChild(cell);
    newRow.classList.add('btn-hover-fx');
    tableBody.appendChild(newRow);
    container.scrollTop = container.scrollHeight;

  });
  notificationShowMode(true); 
}


function createAncore(){
  time = videoPlayer.currentTime;
  setAncoreTime(time);
  document.getElementById('releaseAncore').textContent = formatDuration(time);
}
function playFromAncore(){
  videoPlayer.currentTime = getAncoretime();
}

mediaHandeler = new Map();
mediaHandeler.set('play', function(playTime){
  videoPlayer.currentTime = playTime;
  videoPlayer.play();
});
mediaHandeler.set('pause', function(playTime){
  videoPlayer.currentTime = playTime;
  videoPlayer.pause();
});
mediaHandeler.set('seeked', function(playTime){
  videoPlayer.currentTime = playTime;
});

function createMediaNotification(message){
  notification = "'"+message.user+"' " + message.event;
  if(message.event !== 'seeked'){
    notification += 'ed at ';
  }else{
    notification += ' to ';
  }
  notification +=  formatDuration(message.playTime) + '.';
  return notification;
}

function handleMediaResponseMessage(message){
  if(message.event != getUsername()){
    return;
  }
  if(message.text === 'null'){
    putNotificationOnScreen(`${message.user}\n not playing \n or not in sync`);
    return;
  }
  media = message.text.split('$');
  username = message.user;
  videoFile = media[0];
  subtitle = media[1];
  putNotificationOnScreen(`${username}\nVideo: ${videoFile}\nSubtitle: ${subtitle} ${media[2] == 'FULL'? '\nFull screes' : ''}`);
}

function hadleMediaReguestMessage(message){
  if(message.event !== getUsername()){
    return;
  }
  media = 'null';
  if(isPlaying() && sync()){
    media = videoFileName();
    if(subTitleAded()){
      media += `$${getSubtitleName()}`;
    }else{
       media += "$Not added";
    }

    if(isVideoPlayerFullScreen()){
      media += '$FULL';
    }else{
      media += '$!FULL';
    }
  }
  message = generateMessage('mediaResponse', message.user, media);
  publishMessage(message);
}

function mediaControl(message){
  fn = mediaHandeler.get(message.event);
  fn((message.playTime));
  return new Promise(resolve =>{
    setTimeout(()=>{
      resolve();
    },1200);
  });
}

async function takeMediaAction(message){
  setPublishFlag(false);
  await mediaControl(message);
  setPublishFlag(true);
}

function handleMediaMessage(message){
  if(!isPlaying() || message.user == getUsername() || (!sync())){
    return;
  }
  putNotification(createMediaNotification(message) );
  takeMediaAction(message);  
}
function handleJoinMessage(message){
  broadCastExistance();
  refreshConnectFeed();
  if(message.user == getUsername()){
    return;
  }
  notification = "'" + message.user + "' joined the room";
  putNotification(notification);
}

function decodeExistanceMessage(message){
  array = message.event.split('$');
  videoName = array[0];
  subtitleName = array[1];
  screenMode = array[2];
  paused = false;
  if(array[3] =='pause'){
    paused = true;
  }
  return {videoName, subtitleName, screenMode, paused};
}
function handleExistMessage(message){
  if(message.event == 'null'){
    setUserVideoFileName(message.user, 'null');
    setUserSubtitleName(message.user, 'null');
    setUserScreenMode(message.user, 'null');
    return;
  }
  info = decodeExistanceMessage(message);
  setUserVideoFileName(message.user, info.videoName);
  setUserSubtitleName(message.user, info.subtitleName);
  setUserScreenMode(message.user, info.screenMode);
}

function handleReconnectMessage(message){
  return;
}
function disconnectThisUser(){
  setIntentonalDisconnect(true);
  setTimeout(function(){
    mqttClient.end();
  }, 200);
  error = "Username '" + getUsername() + "' already is in the room.\n Please join with another username"; 
  alertUser(error);
}
function iJoinedLate(message){
  thisConnectionTime = new Date(parseInt(getUniqueKey()));
  thatConnectiontime = new Date(parseInt(message.text));
  return thisConnectionTime > thatConnectiontime;
}
function handleConflict(message){
    if(iJoinedLate(message)){
        disconnectThisUser();
    }
}
function handleConflictMessage(){
  handleConflict(message);
}
function handleLeaveMessage(message){
  if(message.user == getUsername()){
    return;
  }
  notification = "'" + message.user + "' left the room";
  putNotification(notification);
  removeUser(message.user);
}

function handlePokeMessage(message){
  if(message.event !== getUsername()){
    return;
  }
  notification = "'" + message.user + "' poked you!";
  putNotification(notification);
  ringNotification();

}



function handleTextMessage(message){
  const box = document.getElementById('messageContainer');
  const container = document.createElement('div');
  container.classList.add('message-container');
  gap = document.createElement('div');
  gap.classList.add('gap-left');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  if(message.user == getUsername()){
    container.appendChild(gap);
    messageDiv.classList.add('me');
    // chatOnVideo.innerHTML += `<div class="message-on-video" class = "me">
    //                             <p><strong>${message.user}</strong> ${getTimeFromDateHMS(currentTime())}</p>
    //                             <p style="margin: 0 20px;">${message.text}</p>
    //                           </div>`
  }
  else{
    // chatOnVideo.innerHTML += `<div class="message-on-video">
    //                             <p><strong>${message.user}</strong> ${getTimeFromDateHMS(currentTime())}</p>
    //                             <p style="margin: 0 20px;">${message.text}</p>
    //                           </div>`
  }
  chatOnVideo.scrollTop = chatOnVideo.scrollHeight;
  if(isVideoPlayerFullScreen()){
    chatOnVideoContainer.classList.remove('hidden');
    chatOnVideoTimer = setTimeout(()=>{
      chatOnVideoContainer.classList.add('hidden');
    }, 5000);
  }
  
  const top = document.createElement('div');
  top.classList.add('top');
  
  const sender = document.createElement('span');
  sender.classList.add('sender');
  sender.textContent = message.user;
  top.appendChild(sender);

  const time = document.createElement('span');
  time.classList.add('time');
  time.textContent = getTimeFromDateHMS(currentTime());  
  top.appendChild(time);
  messageDiv.appendChild(top);

  const text = document.createElement('p');
  text.classList.add('text');
  text.textContent = message.text;
  messageDiv.appendChild(text);

  container.appendChild(messageDiv);
  box.appendChild(container);
  
  chatOnVideo.appendChild(container.cloneNode(true))

  box.scrollTop = box.scrollHeight;
  ringNotification();
  if(message.user == getUsername()){
    return;
  }
  // putNotificationOnVideo(`${message.user}: ${message.text}`);
}

function adjustPlayTimeAutomatic(message, paused){
  if((!isPlaying()) || (!sync())){
    return;
  }
  setPublishFlag(false);
  videoPlayer.currentTime = message.playTime;
  if(info.paused){
    videoPlayer.pause();
  }else{
    videoPlayer.play();
  }
  setTimeout(function(){
      setPublishFlag(true);
  },1200);
  putNotification(`Syncing with ${message.user}`);
}

let needToSync = false;

function requestForSync(){
  needToSync = true;
  const message = generateMessage('syncRequest', 'null', 'null');
  publishMessage(message);
}

function handleSyncRequest(message){
  if((!isPlaying() )|| (!sync()) || (message.user === getUsername())){
    return;
  }
  let media = 'play';
  if(videoPlayer.paused){
      media = "pause";
  }
  const response = `${mediaSource}$${getFileLink()}$${media}`;
  publishMessage(generateMessage('syncResponse', message.user, response));
}


const syncResponseHandeler = new Map();
syncResponseHandeler.set('src-local', (link)=>{
  if(!isPlaying()){
    return;
  }
});

syncResponseHandeler.set('src-drive', (link)=>{
  playFromDriveLink(link);
  src_option_clicked();
  selectSource('src-drive');
});

syncResponseHandeler.set('src-youtube', (link)=>{
  processyoutubeLink(link);
  src_option_clicked();
  selectSource('src-youtube');
});

function sleep(milliseconds){
  return new Promise(resolve =>{
    setTimeout(()=>{
      resolve();
    },milliseconds);
  });
}


async function handleSyncResponse(message){
  if((!sync()) || (message.event !== getUsername()) || (!needToSync)){
    return;
  }
  needToSync = false;  
  setPublishFlag(false);
  putNotification(`Syncing with ${message.user}`);

  const arr = message.text.split('$');
  if(arr[1] !== getFileLink()){  
    syncResponseHandeler.get(arr[0])(arr[1]);
  }

  await sleep(2000);
  if(isPlaying()){
    videoPlayer.pause();
    videoPlayer.currentTime = message.playTime;
    if(arr[2] === 'play'){
      await videoPlayer.play();
    } 
  }
  setTimeout(function(){
      setPublishFlag(true);
  },2000);
}

function putNotification(notification){
  putNotificationOnVideo(notification);
  putNotificationOnScreen(notification);
}

const sourceChange = new Map();
sourceChange.set('src-local', message=>{
  if(!isPlaying()){
    return;
  }
  putNotification(`${message.user} played new video from Computer`);
  videoPlayer.pause();
});
sourceChange.set('src-drive', message=>{
  src_option_clicked();
  selectSource(message.event);

  playFromDriveLink(message.text);
  putNotification(`${message.user} played new Drive video`);
});
sourceChange.set('src-youtube', message=>{
  src_option_clicked();
  selectSource(message.event);

  processyoutubeLink(message.text);
  putNotification(`${message.user} played new YouTube video`);
});

function handleChangeMessage(message){
  if(message.user === getUsername() || (!sync)){
    return;
  }
  
  setPublishFlag(false);
  sourceChange.get(message.event)(message);
  setTimeout(()=>{
    setPublishFlag(true)
  },2000);
}




function convertTextToWebVTT(text) {
  const trackId = 'subtitle-track-' + Date.now();
  const webVTTContent = `WEBVTT
  ${trackId}
  00:00:00.000 --> ${formatedTimeforSubtitle(videoPlayer.duration)}
  ${text}`;
  return new Blob([webVTTContent], { type: 'text/vtt' });
}
function formatedTimeforSubtitle(timeInSeconds) {
  const pad = num => `0${Math.floor(num)}`.slice(-2);
  const hours = timeInSeconds / 3600;
  const minutes = (timeInSeconds % 3600) / 60;
  const seconds = timeInSeconds % 60;
  const milliseconds = (timeInSeconds % 1).toFixed(3).slice(2, 5);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${milliseconds}`;
}

let addedTrack;
let subtitle_timeout_id = null;
const notificationOnVdo = document.querySelector('.notification-on-video');
// const controles = document.querySelector('.video-controls-container')
PreviouslyAddedSubtitle = '#$';
function putNotificationOnVideo(text) {
  if((!isPlaying()) || (!isVideoPlayerFullScreen())){
    console.log("ehfweui")
    return;
  }
  if (PreviouslyAddedSubtitle !== '#$') {
    clearTimeout(subtitle_timeout_id);
    text = PreviouslyAddedSubtitle + '<br>' + text;
  }
  PreviouslyAddedSubtitle = text;

  // if (addedTrack) {
  //   addedTrack.mode = 'disabled';
  // }

  // const trackBlob = convertTextToWebVTT(text);
  // const trackURL = URL.createObjectURL(trackBlob);

  // const newTrack = videoPlayer.addTextTrack('subtitles', 'Dynamic Subtitles', 'en');
  // newTrack.mode = 'showing';
  // const cue = new VTTCue(0, videoPlayer.duration, text);
  // newTrack.addCue(cue);
  notificationOnVdo.innerHTML = '';
  notificationOnVdo.classList.remove('hidden')
  controles.classList.remove("full-screen-control")
  notificationOnVdo.innerHTML = `<p>${text}</p>`;
  // addedTrack = newTrack;
  subtitle_timeout_id = setTimeout(function() {
    notificationOnVdo.innerHTML = '';
    controles.classList.add("full-screen-control")
    notificationOnVdo.classList.add('hidden')
    PreviouslyAddedSubtitle = '#$';
  }, 5000);
}
notificationOnVdo.addEventListener('mouseover',() =>{
  clearTimeout(subtitle_timeout_id);
})

notificationOnVdo.addEventListener('mouseout',() =>{
  subtitle_timeout_id = setTimeout(function() {
    notificationOnVdo.innerHTML = '';
    controles.classList.add("full-screen-control")
    notificationOnVdo.classList.add('hidden')
    PreviouslyAddedSubtitle = '#$';
  }, 1000);
})


PreviouslyAddedNotification = '#$';
let onscreenTimerId = null;
function putNotificationOnScreen(notification){
  if(isVideoPlayerFullScreen()){
    return;
  }
  clearInterval(onscreenTimerId);
  content = document.getElementById('notificationContent');
  content.innerHTML = '';
  if(PreviouslyAddedNotification !== '#$'){
    notification = PreviouslyAddedNotification +'\n' + notification;
  }else{
    showNotification();
  }
  PreviouslyAddedNotification = notification;
  div = document.createElement('div');
  line = notification.split('\n');
  for(i = 0; i < line.length; ++i){
    const p = document.createElement('p');
    p.textContent = line[i];
    div.appendChild(p);
  }
  content.appendChild(div);
  
  onscreenTimerId = setTimeout(function(){
    hideNotification();
    content.innerHTML = '';
    PreviouslyAddedNotification = '#$';
  },3000);
}

function hideNotification(){
   const div = document.getElementById('notificationpopup');
   clearInterval(onscreenTimerId);
   document.getElementById('notificationContent').innerHTML = '';
   PreviouslyAddedNotification = '#$';
   div.classList.add('hide');
  document.getElementById('notificationContent').innerHTML = '';
}

function showNotification(){
  const div = document.getElementById('notificationpopup');
  div.classList.remove('hide');

}

function poke(username){
  publishMessage(generateMessage('poke', username, 'null'));
}

function sendMessage(id){
  const text = document.getElementById(id);
  if(text.value == ''){
        return;
  }
  publishMessage(generateMessage('text', 'null', text.value));
  text.value = '';
}

function showAlert(){
  box = document.getElementById('alert-box');
  box.style.display = 'flex';
}

function hideAlert(){
  box = document.getElementById('alert-box');
  box.style.display = 'none';
  document.getElementById('alertContent').innerHTML = '';
}

function alertUser(message){
  div = document.getElementById('alertContent');
  div.innerHTML = '';
  messages = message.split('\n');
  for(i = 0;i < messages.length; ++i){
    const p = document.createElement('p');
    p.textContent = messages[i].toString();
    div.appendChild(p);
  }
  showAlert();
}

var notificationSound = document.getElementById("notification-sound");
function ringNotification(){
  notificationSound.play();
}

// const volumeRange = document.getElementById("connection-volume");
// volumeRange.addEventListener("input", function() {
//   const volumeValue = volumeRange.value;
//   notificationSound.volume = volumeValue;
// });

let notiIndx = 4;
const volumerange = [0, 0.25, 0.5, 0.75, 1.0];
const volumeIcons = [
    "<i class='fas fa-volume-mute'></i>",
    "<i class='fas fa-volume-off'></i>",
    "<i class='fas fa-volume-down'></i>",
    "<i class='fas fa-volume-down'></i>",
    "<i class='fas fa-volume-up'></i>"
  ]
function changeNotificationVolume(){
  notiIndx = (notiIndx + 1) % volumerange.length;
  document.getElementById('notificationVolumeButton').innerHTML = `${volumeIcons[notiIndx]} ${Math.floor(volumerange[notiIndx]*100)}%`;
  notificationSound.volume = volumerange[notiIndx];
}


function isVideoPlayerFullScreen() {
  const player = document.querySelector('.video-container')
  return (
    document.fullscreenElement === player ||
    document.webkitFullscreenElement === player ||
    document.mozFullScreenElement === player ||
    document.msFullscreenElement === player
  );
}

function toggleDropdown(id){
  div = document.getElementById(id);
  div.classList.toggle('hide-dropdown');
}

const dropdownToggle = document.getElementById('dropdown-toggle');
const dropdownMenu = document.getElementById('dropworn');
window.addEventListener('click', function (event) {
  if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.add('hide-dropdown');
  }
});

async function ChangeYoutubeQuality(quality){
  const currentTime = videoPlayer.currentTime;
  console.log(currentTime);
  setTimeout(()=>{},500);
  const temp = await new YouTubeToHtml5(
        {
            withAudio:true,
            formats:[quality]

        }
    );
    setTimeout(()=>{
      setPublishFlag(false);
        videoPlayer.load();
        videoPlayer.currentTime = currentTime;
        setTimeout(()=>{
          setPublishFlag(true);
        },1000);
    },2000);
}