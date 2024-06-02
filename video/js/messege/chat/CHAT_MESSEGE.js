const CHAT_MESSEGE = {
    __get__: function(){
        return __MESSEGE_ABSTRACT__.get('chat', 'all');
    },
    onAcknowledge: function(messege){
        // will work later
    },
    onText: function(messege){
        CHAT_MESSEGE_HTML_MANAGER.manageText(messege);
    },

    sendText: function(text){
        const messege = this.__get__();
        messege.text = text;
        messege.id = `${ROOM.getUsername()}${Date.now()}${Math.floor(Math.random() * 1000)}`;
        messege.chatType = 'text';
        MESSEGE_HANDLER.emmit(messege);
    },
    sendAcknowledge: function(messege){
        // will work later
    },
    __onFail__(messege){
        console.log('failed to send text messege');
    },
    __isFor__: function(messege){
        return messege.__reciever__ === 'all';
    },
    __handle__: function(messege){
        if(messege.chatType === 'text'){
            this.onText(messege);
        }else if(messege.chatType === 'acknowledge'){
            this.onAcknowledge(messege);
        }
    }
}


function generateUniqueId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000); // Adding a random value for more uniqueness
    return `${timestamp}${random}`;
}