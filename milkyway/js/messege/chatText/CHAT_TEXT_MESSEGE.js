const CHAT_TEXT_MESSEGE = {
    __get__: function(){
        return __MESSEGE_ABSTRACT__.get('chatText', 'all');
    },
    __emmit__: async function(text){
        const messege = this.__get__();
        messege.text = text;
        messege.chatId = `${ROOM.getUsername()}${Date.now()}${Math.floor(Math.random() * 1000)}`;
        appendMessege(messege);
        const encryptedText = await AES.encrypt(messege.text);
        messege.text = encryptedText;
        MESSEGE_EMMITTER.__emmit__(messege);
    },
}

function generateUniqueId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000); // Adding a random value for more uniqueness
    return `${timestamp}${random}`;
}