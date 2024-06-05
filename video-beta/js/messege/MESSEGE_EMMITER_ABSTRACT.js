// class MESSEGE_EMMITTER_ABSTRACT{
//     constructor(type, reciever){
//         this.__type__ = type;
//         this.__reciever__ = reciever;
//     }
//     __metaData__(){
//         const metaData = {
//             __id__: `${ROOM.getUsername()}${Date.now()}${type}${Math.floor(Math.random() * 1000)}${Math.floor(Math.random() * 1000)}`,
//             __type__: this.__type__,
//             __sender__: ROOM.username,
//             __reciever__: this.__reciever__,
//             __emmitTime__: TIME.now(),
//         };
//         return metaData;
//     }
//     __get__(){
//         throw new Error('Chield class must impliment this');
//     }
// }