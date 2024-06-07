// function onYTPlayerError(){
//     displayErrorOnScreen('Youtube caused an error', "YouTube :')")
// }
// function onYTPlayerReady(){
//     const ytSync = VIDEO.ytSync;
//     if(ytSync.active){
//         ytSync.paused ? VIDEO.pause(ytSync.time) : VIDEO.play(ytSync.time);
//         VIDEO.ytSync = {
//             active: false,
//             time: 0,
//             paused: true,
//         };
//         return;
//     }
//     if(VIDEO.ignoreNewVideoEvent){
//         VIDEO.ignoreNewVideoEvent = false;
//         return;
//     }
//     ROOM.sendMessage(MESSAGE.newVideo(VIDEO.ytPlayer.getVideoUrl()));
// }
// function onYTPlayerStateChange(event){
//     const state = event.data;
//     if(state === 1){
//         VIDEO.playEvent();
//     }else if(state === 2){
//         VIDEO.pauseEvent();
//     }
// }

// const YOUTUBE = {
//     url: null,
//     currecntVideoId: null,
//     player: null,
//     ERROR_CODE: 200,

//     __init__: function(){

//       try {
//             this.player = new YT.Player('yt-video-player', {
//                 height: document.querySelector('.yt-player-container').offsetHeight.toString(),
//                 width: document.querySelector('.yt-player-container').offsetWidth.toString(),
//                 playerVars: {
//                     'playsinline': 1
//                 },
//                 events: {
//                     'onReady': onYTPlayerReady,
//                     'onStateChange': onYTPlayerStateChange,
//                     'onError': onYTPlayerError,
//                 }
//             });
//       } catch (error) {
//         console.error(error);
//       }
//     },

//     destroy: function(){
//         try{
//             this.player.destroy();
//             this.player = null;
//         }catch( error ){
//             console.error( error );
//         }
//     },

//     cueVideoById: function(videoId, startSeconds = 0){
//         if(this.player === null){
//             this.__init__();
//         }
//         try {
//             this.player.cueVideoById({
//                 videoId: videoId,
//                 startSeconds: startSeconds
//             });
//         } catch (error) {
//             console.error(error)
//         }
//     },
//     cueVideoByUrl: function(mediaContentUrl, startSeconds = 0){
//         if(this.player === null){
//             this.__init__();
//         }
//         try {
//             this.player.cueVideoByUrl({
//                 mediaContentUrl: mediaContentUrl,
//                 startSeconds: startSeconds
//             });
//         } catch (error) {
//             console.error(error)
//         }
//     },
//     loadVideoById(videoId, startSeconds = 0){
//         if(this.player === null){
//             this.__init__();
//         }
//         try {
//             this.player.loadVideoById({
//                 videoId: videoId,
//                 startSeconds: startSeconds
//             });
//         } catch (error) {
//             console.error(error)
//         }
//     },
//     loadVideoByUrl(mediaContentUrl, startSeconds = 0){
//         if(this.player === null){
//             this.__init__();
//         }
//         try {
//             this.player.loadVideoByUrl({
//                 mediaContentUrl: mediaContentUrl,
//                 startSeconds: startSeconds
//             });
//         } catch (error) {
//             console.error(error)
//         }
//     },

//     playVideo: function(seconds){
//         try{
//             this.player.seekTo(seconds);
//             this.player.playVideo();
//         }catch( error ){
//             console.error( error );
//         }
//     },

//     pauseVideo: function(seconds){
//         try{
//             this.player.pauseVideo();
//             this.player.seekTo(seconds);
//         }catch( error ){
//             console.error( error );
//         }
//     },
//     stopVideo: function(){
//         try{
//             return this.player.stopVideo();
//         }catch( error ){
//             console.error( error );
//         }
//     },
//     seekTo: function(seconds, allowSeekAhead = false){
//         try{
//             this.player.seekTo(seconds, allowSeekAhead);
//         }catch( error ){
//             console.error( error );
//         }
//     },
//     getCurrentTime: function(){
//         try{
//             return this.player.getCurrentTime();
//         }catch( error ){
//             console.error( error );
//         }
//         return this.ERROR_CODE;
//     },
//     getPlayerState: function(){
//         try {
//             return this.player.getPlayerState();
//         } catch (error) {
//             console.error(error);
//         }
//         return this.ERROR_CODE;
//     },
//     urlToId: function(){
//         const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
//         const match = url.match(regex);
//         return match ? match[1] : null;
//     },
// };
