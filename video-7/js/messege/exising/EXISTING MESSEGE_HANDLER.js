class EXISTING_MESSEGE_HANDLER extends MESSEGE_HANDLER_ABSTRACT{
    constructor(){
        super('existing');
    }
    __onSent__(messege){
        EXISTING_MESSEGE.lastTime = TIME.now();
    }
    __isFor__(messege){ return messege.__reciever__ === 'all'}
    
    __handle__(messege){
        const transmissionGap = TIME.sAgo(messege.__emmitTime__);
        if( transmissionGap > HYPERPARAMETER.existinfMessegeValidTill){
            console.log(`\n[IGNORED EXISTING MESSEGE]\nTransmission time: ${transmissionGap}`);
            return;
        }
        NOTIFICATION_MANAGER.manage(messege);
        EXISTING_MESSEGE_HTML_MANAGER.manage(messege);
    }
}