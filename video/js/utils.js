TIME = {
    now: function(){
        return new Date();
    },

    format12h: function(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        if (hours > 12) {
          hours -= 12;
        } else if (hours === 0) {
          hours = 12;
        }
        return hours + ':' + minutes;
      }
}
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
  document.querySelector('.error-box-container').classList.remove('hidden');
}

const keepInSyncBtn = document.getElementById('sync-checkbox-input');
keepInSyncBtn.addEventListener('change', ()=>{
  ROOM.toggleSync(keepInSyncBtn.checked);
})

const chatOnVideoBtn = document.getElementById('chat-on-viddeo-checkbox-input');
chatOnVideoBtn.addEventListener('change', ()=>{
  VIDEO.toggleChatOnVideoPermission(chatOnVideoBtn.checked);
})



window.onload = async function() {
  const username = localStorage.getItem('username');
  const roomId = localStorage.getItem('roomId');
  const autoJoin = localStorage.getItem('autoJoin');
  const notificationVolumne = localStorage.getItem('notificationVolume');
  if(username && roomId && autoJoin == 'true'){
    document.getElementById('username-input').value = username;
    document.getElementById('roomid-input').value = roomId;
    ROOM.join(username, roomId, autoJoin);
    // if(Number(notificationVolumne) >= 0){
    //   ROOM.volumeIndxSet(Number(notificationVolumne));
    // }
  }
};


