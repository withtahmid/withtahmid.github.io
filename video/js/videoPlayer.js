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
    videoPlayer.setAttribute('data-yt2html5', '');
    videoPlayer.removeAttribute('src');
    const file = videoFileInput.files[0];
    videoSource.src = URL.createObjectURL(file);
    videoPlayer.load();
    setVideoFineName(file.name);
    videoFileChanged();
    setFileLink('src-local')
    
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

function getClipboard(){
    navigator.clipboard.readText()
    .then(function(text) {
        return text.toString();
    })
    .catch(function(error) {
            return null;
        alertUser('Failed to read clipboard contents: ', error);
    });   
}

function driveLinkInputClipboard(){
    navigator.clipboard.readText()
        .then(function(text) {
        playFromDriveLink(text);
    })
    .catch(function(error) {
        alertUser('Failed to read clipboard contents: ', error);
    });
}

function isYoutubeLink(link){
   const regex = /^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|(?:(?:youtube-nocookie\.com\/|youtube\.com\/)(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/)))([a-zA-Z0-9\-_]*)/;
   return regex.test(link);
}

async function getYouTubeVideoTitle(link) {
    const videoId = link.match(/^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|(?:(?:youtube-nocookie\.com\/|youtube\.com\/)(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/)))([a-zA-Z0-9\-_]*)/)[1];
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyDUjyB82R7zwWccZtIkZUQsVPAI6g_u-4s`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.items[0].snippet.title;
    } 
    catch (error) {
        console.error("Error fetching video details:", error);
        return "Couldn't fetch video title";
    }
}

async function processyoutubeLink(link){
    if(!isYoutubeLink(link)){
        alertUser('Invalid YouTube Link!');
        return;
    }
    playYoutubeLink(link);
}

function youtubeLinkInputClipboard(){
     navigator.clipboard.readText()
        .then(function(text) {
            processyoutubeLink(text);
        })
        .catch(function(error) {
            alertUser('Failed to read clipboard contents: ', error);
        });
}

function playFromYoutubeClick(){
    const link = document.getElementById('youtubeTextInputField').value;
    processyoutubeLink(link);
}

async function playYoutubeLink(link){
    videoSource.setAttribute('src', '');
    videoPlayer.setAttribute('data-yt2html5', link);
    try{
        const temp = await Promise.all([getYouTubeVideoTitle(link), new YouTubeToHtml5()]);
        setVideoFineName(temp[0].toString());
        setFileLink(link);
        setTimeout(()=>{
            videoPlayer.load();
            videoFileChanged();
        },200);
    }
    catch(e){
        alertUser('Something went wront :(');
    }
    
}

async function tryDriveLink(link) {
  const fileID = link.match(/[-\w]{25,}/);
  if (!fileID) {
    alertUser("Invalid Google Drive link\n"+ link);
  }

  const metadataEndpoint = `https://www.googleapis.com/drive/v3/files/${fileID[0]}?fields=name&key=AIzaSyDUjyB82R7zwWccZtIkZUQsVPAI6g_u-4s`;

  try {
    const response = await fetch(metadataEndpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch file metadata');
    }

    videoPlayer.setAttribute('data-yt2html5', '');
    videoPlayer.removeAttribute('src');
    setFileLink(link);
    const data = await response.json();
    const filename = data.name;
    const source = `https://drive.google.com/uc?export=download&id=${fileID[0]}`;
    document.getElementById('driveTextInputField').value = link;
    videoSource.src = source;
    videoPlayer.load();
    setVideoFineName(filename);
    videoFileChanged();
  } catch (error) {
    console.error('Error fetching file metadata:', error);
    alertUser('Error fetching file metadata');
  }
}

function playFromDriveLink(link){
    tryDriveLink(link);
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
