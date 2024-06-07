const CuedVIDEO_NOTIFICATION = {
    icons: {
        youtube: '<i class="fa-brands fa-youtube"></i>',
        abstract: '<i class="fa-solid fa-xmark"></i>',
        local: '<i class="fa-solid fa-desktop"></i>',
    },
    texts: {
        youtube: 'cued new YouTube video',
        abstract: 'on neutral',
        local: 'cued new video from Device',
    },

    __generate__: function(messege){
        const notification = {__title__: messege.__sender__};
        notification.__icon__= this.icons[messege.sourceType];
        // notification.__text__= `${this.texts[messege.sourceType]}`;
        notification.__text__ = `played ${messege.title}`
        notification.__duration__ = null;
        notification.__css__ = 'default';
        return notification;
    }
}