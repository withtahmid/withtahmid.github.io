
// const notificationSoundInput = document.getElementById('notification-volume-input');
// notificationSoundInput.addEventListener('change', ()=>{
//   document.getElementById('notification-sound').volume = notificationSoundInput.value;
//   ROOM.ringNotification();
// })

function formatDuration(duration) {
  var hours = Math.floor(duration / 3600);
  var minutes = Math.floor((duration % 3600) / 60);
  var seconds = duration % 60;
  var hoursStr = hours.toString().padStart(2, "0");
  var minutesStr = minutes.toString().padStart(2, "0");
  var secondsStr = seconds.toString().padStart(2, "0");
  return `${hoursStr}:${minutesStr}:${parseInt(secondsStr)}`;
}


function displayErrorOnScreen(text = 'Someting went wrong!', heading = 'Ooops!'){

  document.getElementById('screen-error-text').textContent = text;
  document.getElementById('screen-error-heading').textContent = heading;
  document.getElementById('error-box-container').classList.remove('hidden');
}

function displayAnnouncement(text = 'Someting went wrong!', heading = 'Ooops!'){

  document.getElementById('screen-announcement-text').innerHTML = text;
  document.getElementById('screen-announcement-heading').innerHTML = heading;
  document.getElementById('announcement-box-container').classList.remove('hidden');
}

// displayAnnouncement('Milkyway now supports YouTube. <br><br> NOTE: this feature is half baked and is not as smoth as playing videos from device, and will evolve over time.', 'Woo-Hoo!!');



function noReady(){
  displayErrorOnScreen('this feature not ready yet.', 'On No :(')
}


// window.onload = async function() {
//   const username = localStorage.getItem('username');
//   const roomId = localStorage.getItem('roomId');
//   const autoJoin = localStorage.getItem('autoJoin');
//   const notificationVolumne = localStorage.getItem('notificationVolume');
//   if(username && roomId && autoJoin == 'true'){
//     document.getElementById('username-input').value = username;
//     document.getElementById('roomid-input').value = roomId;
//     ROOM.join(username, roomId, autoJoin);
//   }
//   if(Number(notificationVolumne) >= 0){
//     ROOM.volumeIndxSet(Number(notificationVolumne));
//   }
// };
//<i class="fa-solid fa-store-slash"></i>
// <i class="fa-solid fa-shop"></i>
// <i class="fa-solid fa-shop-slash"></i>

function convertToVTT() {
  var srtFile = document.getElementById('caption-convert-file-input').files[0];
  var reader = new FileReader();

  reader.onload = function(e) {
      var srtContent = e.target.result;
      var timeOffset = parseFloat(document.getElementById('caption-convert-offset-input').value) || 0;

      var vttContent = "WEBVTT\n\n" + adjustTimeOffset(srtContent, timeOffset);

      var vttBlob = new Blob([vttContent], { type: "text/vtt" });
      var vttURL = URL.createObjectURL(vttBlob);

      var a = document.createElement("a");
      a.href = vttURL;
      a.download = srtFile.name.replace('.srt', '.vtt');
      a.click();
  };

  reader.readAsText(srtFile);
}

function adjustTimeOffset(srtContent, offset) {
  var lines = srtContent.trim().split(/\r?\n/);
  var vttLines = [];

  for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      if (line.match(/^\d+$/)) {
          vttLines.push(line);
      } else if (line.match(/^\d+:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/)) {
          var times = line.split(" --> ");
          var startTime = adjustTimestamp(times[0], offset);
          var endTime = adjustTimestamp(times[1], offset);
          vttLines.push(startTime + " --> " + endTime);
      } else {
          vttLines.push(line);
      }
  }

  return vttLines.join("\n");
}

function adjustTimestamp(timestamp, offset) {
  var parts = timestamp.split(/[,.:]/);
  var hours = parseInt(parts[0], 10);
  var minutes = parseInt(parts[1], 10);
  var seconds = parseInt(parts[2], 10);
  var milliseconds = parseInt(parts[3], 10);
  var fraction = parts[4] || "000";

  var totalSeconds = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  var newTotalSeconds = totalSeconds + offset;
  if (newTotalSeconds < 0) newTotalSeconds = 0;

  var newHours = Math.floor(newTotalSeconds / 3600);
  var newMinutes = Math.floor((newTotalSeconds - newHours * 3600) / 60);
  var newSeconds = Math.floor(newTotalSeconds % 60);
  var newMilliseconds = Math.round((newTotalSeconds % 1) * 1000);

  return padDigits(newHours, 2) + ":" + padDigits(newMinutes, 2) + ":" + padDigits(newSeconds, 2) + "." + padDigits(newMilliseconds, 3);
}

function padDigits(number, digits) {
  return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

function userOnThisTab(){
  return (document.visibilityState === 'visible');
}

document.addEventListener("visibilitychange", function() {
  // ROOM.sendMessage(MESSAGE.existing());
});

function extractYoutubeIdFromURL(url){
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function validRoomInfo(username, roomId){
  const regex = /^[A-Za-z]+$/;
  if(regex.test(username) && 
  regex.test(roomId) &&
  3 <= username.length && username.length <= 10 &&
  5 <= roomId.length && roomId.length <= 10
  ){
      return true;
  }
  return false;
}