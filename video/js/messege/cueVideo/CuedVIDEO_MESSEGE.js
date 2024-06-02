const CuedVIDEO_MESSEGE = {
    __get__: function(){
        const messege = __MESSEGE_ABSTRACT__.get('cuedVideo', 'all');
        messege.source = VIDEO.__getSource__();
        messege.sourceType = VIDEO.__getSourceType__();
        messege.title = VIDEO.__getTitle__();
        return messege;
    },
    __emmit__: function(){
        if(this.ignoreNext){
            console.log(`Ignored to emmit cue messege`);
            this.ignoreNext = false;
            return;
        }
        const messege = this.__get__();
        MESSEGE_EMMITTER.__emmit__(messege);
    },
}

EVENTS.platform.addEventListener('cuedVideo', (e)=>  CuedVIDEO_MESSEGE.__emmit__());