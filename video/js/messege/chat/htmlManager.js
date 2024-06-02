CHAT_MESSEGE_HTML_MANAGER = {
    manageText: function(message){
        appendTextToTextBox(message);
    }
};


function appendTextToTextBox(message){
    const chatBox = document.getElementById('chat-box-container');
    // ROOM.ringNotification();
    const container = document.createElement('div');
    container.classList.add('message-container');
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    if(message.__sender__ === ROOM.username){
        messageDiv.classList.add('you');
    }
    
    const img = document.createElement('img');
    img.setAttribute('height', '30');
    img.setAttribute('width', '30');
    img.setAttribute('src', './elements/img/avaters/avater-1.png');
    messageDiv.appendChild(img);
    
    const text = document.createElement('p');
    text.classList.add('text');
    text.textContent = message.text;
    messageDiv.appendChild(text);
    
    const time = document.createElement('p');
    time.classList.add('time');
    time.textContent = TIME.format12h(new Date(message.__emmitTime__));
    messageDiv.appendChild(time);
    
    container.appendChild(messageDiv);

    const sender = document.createElement('p');
    sender.classList.add('sender');
    sender.textContent = message.__sender__;
    container.appendChild(sender);
    chatBox.appendChild(container);
    if(VIDEO.__fullscreen__() && VIDEO.allowChatOnScreen){
        videoContainer.classList.add('on-video-chat');
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}


function sendTextMessage(inputFiledId){
    if(!ROOM.isJoined()){
        displayErrorOnScreen("Please make sure you are connected", "No Connection");
        return;
    }
    const input = document.getElementById('chat-input-field');
    CHAT_MESSEGE.sendText(input.value);
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