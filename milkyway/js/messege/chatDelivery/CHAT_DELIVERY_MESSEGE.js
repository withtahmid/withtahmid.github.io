const CHAT_DELIVERY_MESSEGE = {
    __get__: function(){
        return __MESSEGE_ABSTRACT__.get('chatDelivery', 'all');
    },
    __emmit__: function(chatId){
        const messege = this.__get__();
        messege.chatId = chatId;
        MESSEGE_EMMITTER.__emmit__(messege);
    },
}

function generateUniqueId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000); // Adding a random value for more uniqueness
    return `${timestamp}${random}`;
}