import { useAppDispatch, useAppSelector } from "../../../store";
import { mailreadReceiptsActions } from "../../../store/mailreadreceipts";
import { ReceiptEmailSchema } from "../../../types/backend/models/mailreadreceipts/ReceiptEmail";
import { formatTimestamp } from "../../../utils/timeFormat";
const EmailCard = ({ _id }: {_id: string}) => {
    const dispatch = useAppDispatch();
    const onShowDelails = () => {
        dispatch(mailreadReceiptsActions.setPreviewing(_id));
    }
    const onDeleteBtnClick = () => {
        dispatch(mailreadReceiptsActions.setDeleting(_id));
    }
    const email = useAppSelector(state => state.mailredreceipts.emails).find(e => e._id === _id) as ReceiptEmailSchema;
    return(
        <div className="indicator m-5">
            {email.newInvokeCount>0&&(<span className="indicator-item badge badge-primary text-lg font-bold">{email.newInvokeCount}</span>)}
            <div className="card bg-base-200 w-96 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">{email.label}</h2>
                    <p>{formatTimestamp(email.createTime).date}</p>
                    <div className="card-actions justify-end">
                    <button className="btn btn-primary" onClick={onShowDelails}>Details</button>
                    <button className="btn btn-error" onClick={onDeleteBtnClick}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default EmailCard;