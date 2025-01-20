import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { mailreadReceiptsActions } from "../../../store/mailreadreceipts";
import { mailreadreceipts_deleteEmailModalId } from "../../../configs/mailreadreceipts";
import LoadingBtn from "../../../Components/buttons/LoadingBtn";
const DeleteModal = () => {
    const _id = useAppSelector(state => state.mailredreceipts.deleting);
    const email = useAppSelector(state => state.mailredreceipts.emails).find(e => e._id === _id);
    const [ deleting, setDeleting ] = useState(false);

    const dispatch = useAppDispatch();
    useEffect(() => {
        if(_id !== ""){
            const modal = document.getElementById(mailreadreceipts_deleteEmailModalId) as HTMLDialogElement;
            if(modal){
                modal.showModal();
            }
        }else{
            const modal = document.getElementById(mailreadreceipts_deleteEmailModalId) as HTMLDialogElement;
            if(modal){
                modal.close();
            }
        }   
    }, [_id]);

    const onClose = () => {
        dispatch(mailreadReceiptsActions.setDeleting(""));
    }

    const deleteEmail = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            setDeleting(true);
            await dispatch(mailreadReceiptsActions.deleteOne({_id: _id}));
        } catch (error) {
            console.error(error);            
        }finally{
            setDeleting(false);
        }
        const modal = document.getElementById(mailreadreceipts_deleteEmailModalId) as HTMLDialogElement;
        if(modal){
            modal.close();
        }
    }

    return (<dialog id={mailreadreceipts_deleteEmailModalId} className="modal modal-bottom sm:modal-middle">
                {!email ? <>Something went wrong</> : 
                    <>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">{email.label}</h3>
                        <p className="py-4">Are you sure want to delete?</p>
                        <div className="modal-action">
                        <form method="dialog">
                           <div className="flex gap-2">
                            <button onClick={onClose} className="btn">Close</button>
                            <LoadingBtn loading={deleting} className="btn btn-error" onClick={deleteEmail} label="Delete" />
                           </div>
                        </form>
                        </div>
                    </div>
                    </>
                
                }
        </dialog>)
}
export default DeleteModal;