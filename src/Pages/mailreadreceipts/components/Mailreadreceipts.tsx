import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import EmailPreview from "./EmailPreview";
import { mailreadreceipts_createEmailModalId } from "../../../configs/mailreadreceipts";
import { FaPlus } from "react-icons/fa6";
import ReceiptEmails from "./ReceiptEmails";
import CreateEmailModal from "./CreateEmailModal";
import { addToast } from "../../../store/toastSlice";
import DeleteModal from "./DeleteModal";
import { IoExtensionPuzzle } from "react-icons/io5";
const MailReadReceipts = () => {
    const message = useAppSelector(state => state.mailredreceipts.message);
    const error = useAppSelector(state => state.mailredreceipts.error); 
    const dispatch = useAppDispatch();
    useEffect(() => {
        if(error){
            dispatch(addToast({ mesaage: error, type: "error" }));
        }
    }, [error]);
    useEffect(() => {
        if(message){
            dispatch(addToast({ mesaage: message, type: "success" }));
        }
    }, [message]);

    const addEmailBtn = () => {
        const addEmailModal = document.getElementById(mailreadreceipts_createEmailModalId) as HTMLDialogElement;
        if(addEmailModal) {
            addEmailModal.showModal();
        }
    }

    const redirectToExtentionpage = () => {
        window.open("https://chromewebstore.google.com/detail/htmail-insert-html-into-g/omojcahabhafmagldeheegggbakefhlh", "_blank");
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="p-2 flex justify-end gap-3">
                <button
                title="Extension" 
                onClick={redirectToExtentionpage} 
                className="btn btn-primary btn-circle text-2xl">
                    <IoExtensionPuzzle />
                </button>
                <button
                    title="Add new"
                    onClick={addEmailBtn} 
                    className="btn text-2xl btn-circle btn-primary">
                    <FaPlus />
                </button>
            </div>
            <div className="grow">
                <ReceiptEmails />
            </div>
            <CreateEmailModal />    
            <EmailPreview />
            <DeleteModal />
        </div>
    )
}
export default MailReadReceipts;