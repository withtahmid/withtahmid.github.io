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
    if(roomName.length < 6 || roomName.length > 10 || roomName.includes(' ')){
      warning += "room name must be between 6 and 10 character without space\n";
    }
    if(warning !== ""){
      alert(warning);
      return false;
    }
    return true
}

function makeStatusBarFullWidth(){
  label = document.getElementById('connedtion-status');
  targetWidth = label.offsetWidth;
  label.style.width = '0';
  label.style.opacity = '1';
  width = 0;
  var intervalId = setInterval(function() {
      width += 5;
      label.style.width = width + 'px';
      if (width >= targetWidth) {
        label.style.width = targetWidth + 'px';
        clearInterval(intervalId);
      }
    }, 1);
}

function makeStatusBarZero(){
  label = document.getElementById('connedtion-status');
  width = label.offsetWidth;
  fullWidth = width;
  var intervalId = setInterval(function() {
      width -= 5;
      label.style.width = width + 'px';
      if (label.offsetWidth <= 5) {
        label.style.opacity = '0';
        label.style.width = fullWidth + 'px';
        clearInterval(intervalId);
      }
    }, 1);
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
  makeDivZero('usernameInputField');
  makeDivZero('roomnameInputField');
  makeDivZero('connectButton');
  makeDivZero('connectionInputField');
  
  removeClass('connectionSettings', 'inactive');
  addClass('connectionSettings', 'active');

  removeClass('connectedPeopleList', 'inactive');
  addClass('connectedPeopleList', 'active');

  removeClass('message-box', 'inactive');
  addClass('message-box', 'active');

  addClass('connectionInputField', 'inactive');

  ButtonInputOff('connectionSettings', false);
  ButtonInputOff('message-box', false);

  document.getElementById('connection-roomname').innerHTML = '<i class="fas fa-globe rotate-globe"></i> ' + getUsername();
  document.getElementById('connection-sync').innerHTML = getRoomName()+" <i class='sync-icon fas fa-sync-alt'></i>";
  firstHappened();
  existanceBroadcastIntervalId = setInterval(broadCastExistance, 5000);
  refreshConnectedPeopleIntervalId = setInterval(refreshConnectFeed, 5000);
}

function resetAllConnection(){
  resetFirst();
  ButtonInputOff('connectionSettings', true);
  ButtonInputOff('message-box', true);
  removeClass('connection-roomname', 'roomDisconnect');
  removeClass('connection-roomname', 'roomConnect');
  removeClass('connection-sync', 'noSync');
  removeClass('connection-sync', 'sync');
  
  removeClass('connectionInputField', 'inactive');
  addClass('connectionInputField', 'active');
  
  removeClass('connectionSettings', 'active');
  addClass('connectionSettings', 'inactive');

  addClass('connectedPeopleList', 'inactive');
  removeClass('connectedPeopleList', 'active');

  addClass('message-box', 'inactive');
  removeClass('message-box', 'active');
  
  makeDivFullHeight('connectionInputField');
  document.getElementById('connection-roomname').innerHTML = '<i class="fas fa-globe rotate-globe"></i> Username';
  document.getElementById('peopleRefreshList').innerHTML = '';
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
    document.getElementById('peopleRefreshList').innerHTML = '';
  }
  else{
    addClass('connection-sync', 'sync');
    removeClass('connection-sync', 'noSync');
    setSync(true);
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
  if((!isConnected()) || (!sync()) || (!getPublishFlag())){
    return;
  }
  mqttClient.publish(getTopic(), payload);
  // setTimeout(function(){}, 100);
} 

function broadCastExistance(){
  message = generateMessage('exist', 'null', 'null');
  publishMessage(message);
}

function createPeopleForList(username, now){
  people = document.createElement('div');
  people.setAttribute('id', 'prople-username');
  people.setAttribute('class', 'eachPeople');
  timeAgo = userLastResponseTime(username, now);
  timeMessage = '';
 
  if(timeAgo > 60){
    removeUser(username);
    timeMessage = 'Disconnected';
    people.classList.add('disconnected');
  }
  else if(timeAgo > 20){
    timeMessage = 'Disconnected';
    people.classList.add('disconnected');
  }
  else if(timeAgo > 5){
    timeMessage = 'Few seconds ago';
    people.classList.add('late');
  }
  else{
    timeMessage = 'Just Now';
    people.classList.add('active')
  }
  people.innerHTML = "<span>" + username + "</span><span>" + timeMessage + "</span><span><button onclick='poke(\"" + username + "\")'><i class='fas fa-hand-point-right'></i></button></span>";
  if(username == getUsername()){
    people.classList.remove('disconnected');
    people.classList.remove('late');
    people.classList.remove('active');
    people.classList.add('thisUser');
     people.innerHTML = "<span>" + username + "</span><span>" + timeMessage + "</span><span><button><i class='fas fa-user-circle'></i></button></span>";
  }
 
  return people;
}

