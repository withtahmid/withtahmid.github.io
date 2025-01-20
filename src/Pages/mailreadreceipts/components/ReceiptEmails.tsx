import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { mailreadReceiptsActions } from "../../../store/mailreadreceipts";
import EmailCard from "./EmailCard";

const ReceiptEmails = () => {
    const emails = useAppSelector(state => state.mailredreceipts.emails);
    const status = useAppSelector(state => state.mailredreceipts.status);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(mailreadReceiptsActions.fetchAll());
    }, []);

    if(status === "loading"){
        return <div className="flex justify-center items-center w-full h-full"><span className="loading loading-bars loading-lg"></span></div>;
    }

    return (
        <div className='px-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
            { 
                status === "success" ? emails.slice().sort((a, b) => b.createTime - a.createTime).map(e => <EmailCard key={e._id} _id={e._id} />) :
                status === "error" ? <>Something went wrong</>  : <></>
            }
        </div>
    )
}

export default ReceiptEmails;