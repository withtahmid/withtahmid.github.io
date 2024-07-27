const FORMATOR = {
    formatDuration: function(duration){
        var hours = Math.floor(duration / 3600);
        var minutes = Math.floor((duration % 3600) / 60);
        var seconds = duration % 60;
        var hoursStr = hours.toString().padStart(2, "0");
        var minutesStr = minutes.toString().padStart(2, "0");
        var secondsStr = seconds.toString().padStart(2, "0");
        return `${hoursStr}:${minutesStr}:${parseInt(secondsStr)}`;
    },

    secondToHMS: function(seconds) {

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const hoursString = String(hours).padStart(2, '0');
        const minutesString = String(minutes).padStart(2, '0');
        const secondsString = String(secs).padStart(2, '0');

        if (hours === 0 && minutes === 0) {
            return `${secondsString}S`;
        } else if (hours === 0) {
            return `${minutesString}M:${secondsString}S`;
        } else {
            return `${hoursString}H:${minutesString}M:${secondsString}S`;
        }
    },
    secondToMS: function(seconds){
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const minutesString = String(minutes).padStart(2, '0');
        const secondsString = String(secs).padStart(2, '0');
        return `${minutesString} m ${secondsString} s`;
    }
}