function refreshConnectFeed(){
  peoples = [];
  const now = currentTime();
  for (const [username, lastResponseTime] of getPeopleList()) {
    peoples.push(createPeopleForList(username, now));
  }
  peopleList = document.getElementById('peopleRefreshList');
  peopleList.innerHTML = '';
  peoples.forEach(function(child){
    peopleList.appendChild(child);
  });
}



// let button1, width1, targetWidth1, intervalId1;
// let button2, width2, targetWidth2, intervalId2;
// let button3, width3, targetWidth3, intervalId3;

// let button1_arr = [button1, width1, targetWidth1, intervalId1];
// let button2_arr = [button2, width2, targetWidth2, intervalId2];
// let button3_arr = [button3, width3, targetWidth3, intervalId3];

// button_map = new Map();

// button_map.set('src-local', button1_arr);
// button_map.set('src-drive', button2_arr); 
// button_map.set('src-youtube', button3_arr); 

function src_loacl_unsqueeze(){ 
  button_local = document.getElementById('src-local');
  button_local.disabled = false;
  targetWidth_local = getWidthById('src-local');
  button_local.style.width = '25px';
  button_local.classList.remove('hidden');
  width_local = 25;
  intervalId_local = setInterval(function() {
    width_local += 1;
    button_local.style.width = width_local + 'px';
    if (width_local >= targetWidth_local) {
      button_local.style.width = targetWidth_local + 'px';
      clearInterval(intervalId_local);
    }
  }, 1);
 
}

function src_drive_unsqueeze(){
  button_drive = document.getElementById('src-drive');
  button_drive.disabled = false;
  targetWidth_drive = getWidthById('src-drive');
  button_drive.classList.remove('hidden');
  width_drive = 25;
  intervalId_drive = setInterval(function() {
    width_drive += 1;
    button_drive.style.width = width_drive + 'px';
    if (width_drive >= targetWidth_drive) {
      button_drive.style.width = targetWidth_drive + 'px';
      clearInterval(intervalId_drive);
    }
  }, 1);
  
}

function src_youtube_unsqueeze(){
  button_youtube = document.getElementById('src-youtube');
  button_youtube.disabled = false;
  targetWidth_youtube = getWidthById('src-youtube');
  button_youtube.style.width = '25px';
  button_youtube.classList.remove('hidden');
  width_youtube = 25;
  intervalId_youtube = setInterval(function() {
    width_youtube += 1;
    button_youtube.style.width = width_youtube + 'px';
    if (width_youtube >= targetWidth_youtube) {
      button_youtube.style.width = targetWidth_youtube + 'px';
      clearInterval(intervalId_youtube);
    }
  }, 1);
  
}

function src_local_squeeze(){
  button_local_sq = document.getElementById('src-local');
  button_local_sq.disabled = true;
  targetWidth_local_sq = getWidthById('src-local');
  width_local_sq = targetWidth_local_sq;
  intervalId_local_sq = setInterval(function() {
    width_local_sq -= 1;
    button_local_sq.style.width = width_local_sq + 'px';
    if (width_local_sq <= 25) {
      button_local_sq.classList.add('hidden');
      clearInterval(intervalId_local_sq);
    }
  }, 1);
}
function src_drive_squeeze(){
  button_drive_sq = document.getElementById('src-drive');
  button_drive_sq.disabled = true;
  targetWidth_drive_sq = getWidthById('src-drive');
  width_drive_sq = targetWidth_drive_sq;
  intervalId_drive_sq = setInterval(function() {
    width_drive_sq -= 1;
    button_drive_sq.style.width = width_drive_sq + 'px';
    if (width_drive_sq <= 25) {
      button_drive_sq.classList.add('hidden');
      clearInterval(intervalId_drive_sq);
    }
  }, 1);
}
function src_youtube_squeeze(){
  button_youtube_sq = document.getElementById('src-youtube');
  button_youtube_sq.disabled = true;
  targetWidth_youtube_sq = getWidthById('src-youtube');
  width_youtube_sq = targetWidth_youtube_sq;
  intervalId_youtube_sq = setInterval(function() {
    width_youtube_sq -= 1;
    button_youtube_sq.style.width = width_youtube_sq + 'px';
    if (width_youtube_sq <= 25) {
      button_youtube_sq.classList.add('hidden');
      clearInterval(intervalId_youtube_sq);
    }
  }, 1);
}


