const videoPlayer = document.getElementById('videoPlayer');
const subtitlesTrack = document.getElementById('subtitlesTrack');
const subtitlesFileInput = document.getElementById('subtitleFileInput');
const videoSource = document.getElementById('videoSource');

const videoFileInput = document.getElementById('videoFileInput');
const chatInput = document.getElementById('chatInput');

const popupContent = document.getElementById('popupcontentDiv');
const skipValueInput = document.getElementById('skipValue');

const subTolRangeInput = document.getElementById('subtitleTolRange');

skipValue = 5;

function handleSkipValueChange(){
    val = document.getElementById('skipValue').value;
    document.getElementById('backward-btn-txt').textContent = ' '+val+'s';
    document.getElementById('forward-btn-txt').textContent = ' '+val+'s ';
    skipValue = Number(val);
}

function forward(){
    videoPlayer.currentTime += skipValue;
}
function backward(){
    videoPlayer.currentTime -= skipValue;
}
skipValueInput.addEventListener('change', handleSkipValueChange);

videoFileInput.addEventListener('change', function() {
    const file = videoFileInput.files[0];
    videoSource.src = URL.createObjectURL(file);
    videoPlayer.load();
    setPlaying(true);
    setVideoFineName(file.name);
    videoFileChanged();
});
chatInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    const text = event.target.value;
     event.target.value = '';
    publishMessage(generateMessage('text', 'null', text));
  }
});

subtitlesFileInput.addEventListener('change', function() {
    const file = subtitlesFileInput.files[0];
    subtitlesTrack.src = URL.createObjectURL(file);
    videoPlayer.textTracks[0].mode = 'showing';
    subtitleStatus(true);
    removeClass('showSubBtn', 'inactive');
});

function chatInputClipboard(){
    navigator.clipboard.readText()
        .then(function(text) {
        // chatInput.value = text;
        playFromDriveLink(text);
    })
    .catch(function(error) {
        alert('Failed to read clipboard contents: ', error);
    });
}

function playFromDriveLink(link){
    result  = getVideoSourceFromGoogleDriveLink(link);
    if(!result){
        alert('Invalid Google Drive Link');
        return;
    }
    videoSource.src = result;
    videoPlayer.load();
    setPlaying(true);
    setVideoFineName(result);
    videoFileChanged();
}

subTolRangeInput.addEventListener("input", function() {
    setSubtitleTol(parseInt(subTolRangeInput.value));
});
uniqueKey = 'withtahmid';
function generateMessage(type, event ='null', text = 'null'){
    playTime = 0;
    if(isPlaying()){
        playTime = videoPlayer.currentTime;
    }
    const message = uniqueKey + separator + type+ separator + getUsername() +  separator + event + separator + playTime + separator + text;
    return message;
}

function decodeMessage(message){
    array = message.split(separator);
    if(array[0] !== uniqueKey || array.length < 5){
        return null;
    }
    type = array[1];
    user = array[2];
    event = array[3];
    playTime = Number(array[4]);
    text = array[5];
    return {type, user, event, playTime, text};
}

function handleMediaEvent(event){
    message = generateMessage('media', event);
    publishMessage(message);

}

videoPlayer.addEventListener('play', function(){
    handleMediaEvent('play')
});
videoPlayer.addEventListener('pause',function(){
    handleMediaEvent('pause')
});
videoPlayer.addEventListener('seeked',  function(){
    handleMediaEvent('seeked')
});