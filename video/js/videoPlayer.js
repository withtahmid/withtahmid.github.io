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
    if(!isPlaying()){
        return;
    }
    videoPlayer.currentTime += skipValue;
}
function backward(){
    if(!isPlaying()){
        return;
    }
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
    container = document.getElementById('videoContainer');
    container.classList.remove('inactive');
    container.classList.add('active');
    document.getElementById('subtitleFileNameLabel').textContent = '';
    removeClass('subtitleFileNameLabel', 'src-local');
    removeClass('subtitleFileNameLabel', 'src-drive');
    removeClass('subtitleFileNameLabel', 'src-youtube');
});
chatInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    const text = event.target.value;
    if(text == ''){
        return;
    }
    event.target.value = '';
    publishMessage(generateMessage('text', 'null', text));
  }
});

function convertSrtToVtt(srtData) {
    var vttData = 'WEBVTT\n\n';
    var srtLines = srtData.trim().split('\n\n');
    
    for (var i = 0; i < srtLines.length; i++) {
        var srtLine = srtLines[i];
        var srtParts = srtLine.split('\n');
        
        if (srtParts.length >= 3) {
            var index = srtParts[0];
            var timeRange = srtParts[1].replace(/,/g, '.');
            var text = srtParts.slice(2).join('\n');
            
            vttData += index + '\n';
            vttData += timeRange + '\n';
            vttData += text + '\n\n';
        }
    }

    return vttData;
}

function showSubtitleName(filename){
    setSubtitleName(filename);
    filename = trimFileName(filename);
    addClass('subtitleFileNameLabel', getSelectedSource());
    label = document.getElementById('subtitleFileNameLabel');
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

function addUrlToTrack(subtitleURL){
    subtitlesTrack.src = subtitleURL;
    videoPlayer.textTracks[0].mode = 'showing';
    subtitleStatus(true);
    removeClass('showSubBtn', 'inactive');
    document.getElementById('showSubBtn').disabled = false;
}
subtitlesFileInput.addEventListener('change', function() {
    var subtitleFile = subtitlesFileInput.files[0];
    filename = subtitleFile.name;             
    var subtitleURL;
    var subtitleExtension = subtitleFile.name.split('.').pop().toLowerCase();
    if (subtitleExtension === 'vtt') {
        subtitleURL = URL.createObjectURL(subtitleFile);
        addUrlToTrack(subtitleURL);
        showSubtitleName(filename);
    } 
    else if (subtitleExtension === 'srt') {
        var reader = new FileReader();
        reader.onload = function(event) {
            var convertedSubtitles = convertSrtToVtt(event.target.result);
            var blob = new Blob([convertedSubtitles], { type: 'text/vtt' });
            subtitleURL = URL.createObjectURL(blob);
            addUrlToTrack(subtitleURL);
            showSubtitleName(filename);
        };
        reader.readAsText(subtitleFile);
    } 
    else {
        alert('Unsupported subtitle format. Please choose a VTT or SRT file.');
        return;
    }
});


function driveLinkInputClipboard(){
    navigator.clipboard.readText()
        .then(function(text) {
        // chatInput.value = text;
        playFromDriveLink(text);
    })
    .catch(function(error) {
        alertUser('Failed to read clipboard contents: ', error);
    });
}

async function tryDriveLink(link) {
  const fileID = link.match(/[-\w]{25,}/);
  if (!fileID) {
    alertUser('Invalid Google Drive link');
  }

  const metadataEndpoint = `https://www.googleapis.com/drive/v3/files/${fileID[0]}?fields=name&key=AIzaSyDUjyB82R7zwWccZtIkZUQsVPAI6g_u-4s`;

  try {
    const response = await fetch(metadataEndpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch file metadata');
    }

    const data = await response.json();
    const filename = data.name;
    const source = `https://drive.google.com/uc?export=download&id=${fileID[0]}`;
    document.getElementById('driveTextInputField').value = link;
    videoSource.src = source;
    videoPlayer.load();
    setPlaying(true);
    setVideoFineName(filename);
    videoFileChanged();
    container = document.getElementById('videoContainer');
    container.classList.remove('inactive');
    container.classList.add('active');
  } catch (error) {
    console.error('Error fetching file metadata:', error);
    alertUser('Error fetching file metadata');
  }
}

function playFromDriveLink(link){
    if(!tryDriveLink(link)){
        alertUser("Invalid Google Drive link\n"+ link);
    }

    // result  = getVideoSourceFromGoogleDriveLink(link);
    // if(!result){
    //     alertUser('Invalid Google Drive Link\n' + trimFileName(link));
    //     return;
    // }
    // document.getElementById('driveTextInputField').value = link;
    // videoSource.src = result;
    // videoPlayer.load();
    // setPlaying(true);
    // setVideoFineName(result);
    // videoFileChanged();
    // container = document.getElementById('videoContainer');
    // container.classList.remove('inactive');
    // container.classList.add('active');

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
    if((!sync())){
        return;
    }
    message = generateMessage('media', event);
    publishMessage(message);

}
function playFromDriveClick(){
    link = document.getElementById('driveTextInputField').value;
    playFromDriveLink(link);
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
