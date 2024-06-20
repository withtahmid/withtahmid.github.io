CHAT_MESSEGE_HTML_MANAGER = {
    manageText: function(message){
        appendMessege(message);
    }
};


function appendMessege(message){
    const chatBox = document.getElementById('chat-box-container');
    const div = document.createElement('div');
    div.classList.add('message-container');
    div.setAttribute('id', `${message.chatId}`);
    if(message.__sender__ === ROOM.getUsername()){
        div.classList.add('you');
    }
    if(message.__sender__ != ROOM.getUsername()){
        const sender = document.createElement('p');
        sender.classList.add('messege-sent-info-sender');
        sender.textContent = message.__sender__ ?? 'unknown';
        div.appendChild(sender);
    }
    
    const mainBody = document.createElement('div');
    mainBody.classList.add('messege-main-body');

        // const sentStatus = document.createElement('div');
        // sentStatus.classList.add('sent-status');

        // mainBody.appendChild(sentStatus);

        const messegeBody = document.createElement('div');
        messegeBody.classList.add('message-body');
            
            const text = document.createElement('p');
            text.classList.add('message-body-text');
            text.textContent = message.text;
            messegeBody.appendChild(text);
        mainBody.appendChild(messegeBody);

        const time = document.createElement('p');
        time.classList.add('messege-sent-info-time');
        time.textContent = TIME.format12h(new Date(message.__emmitTime__));
        mainBody.appendChild(time);

    div.appendChild(mainBody);

    const deliveryInfo = document.createElement('div');
    deliveryInfo.classList.add('messege-delivery-info');

    div.appendChild(deliveryInfo);
    
    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;

    if(VIDEO.__fullscreen__() && VIDEO.allowChatOnFullScreen){
        document.querySelector(".video-container").classList.add('on-video-chat');
    }
}


function sendTextMessage(inputFiledId){
    // if(!ROOM.isJoined()){
    //     displayErrorOnScreen("Please make sure you are connected", "No Connection");
    //     return;
    // }
    const input = document.getElementById('chat-input-field');
    if(!input.value){
        return;
    }
    CHAT_TEXT_MESSEGE.__emmit__(input.value);
    input.value = '';
}

document.querySelector('emoji-picker').addEventListener('emoji-click', (event) =>{
    document.getElementById('chat-input-field').value += event.detail.unicode;
});


document.getElementById('chat-input-field').addEventListener('keypress', (event)=>{
    if (event.key === 'Enter') {
      sendTextMessage()
    }
});