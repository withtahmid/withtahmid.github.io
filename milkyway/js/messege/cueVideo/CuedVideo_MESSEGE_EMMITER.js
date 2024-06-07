// class CuedVIDEO_MESSEGE_EMMITER extends MESSEGE_EMMITTER_ABSTRACT{
//     #ignoreNextCue
//     constructor(){
//         super('cuedVideo', 'all');
//         this.#ignoreNextCue = false;

//     }
//     ignoreNext(){
//         this.#ignoreNextCue = true;
//     }
//     __get__(){
//         const messege = this.__metaData__();
//         if(this.#ignoreNextCue){
//             messege.__dontEmmit__ = true;
//             this.#ignoreNextCue = false;
//         }
//         return messege;
//     }
// }