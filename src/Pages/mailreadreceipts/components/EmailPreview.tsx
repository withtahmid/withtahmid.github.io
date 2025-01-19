import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { mailreadreceipts_invokeURI, mailreadreceipts_viewEmailModalId } from "../../../configs/mailreadreceipts";
import { formatTimestamp } from "../../../utils/timeFormat";
import { mailreadReceiptsActions } from "../../../store/mailreadreceipts";

const EmailPreview = () => {
  const _id = useAppSelector(state => state.mailredreceipts.previewing);

  const email = useAppSelector(state => state.mailredreceipts.emails).find(e => e._id === _id);
  const [copySuccess, setCopySuccess] = useState<string>("Copy HTML");

  const dispatch = useAppDispatch();

  useEffect(() => {
    if(_id !== ""){
      if(email && email.newInvokeCount > 0){
        dispatch(mailreadReceiptsActions.seeOne({ _id }));
      }
      const modal = document.getElementById(mailreadreceipts_viewEmailModalId) as HTMLDialogElement
      if(modal){
        modal.showModal();
      }
    }else{
      const modal = document.getElementById(mailreadreceipts_viewEmailModalId) as HTMLDialogElement
      if(modal){
        modal.close();
      }
    }
  }, [_id])


  const getInvokUrl = () => {
    return `${mailreadreceipts_invokeURI}/${_id}`;
  }

  const getInvokeComponent = () => {
    return `<img src="${getInvokUrl()}" height="1" width="1"/>`
  }

  const copyToClipBoard = async() => {
    try {
      await navigator.clipboard.writeText(getInvokeComponent());
      setCopySuccess("Copied!");
    } catch (err) {
      setCopySuccess("Failed!");
      console.error("Error copying text: ", err);
    }
  }

  const closeModal = () => {
    dispatch(mailreadReceiptsActions.setPreviewing(""));
  }

  const { date, time } = formatTimestamp(email?.createTime ?? 0);

    return(<dialog id={mailreadreceipts_viewEmailModalId} className="modal modal-bottom sm:modal-middle">
         {!email ? <>Something went wrong</> : 
         
         <div className="modal-box">
         <div className="flex justify-between">
           <h3 className="font-bold text-2xl">{email?.label}</h3>
           {/* <button onClick={() => dispatch(mailreadRecei())} className="btn rounded-full text-primary text-xl font-bold"><IoReloadOutline /></button> */}
           </div>
         <p className="py-4">Created at: {date}, {time}</p>
         <div className="py-2">
         <kbd onClick={copyToClipBoard} className="btn kbd kbd-md">{copySuccess}</kbd>
         </div>
         <div>
           <div className="mockup-code">
             <pre ><code> {getInvokeComponent()} </code></pre>
           </div>
         </div>
         <div className="my-2">
           <h1 className="text-2xl my-1" >Seen {email?.invokes.length} times</h1>
           {
            <div className="py-3 px-1">
               <table className="w-full text-center">
                 <thead>
                   <tr>
                     <th>Date</th>
                     <th>Time</th>
                     <th>Browswe</th>
                   </tr>
                 </thead>
                 <tbody>
                 {email.invokes.map(i => {
                   return <tr key={i.time}>
                     <td>{formatTimestamp(i.time).date}</td>
                     <td>{formatTimestamp(i.time).time}</td>
                     <td>{i.browser}</td>
                   </tr>
                 })}
                 </tbody>
               </table>
            </div>
           }
         </div>
         <div className="modal-action">
           <form method="dialog">
            <div className="flex gap-5">
             <button onClick={closeModal} className="btn">Close</button>
            </div>
           </form>
         </div>
       </div>
         }
        </dialog>)
}
export default EmailPreview;