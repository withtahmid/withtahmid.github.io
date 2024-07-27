const EXISTING_MESSEGE_HTML_MANAGER = {
    people_html: document.getElementById('connected-people-list'),
    peopleDivs: new Map(),

    getStatusFromTimeGap(time_gap){
        if(time_gap > HYPERPARAMETER.eliminateTime){
            return 'eliminated'
        }
        else if(time_gap >= HYPERPARAMETER.disconnectTime){
            return 'disconnected';
        }else if(time_gap >= HYPERPARAMETER.lateTime){
            return 'late';
        }
        return 'active';
    },

    onActivePeople: function(username){
        if(!this.peopleDivs.has(username)){
            return;
        }
        const div = this.peopleDivs.get(username);
        // div.classList.remove('people-disconnect');
        // div.classList.remove('people-late');
        // div.classList.add('people-active');
        EVENTS.emmit({
            name: 'people-active',
            data: {
                username: username,
            }
        });
    },
    onLatePeople: function(username){
        if(!this.peopleDivs.has(username)){
            return;
        }
        const div = this.peopleDivs.get(username);
        // div.classList.remove('people-active');
        // div.classList.remove('people-disconnect');
        // div.classList.add('people-late');
        EVENTS.emmit({
            name: 'people-late',
            data: {
                username: username,
            }
        });
    },

    onDisconnectedPeople: function(username){
        if(!this.peopleDivs.has(username)){
            return;
        }
        const div = this.peopleDivs.get(username);
        // div.classList.remove('people-active');
        // div.classList.remove('people-late');
        // div.classList.add('people-disconnect');
        
        EVENTS.emmit({
            name: 'people-disconnected',
            data: {
                username: username,
            }
        });

    },

    eliminatePeople: function(username){
        ROOM.removeDisconnectedPeople(username);
        this.people_html.removeChild(this.peopleDivs.get(username));
        this.peopleDivs.delete(username);
        EVENTS.emmit({
            name: 'people-eliminated',
            data: {
                username: username,
            }
        });
    },

    updateTimeAgo: function(username, time_gap){
        // const timeAgoDiv = document.getElementById(`${username}-timeAgo-info`);
        // if(timeAgoDiv){
        //     timeAgoDiv.textContent = `${FORMATOR.secondToMS(time_gap)}`;
        // }
    },

    calculateMediaError: function(message){
        const transmissionTime = (TIME.msAgo(message.__emmitTime__)) / 1000;
        const currentTime = message.currentTime + (message.isPaused ? 0 : transmissionTime);
        const diff =  currentTime - VIDEO.__getCurrentTime__();
        // return ` ${diff <= 0 ? '+' : '-'}${FORMATOR.formatDuration(Math.abs(diff))}`;
        return diff;
    },

    calculateLeftValueFromError: function(value){
        const offset = HYPERPARAMETER.mediaMissMatchTol;
        value = Math.min(Math.max(-offset, value), +offset) + offset;
        const left = value * (6 / (offset * 2));
        return left.toFixed(2);
    },

    updateMediaErrorIndicator: function(messege){
        const errorValue = this.calculateMediaError(messege);
        const mediaErrorSlider = document.getElementById(`${messege.__sender__}-media-error-slider`);
        if(mediaErrorSlider){
            const left = this.calculateLeftValueFromError(errorValue);
            mediaErrorSlider.style.left = `${left}rem`;
        }
        const valueNormalized = -5 <= errorValue && errorValue <= +5 ? Math.abs(errorValue.toFixed(1)) : 'oo';
        const mediaErrorValue = document.getElementById(`${messege.__sender__}-media-error-value`);
        if(mediaErrorValue){
            mediaErrorValue.textContent = `${valueNormalized}`
        }
    },
    
    statusColor: function(time_gap){
        const percent = 100 - (Math.min(HYPERPARAMETER.disconnectTime, Math.max(time_gap, 0)) * (100.0 / HYPERPARAMETER.disconnectTime));
        return getColor(percent);
    },


    refreshPeopleStatus: function(username){
        const time_gap = ROOM.timeAgo(username);
        const status = this.getStatusFromTimeGap(time_gap);
        if(status === 'eliminated'){
            this.eliminatePeople(username);
        }else if(status === 'active'){
            this.onActivePeople(username);
        }else if(status === 'late'){
            this.onLatePeople(username);
        }else if(status === 'disconnected'){
            this.onDisconnectedPeople(username);
        }else{
            console.error('sould not reach this portion');
        }
        this.peopleDivs.get(username).getElementsByClassName('status-icon')[0].style.color = `${this.statusColor(time_gap)}`;
        this.updateTimeAgo(username, time_gap);
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
        try {
            updateOnePeopleDiv(messege);
        } catch (error) {
            console.error('Failed to update onePeopleDiv');
            console.error(error);
        }
        this.refreshPeopleStatus(messege.__sender__);
        this.updateMediaErrorIndicator(messege);
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
    `${messege.__sender__}-mediaErrorBar-info`
    `${messege.__sender__}-media-error-slider`
    `${messege.__sender__}-media-error-value`

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
        iconDiv.innerHTML = `<i class="fa-solid fa-wifi status-icon"></i>`;
        div.appendChild(iconDiv);

        // image
        // const img = document.createElement('img');
        // img.setAttribute('height', '30');
        // img.setAttribute('width', '30');
        // img.setAttribute('src', './elements/img/avaters/avater-1.png');
        // div.appendChild(img);

        // name
        const name = document.createElement('p');
        name.textContent = messege.__sender__;
        name.style.flexGrow = '1'; // need to fix XSS
        div.appendChild(name);


        const mediaErrorIndicator = document.createElement('div');
        mediaErrorIndicator.classList.add('media-error-indicator');

        
            const theGrid = document.createElement('div');
            theGrid.classList.add('media-error-indicator-grid');
                const mediaErrorValue = document.createElement('span');
                mediaErrorValue.setAttribute('id', `${messege.__sender__}-media-error-value`)
                theGrid.appendChild(mediaErrorValue);
            mediaErrorIndicator.appendChild(theGrid);

            const theSlider = document.createElement('div');
            theSlider.classList.add('media-error-indicator-slider');
            theSlider.setAttribute('id', `${messege.__sender__}-media-error-slider`)
            
            mediaErrorIndicator.appendChild(theSlider);

        div.appendChild(mediaErrorIndicator);


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
            // const timeAgo = document.createElement('div');
            // timeAgo.classList.add('one-info');
            //     // timeago icon 
            //     const timeAgoIcon = document.createElement('p');
            //     timeAgoIcon.classList.add('icon');
            //     timeAgoIcon.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i>`;
            //     timeAgo.appendChild(timeAgoIcon);
            //     // timeago text
            //     const timeAgoText = document.createElement('p');
            //     timeAgoText.setAttribute('id', `${messege.__sender__}-timeAgo-info`)
            //     timeAgoText.textContent = '...'
            //     timeAgo.appendChild(timeAgoText);
            
            // moreInfo.appendChild(timeAgo);

            // mediaErrorBar
            // const mediaErrorBar = document.createElement('div');
            // mediaErrorBar.classList.add('one-info');
            //     // mediaErrorBar icon 
            //     const mediaErrorBarIcon = document.createElement('p');
            //     mediaErrorBarIcon.classList.add('icon');
            //     mediaErrorBarIcon.innerHTML = `<i class="fa-solid fa-bug"></i>`;
            //     mediaErrorBar.appendChild(mediaErrorBarIcon);
            //     // mediaErrorBar text
            //     const mediaErrorBarText = document.createElement('p');
            //     mediaErrorBarText.setAttribute('id', `${messege.__sender__}-mediaErrorBar-info`)
            //     mediaErrorBarText.textContent = '...'
            //     mediaErrorBar.appendChild(mediaErrorBarText);
            
            // moreInfo.appendChild(mediaErrorBar);


            // add more info .......

        div.appendChild(moreInfo);

    return div;
}




function getColor(percent) {
	percent = Math.min(100, Math.max(0, percent));
	var red = percent < 50 ? 255 : Math.round(255 - (percent - 50) * 5.1);
	var green = percent > 50 ? 255 : Math.round((percent * 5.1));
    const color = `rgb(${red}, ${green}, ${255 - (red / 2)})`;
	return color;
}

function getColorMatte(percent) {
	percent = Math.min(100, Math.max(0, percent));
	var red = percent < 50 ? 255 : Math.round(255 - (percent - 50) * 5.1);
	var green = percent > 50 ? 255 : Math.round((percent * 5.1));
	var color = 'rgba(' + red + ',' + green + ',0, 0.3)';
	return color;
}
