const CHAT_STATUS_HANDLER = {
    failed: new Map(),

    fail: function(messege){
        if(messege.__sender__ != ROOM.getUsername()){
            console.log(`\n[UNEXPECTED] messege.__sender__ != ROOM.getUsername()`)
            return;
        }
        if(this.failed.has(messege.chatId)){
            console.log(`\n[FAILED] to resend chat messege`);
            return;
        }
        this.failed.set(messege.chatId, messege);
        const chat = document.getElementById(`${messege.chatId}`);
        if(!chat){
            console.log(`\n[UNEXPECTED], chat element is not found by the Id inside fail()`);
            return;
        }
        chat.classList.add('failed');
        chat.getElementsByClassName('messege-sent-info-time')[0].textContent = `resend`;
        chat.onclick = ()=>{ CHAT_STATUS_HANDLER.resend(`${messege.chatId}`);}
        chat.style.cursor = 'pointer';
    },
    sent: function(messege){
        const chat = document.getElementById(`${messege.chatId}`);
        if(!chat){
            console.log(`\n[UNEXPECTED], chat element is not found by the Id inside sent()`);
            return;
        }
        if(!this.failed.has(messege.chatId)){
            // console.log(`\n[REGULAR MESSEGE SENT]`);
            return;
        }
        // console.log(`\n[FAILED MESSEGE IS SENT]`);
        this.failed.delete(messege.chatId);
        chat.getElementsByClassName('messege-sent-info-time')[0].textContent = TIME.format12h(new Date(messege.__emmitTime__));
        
        chat.classList.remove('failed');
        chat.onclick = ()=>{}
        chat.style.cursor = 'auto';
        
        const parent = document.getElementById('chat-box-container');
        parent.removeChild(chat);
        parent.appendChild(chat);
        parent.scrollTop = parent.scrollHeight;
    },
    resend: function(chatId){
        const messege = this.failed.get(chatId);
        if(!messege){
            console.log(`\n[UNEXPECTED] tried to resend but Map dosn't contain the chatId: ${chatId}`);
            return;
        }
        messege.__sender__ = ROOM.getUsername();
        messege.__emmitTime__ = TIME.now();
        MESSEGE_EMMITTER.__emmit__(messege);
    },
};