function squeezeEffect(){
  if(getSelectedSource() !== 'src-local'){
     src_local_squeeze();
  }
  if(getSelectedSource() !== 'src-drive'){
     src_drive_squeeze();
  }
   if(getSelectedSource() !== 'src-youtube'){
     src_youtube_squeeze();
  }
  src_sqeezed(true);
}

function unSqueezeEffect(){
  if(getSelectedSource() !== 'src-local'){
     src_loacl_unsqueeze();
  }
  if(getSelectedSource() !== 'src-drive'){
     src_drive_unsqueeze();
  }
   if(getSelectedSource() !== 'src-youtube'){
     src_youtube_unsqueeze();
  }
  // document.getElementById('source-options').style.opacity = '1';
  src_sqeezed(false);
}

function src_option_clicked(){
  if(src_option_is_squeezed()){
    unSqueezeEffect();
  }
  else{
    squeezeEffect();
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
  }
  if(source !== 'src-drive'){
    removeSubtileTheme('src-drive');
    removeClass('videoFileNameLabel', 'src-drive');
  }
  if(source !== 'src-youtube'){
    removeSubtileTheme('src-youtube');
    removeClass('videoFileNameLabel', 'src-youtube');
  }

  addClass('videoFileNameLabel', source);
  addSubtlieTheme(source);
}

function selectSource(source){
  const previousButton = document.getElementById(getSelectedSource());
  previousButton.classList.remove('hidden');
  previousButton
  const sourceButton = document.getElementById(source);
  const destinationButton = document.getElementById('src-option-button');
  selectedSource(source);
  destinationButton.innerHTML = sourceButton.innerHTML;
  destinationButton.className = sourceButton.className;
  destinationButton.classList.add('playing');
  sourceButton.classList.add('hidden');  
  squeezeEffect();
  src_sqeezed(true);
  fn = source_select_functions.get(source);
  fn();
}

function showFileName(){
  filename = trimFileName(videoFileName());
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
  document.getElementById('subtitlesTrack').src = '';
  ButtonInputOff('subtitleBox', false);
  removeClass('subtitleBox','inactive');
  // addClass('subtitleBox', 'active');
  addClass('showSubBtn', 'inactive');
  subtitleStatus(false);
  matchSubtitleTosrcTheme();
  showFileName();
}


function getVideoSourceFromGoogleDriveLink(link) {
  const fileID = link.match(/[-\w]{25,}/);
  if (!fileID) {
    console.error('Invalid Google Drive link');
    return null;
  }

  return `https://drive.google.com/uc?export=download&id=${fileID[0]}`;
}

async function getFilenameFromGoogleDriveLink(link) {
  const fileID = link.match(/[-\w]{25,}/); // Extract the file ID from the link
  if (!fileID) {
    console.error('Invalid Google Drive link');
    return null;
  }

  const metadataEndpoint = `https://www.googleapis.com/drive/v3/files/${fileID[0]}?fields=name&key=YOUR_API_KEY`;

  try {
    const response = await fetch(metadataEndpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch file metadata');
    }

    const data = await response.json();
    const filename = data.name;
    return filename;
  } catch (error) {
    console.error('Error fetching file metadata:', error);
    return null;
  }
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
      const className = (cue.startTime <= currentTime && cue.endTime >= currentTime) ? 'currentSubtitle' : '';
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
  if(name.length > 50){
    name = name.slice(0,49) + '...';
  }
  return name;
}

