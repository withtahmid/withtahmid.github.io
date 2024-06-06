const CHAT_STATUS_HANDLER = {
    failed: new Map(),

    fail: function(messege){
        if(messege.__sender__ != ROOM.getUsername()){
            return;
        }
        this.failed.set(messege.chatId, messege);
        const chat = document.getElementById(`${messege.chatId}`);
        if(!chat){
            return;
        }
        chat.classList.add('failed');
        // const chat = document.getElementById(`${messege.chatId}`);
        const icon = chat.getElementsByClassName('sent-status')[0];
        icon.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
        icon.onclick = ()=>{ CHAT_STATUS_HANDLER.resend(`${messege.chatId}`);}
        icon.setAttribute('title', 'resend');
    },
    sent: function(messege){
        const chat = document.getElementById(`${messege.chatId}`);
        if(this.failed.has(messege.chatId)){
            this.failed.delete(messege.chatId);
        }
        chat.classList.remove('failed');
        const icon = chat.getElementsByClassName('sent-status')[0];
        icon.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
        icon.onclick = ()=>{}
        const sender = chat.getElementsByClassName('messege-sent-info-sender')[0];
        sender.textContent = messege.__sender__;
    },
    resend: function(chatId){
        const messege = this.failed.get(chatId);
        if(!messege){
            return;
        }
        messege.__sender__ = ROOM.getUsername();
        messege.__emmitTime__ = TIME.now();
        MESSEGE_EMMITTER.__emmit__(messege);
    },
};