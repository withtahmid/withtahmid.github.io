EVENTS.platform.addEventListener('successful-handshake', (e)=>{
    const div = document.createElement('div');
    div.classList.add('chat-box-info');
    div.innerHTML = `
                <i class="fa-solid fa-lock"></i>
                <span> end-to-end encryption established with <strong>${e.detail.username}</strong></span>
                `;
    document.getElementById('chat-box-container').appendChild(div);
});
