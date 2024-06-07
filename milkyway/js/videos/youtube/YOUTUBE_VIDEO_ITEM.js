class YOUTUBE_VIDEO_ITEM{
    constructor(videoId, addedBy, title, thumbnail, channelTitle){
        this.videoId = videoId;
        this.addedBy = addedBy;
        this.title = title;
        this.channelTitle = channelTitle;
        this.thumbnail = thumbnail;
        this.__id__ = `${videoId}${Date.now()}${Math.floor(Math.random() * 1000)}`; 
    }
}