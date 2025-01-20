class MESSEGE_HANDLER_ABSTRACT{
    constructor(type = 'abstract'){
        this.__type__ = type;
    }
    __isFor__(messege){
        throw new Error('Chield class must impliment __isFor__');
    }
    __onFail__(messege){
        console.error(`[ FAILED ]: __type__: ${messege.__type__}, __id__: ${messege.__id__}`)
        // console.log(messege);
    }
    __onSent__(messege){
        return;
        // console.log(`[ SENT ]: __type__: ${messege.__type__}, __id__: ${messege.__id__}`)
    }
    __handle__(messege){
        throw new Error('Chield class must impliment __isFor__');
    }
}