function hidepopup(){
  const div = document.getElementById('popupdiv');
  height = div.offsetHeight;
  storeHeightbyId('popupdiv', height);
  target =  height;
  var intervalId = setInterval(function() {
      height -= 10;
      div.style.height = height + 'px';
      if (height <= 0) {
        div.classList.add('hiddenpopup');
        clearInterval(intervalId);
      }
    }, 1);

  subtitleVisible(false);
  notificationShowMode(false);
  document.getElementById('popupcontentDiv').innerHTML = '';
  addClass('subtitleTolRange', 'hidden');
}
function showpopup(){
  const div = document.getElementById('popupdiv');
  target = getHeightById('popupdiv');
  height = 0;
  div.style.height = '0px';
  document.getElementById('popupdiv').classList.remove('hiddenpopup');
  var intervalId = setInterval(function() {
      height += 10;
      div.style.height = height + 'px';
      if (height >= target) {
        clearInterval(intervalId);
      }
    }, 1);
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

  return hours + ':' + minutes + ':' + seconds + ' ' + amPm;
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
  cell.textContent = 'Username';
  headingRow.appendChild(cell);

  cell = document.createElement('th');
  cell.textContent = 'Activity Type';
  headingRow.appendChild(cell);

  cell = document.createElement('th');
  cell.textContent = 'Media Event';
  headingRow.appendChild(cell);

  cell = document.createElement('th');
  cell.textContent = 'Playback';
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
    notification += 'ed';
  }
  notification += ' at ' + formatDuration(message.playTime) + '.';
  return notification;
}

function handleMediaMessage(message){
  if(!isPlaying() || message.user == getUsername()){
    return;
  }
  setPublishFlag(false);
  fn = mediaHandeler.get(message.event);
  notification = createMediaNotification(message)  
  putNotification(notification);
  fn((message.playTime));
  setTimeout(function(){
      setPublishFlag(true);
  },500);
}
function handleJoinMessage(message){
  refreshConnectFeed();
  if(message.user == getUsername()){
    return;
  }
  notification = "'" + message.user + "' joined the room";
  putNotification(notification);
}
function handleExistMessage(message){

  
}
function handleLeaveMessage(message){
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
  box.scrollTop = box.scrollHeight;
  ringNotification();
  if(message.user == getUsername()){
    return;
  }
  notification = "'" +message.user + ":' " + trimFileName(message.text);
  putNotification(notification)
}

function putNotification(notification){
  console.log(notification);
  putNotificationOnVideo(notification);
  putNotificationOnScreen(notification);
}

let addedTrack;
let subtitle_timeout_id = null;
PreviouslyAddedSubtitle = '';
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
function putNotificationOnVideo(text) {
  if(!isPlaying()){
    return;
  }
  if (subtitle_timeout_id) {
    clearTimeout(subtitle_timeout_id);
    text = PreviouslyAddedSubtitle + '\n' + text;
  }
  PreviouslyAddedSubtitle = text;

  if (addedTrack) {
    addedTrack.mode = 'disabled';
  }

  const trackBlob = convertTextToWebVTT(text);
  const trackURL = URL.createObjectURL(trackBlob);

  const newTrack = videoPlayer.addTextTrack('subtitles', 'Dynamic Subtitles', 'en');
  newTrack.mode = 'showing';
  const cue = new VTTCue(0, videoPlayer.duration, text);
  newTrack.addCue(cue);

  addedTrack = newTrack;
  subtitle_timeout_id = setTimeout(function() {
    newTrack.mode = 'disabled';
    URL.revokeObjectURL(trackURL);
    PreviouslyAddedSubtitle = '';
  }, 3000);
}

PreviouslyAddedNotification = '#$';
let onscreenTimerId = null;
function putNotificationOnScreen(notification){
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
  // height = div.offsetHeight;
  // // storeHeightbyId('notificationpopup', height);
  // target =  height;
  // var intervalId = setInterval(function() {
  //     height -= 3;
  //     div.style.height = height + 'px';
  //     if (height <= 0) {
  //       div.classList.add('hide');
  //       clearInterval(intervalId);
  //     }
  //   }, 1);
   div.classList.add('hide');
  document.getElementById('notificationContent').innerHTML = '';
}

hideNotification();
function showNotification(){
  const div = document.getElementById('notificationpopup');
  
  div.classList.remove('hide');
  // target = getHeightById('notificationpopup');
  // height = 0;
  // div.style.height = '0px';
  // div.classList.remove('hide');
  // var intervalId = setInterval(function() {
  //     height += 3;
  //     div.style.height = height + 'px';
  //     if (height >= target) {
  //       div.style.height = target + 'px';
  //       clearInterval(intervalId);
  //     }
  //   }, 1);
}

function poke(username){
  // console.log('poke', username);
  publishMessage(generateMessage('poke', username, 'null'));
}

function sendMessage(){
  const text = document.getElementById('chatInput').value;
  publishMessage(generateMessage('text', 'null', text));
}

var notificationSound = document.getElementById("notification-sound");
function ringNotification(){
  notificationSound.play();
}

const volumeRange = document.getElementById("connection-volume");
volumeRange.addEventListener("input", function() {
  const volumeValue = volumeRange.value;
  notificationSound.volume = volumeValue;
});