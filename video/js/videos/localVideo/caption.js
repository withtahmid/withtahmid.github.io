const subtitlesFileInput = document.getElementById('subtitle-file-input');
subtitlesFileInput.addEventListener('change', function() {
    if(!VIDEO.__isActive__()){
        // displayErrorOnScreen("Subtitle cannot be selected before video", "Oh no!")
        return;
    }
    var subtitleFile = subtitlesFileInput.files[0];
    filename = subtitleFile.name;
    // var subtitleURL;
    var subtitleExtension = subtitleFile.name.split('.').pop().toLowerCase();
    if (subtitleExtension === 'vtt') {
        VIDEO.__addCaption__(subtitleFile)

    } 
    else if (subtitleExtension === 'srt') {
        // var reader = new FileReader();
        // reader.onload = function(event) {
        //     var convertedSubtitles = convertSrtToVtt(event.target.result);
        //     var blob = new Blob([convertedSubtitles], { type: 'text/vtt' });
        //     subtitleURL = URL.createObjectURL(blob);
        //     addUrlToTrack(subtitleURL);
        //     showSubtitleName(filename);
        // };
        // reader.readAsText(subtitleFile);
        displayErrorOnScreen("This application only supports .vtt subtitles. But you can convert your .srt file to .vtt in the Subtitle tab", "Offo!");
        return;
    } 
    else {
        displayErrorOnScreen("Unsupported file format for captions.", "Ooopps!");
        return;
    }
    // videoContainer.classList.toggle("captions", VIDEO.__isCaptioning__())
});
