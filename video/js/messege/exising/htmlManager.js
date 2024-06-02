const EXISTING_MESSEGE_HTML_MANAGER = {
    people_html: document.getElementById('connected-people-list'),
    peopleDivs: new Map(),

    getStatusFromTimeGap(time_gap){
        if(time_gap >= 20){
            return 'disconnected';
        }else if(time_gap >= 10){
            return 'late';
        }
        return 'active';
    },

    onActivePeople: function(username){
        if(!this.peopleDivs.has(username)){
            return;
        }
        const div = this.peopleDivs.get(username);
        div.classList.remove('people-disconnect');
        div.classList.remove('people-late');
        div.classList.add('people-active');
    },
    onLatePeople: function(username){
        if(!this.peopleDivs.has(username)){
            return;
        }
        const div = this.peopleDivs.get(username);
        div.classList.remove('people-active');
        div.classList.remove('people-disconnect');
        div.classList.add('people-late');
    },

    onDisconnectedPeople: function(username){
        if(!this.peopleDivs.has(username)){
            return;
        }
        const div = this.peopleDivs.get(username);
        div.classList.remove('people-active');
        div.classList.remove('people-late');
        div.classList.add('people-disconnect');
        EVENTS.emmit({
            name: 'people-disconnected',
            data: {
                username: username,
            }
        })
    },

    refreshPeopleStatus: function(username){
        const time_gap = ROOM.timeAgo(username);
        const status = this.getStatusFromTimeGap(time_gap);
        if(status === 'active'){
            this.onActivePeople(username);
        }else if(status === 'late'){
            this.onLatePeople(username);
        }else if(status === 'disconnected'){
            this.onDisconnectedPeople(username);
        }else{
            console.error('sould not reach this portion');
        }
    },

    createNewPeople: function(messege){
        ROOM.connectedPeople.add(messege.__sender__);
        const div = createOnePeopleDiv(messege);
        this.people_html.appendChild(div);
        this.peopleDivs.set(messege.__sender__, document.getElementById(`${messege.__sender__}-one-people-div`));
    },
    manage: function(messege){
        let div;
        if(!this.peopleDivs.has(messege.__sender__)){
            this.createNewPeople(messege);
        }
        updateOnePeopleDiv(messege);
    },
    sourceTypeIcons: {
        youtube: '<i class="fa-brands fa-youtube"></i>',
        abstract: '<i class="fa-solid fa-xmark"></i>',
        local: '<i class="fa-solid fa-desktop"></i>', 
    },

    yesNoIcons: {
        isOnSync: {
            yes: '<i class="fa-solid fa-rotate fa-spin"></i>',
            no: '<i class="people-sync-no fa-solid fa-rotate"></i>',
        },
        inTab: {
            yes: '<i class="fa-solid fa-t"></i>',
            no: '<i class="fa-solid fa-text-slash"></i>'
        },
        fullscreen: {
            yes: '<i class="fa-solid fa-expand"></i>',
            no: '<i class="fa-solid fa-compress"></i>',
        },
        caption: {
            yes: '<i class="fa-solid fa-closed-captioning"></i>',
            no: '<i class="fa-regular fa-closed-captioning"></i>',
        },
    },
}

/*
    `${messege.__sender__}-one-people-div`

    `${messege.__sender__}-info-checkbox`

    // icons
    `${messege.__sender__}-sourceType-icon`
    `${messege.__sender__}-caption-icon`
    `${messege.__sender__}-fullscreen-icon`
    `${messege.__sender__}-inTab-icon`
    `${messege.__sender__}-isOnSync-icon`

    // infos
    `${messege.__sender__}-Videotitle-info`
    `${messege.__sender__}-timeAgo-info`

*/


// should depricate
function stoHMS(seconds){
    const s = Number(seconds) % 60;
    const m = Number(seconds) / 60;
    const h = Number(seconds) / (60 * 60);
    const ret = `${h > 0 ? `${h}h:` : ''}${`${m}m:`}${`${s}s`}`;
    console.log(ret, h, m, s, seconds);
    return ret;
}

function updateOnePeopleDiv(messege){
    document.getElementById(`${messege.__sender__}-sourceType-icon`).innerHTML = EXISTING_MESSEGE_HTML_MANAGER.sourceTypeIcons[messege.sourceType];
    for(iconType in  EXISTING_MESSEGE_HTML_MANAGER.yesNoIcons){
        document.getElementById(`${messege.__sender__}-${iconType}-icon`).innerHTML = messege[iconType] ? EXISTING_MESSEGE_HTML_MANAGER.yesNoIcons[iconType].yes : EXISTING_MESSEGE_HTML_MANAGER.yesNoIcons[iconType].no
    }
    document.getElementById(`${messege.__sender__}-Videotitle-info`).textContent = messege.title;
    // document.getElementById(`${messege.__sender__}-timeAgo-info`).textContent = `${stoHMS(ROOM.timeAgo(messege.__sender__))}`;
}

