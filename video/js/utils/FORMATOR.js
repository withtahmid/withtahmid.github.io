const FORMATOR = {
    formatDuration: function(duration){
        var hours = Math.floor(duration / 3600);
        var minutes = Math.floor((duration % 3600) / 60);
        var seconds = duration % 60;
        var hoursStr = hours.toString().padStart(2, "0");
        var minutesStr = minutes.toString().padStart(2, "0");
        var secondsStr = seconds.toString().padStart(2, "0");
        return `${hoursStr}:${minutesStr}:${parseInt(secondsStr)}`;
    }
}