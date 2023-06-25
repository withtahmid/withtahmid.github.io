hidepopup();
ButtonInputOff('connectionSettings', true);
ButtonInputOff('connectedPeopleList', true);
ButtonInputOff('subtitleBox', true);
ButtonInputOff('message-box', true);

// ButtonInputOff('sourses', true);

storeWidthbyId('src-local', document.getElementById('src-local').offsetWidth);
storeWidthbyId('src-drive', document.getElementById('src-drive').offsetWidth);
storeWidthbyId('src-youtube', document.getElementById('src-youtube').offsetWidth);
storeHeightbyId('popupdiv', document.getElementById('popupdiv').offsetHeight);
storeHeightbyId('notificationpopup', document.getElementById('notificationpopup').offsetHeight);



selectSource('src-local');
addClass('subtitleBox','inactive');
addSubtlieTheme('default');


// document.getElementById('subtitleFileInput').disabled = true;