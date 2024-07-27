const EVENTS = {
    platform: document.getElementById('events-platform'),
    emmit: function(event){
        try {
            this.platform.dispatchEvent(new CustomEvent(event.name, {detail: event.data}));  
        } catch (error) {
            console.error(error);
        }
    },
    directEmmit: function(eventName){
        try {
           this.emmit({name: eventName, data: {}}); 
        } catch (error) {
            console.error(error);
        }
    }
}

EVENTS.platform.addEventListener('__cueVideo__', (e)=>{
    // console.log(e);
})