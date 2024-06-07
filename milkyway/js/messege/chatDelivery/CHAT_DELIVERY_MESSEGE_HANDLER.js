class CHAT_DELIVERY_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('chatText');
    }
    // __onFail__(messege){
    //     CHAT_STATUS_HANDLER.fail(messege);
    // }
    // __onSent__(messege){
    //     // CHAT_STATUS_HANDLER.sent(messege);
    //     // NOTIFICATION_BELL.chatSent()
    // }
    
    __isFor__(messege){
        return messege.__sender__ != ROOM.getUsername();
    }
    __handle__(messege){
        const chat = document.getElementById(messege.chatId);
        if(!chat){
            return;
        }
        const div =chat.getElementsByClassName('messege-delivery-info')[0];
        const person = document.createElement('p');
        person.classList.add('messege-delivery-info-name');
        person.textContent = messege.__sender__;
        div.appendChild(person);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}