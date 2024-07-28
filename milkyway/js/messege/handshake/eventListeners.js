EVENTS.platform.addEventListener('successful-handshake', (e)=>{
    const div = document.createElement('div');
    div.classList.add('chat-box-info');
    div.innerHTML = `
                <i class="fa-solid fa-lock"></i>
                <span>encryption key changed for <strong>${e.detail.username}</strong></span>
                `;
    document.getElementById('chat-box-container').appendChild(div);
});
