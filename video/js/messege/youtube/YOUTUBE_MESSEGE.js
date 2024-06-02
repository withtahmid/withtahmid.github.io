const YOUTUBE_MESSEGE = {
    __get__: function(){
        const message = new __MESSEGE_ABSTRACT__.get('youtube', 'all')
    },
    __emmit__: function(){

    },
    __onFail__(messege){
        console.log('failed to send YouTube messege');
    },
    __isFor__: function(message){

    },
    __handle__: function(message){

    },

    cueVideo: function(){

    }
}