function createOnePeopleDiv(messege){
    const div = document.createElement('div');
    div.classList.add('one-people');
    div.setAttribute('id', `${messege.__sender__}-one-people-div`);

    
        // set icon
        const iconDiv = document.createElement('div');
        iconDiv.innerHTML = `<i class="fa-solid fa-signal status-icon"></i>`;
        div.appendChild(iconDiv);

        // image
        const img = document.createElement('img');
        img.setAttribute('height', '30');
        img.setAttribute('width', '30');
        img.setAttribute('src', './elements/img/avaters/avater-1.png');
        div.appendChild(img);

        // name
        const name = document.createElement('p');
        name.textContent = messege.__sender__;
        name.style.flexGrow = '1'; // need to fix XSS
        div.appendChild(name);

        const videoSourceDiv = document.createElement('div');
        videoSourceDiv.setAttribute('id', `${messege.__sender__}-sourceType-icon`);
        videoSourceDiv.innerHTML = '...';
        div.appendChild(videoSourceDiv);

        // caption
        const captionDiv = document.createElement('div');
        captionDiv.setAttribute('id', `${messege.__sender__}-caption-icon`);
        captionDiv.innerHTML = '...';
        div.appendChild(captionDiv);

        // fullscreen
        const fullScreenDiv = document.createElement('div');
        fullScreenDiv.setAttribute('id', `${messege.__sender__}-fullscreen-icon`);
        fullScreenDiv.innerHTML = '...';
        div.appendChild(fullScreenDiv);

        // intab
        const tabDiv = document.createElement('div');
        tabDiv.setAttribute('id', `${messege.__sender__}-inTab-icon`);
        tabDiv.innerHTML = '...';
        div.appendChild(tabDiv);

        // in sync
        const syncDiv = document.createElement('div');
        syncDiv.setAttribute('id', `${messege.__sender__}-isOnSync-icon`);
        syncDiv.innerHTML = '...';
        div.appendChild(syncDiv);

        //bottom infos 

        const checkBox = document.createElement('input');
        checkBox.setAttribute('type', 'checkbox');
        checkBox.setAttribute('id', `${messege.__sender__}-info-checkbox`);
        checkBox.classList.add('accordion-checkbox');
        checkBox.setAttribute('checked', 'checked');
        div.appendChild(checkBox);

        const label = document.createElement('label');
        label.classList.add('accordion-header');
        label.setAttribute('for', `${messege.__sender__}-info-checkbox`);
        label.innerHTML = ' <i class="fa-solid fa-circle-info"></i>';
        div.appendChild(label);
        
        const moreInfo = document.createElement('div');
        moreInfo.classList.add('accordion-content');
        moreInfo.classList.add('one-people-info');

            // Video Title
            const videoTitle = document.createElement('div');
            videoTitle.classList.add('one-info');
                // title icon 
                const videoTitleIcon = document.createElement('p');
                videoTitleIcon.classList.add('icon');
                videoTitleIcon.innerHTML = `<i class="fa-solid fa-braille"></i>`;
                videoTitle.appendChild(videoTitleIcon);
                // title text
                const videoTitleText = document.createElement('p');
                videoTitleText.setAttribute('id', `${messege.__sender__}-Videotitle-info`)
                videoTitleText.textContent = '...'
                videoTitle.appendChild(videoTitleText);
            
            moreInfo.appendChild(videoTitle);

            // Time ago
            const timeAgo = document.createElement('div');
            timeAgo.classList.add('one-info');
                // timeago icon 
                const timeAgoIcon = document.createElement('p');
                timeAgoIcon.classList.add('icon');
                timeAgoIcon.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i>`;
                timeAgo.appendChild(timeAgoIcon);
                // timeago text
                const timeAgoText = document.createElement('p');
                timeAgoText.setAttribute('id', `${messege.__sender__}-timeAgo-info`)
                timeAgoText.textContent = '...'
                timeAgo.appendChild(timeAgoText);
            
            moreInfo.appendChild(timeAgo);

            // errorBar
            const errorBar = document.createElement('div');
            errorBar.classList.add('one-info');
                // errorBar icon 
                const errorBarIcon = document.createElement('p');
                errorBarIcon.classList.add('icon');
                errorBarIcon.innerHTML = `<i class="fa-solid fa-tower-broadcast"></i>`;
                errorBar.appendChild(errorBarIcon);
                // errorBar text
                const errorBarText = document.createElement('p');
                errorBarText.setAttribute('id', `${messege.__sender__}-errorBar-info`)
                errorBarText.textContent = '...'
                errorBar.appendChild(errorBarText);
            
            moreInfo.appendChild(errorBar);


            // add more info .......

        div.appendChild(moreInfo);

    return div;
}

