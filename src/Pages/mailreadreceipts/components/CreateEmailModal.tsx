import { useState } from "react";
import { useAppDispatch } from "../../../store";
import { mailreadReceiptsActions } from "../../../store/mailreadreceipts";
import { mailreadreceipts_createEmailModalId } from "../../../configs/mailreadreceipts";
import { z } from "zod";
import ErrorMessage from "../../../Components/ErrorMessage";
import LoadingBtn from "../../../Components/buttons/LoadingBtn";

const CreateEmailModal = () => {
  const [ label,  setLabel ] = useState("");
  const [ creating, setCreating ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState<string | null>("");
  const dispatch = useAppDispatch();
  const addEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(errorMessage !== null){
      return;
    }
    try {
      setCreating(true);
      await dispatch(mailreadReceiptsActions.createOne({ label }));
    } catch (error) {
      console.error(error);
    }finally{
      setCreating(false);
      setLabel("");
      const modal = document.getElementById(
        mailreadreceipts_createEmailModalId
      ) as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
    }
  };

  const onType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLabel(value);
    const check = z.string().min(3, "Label must have at least 3 characters long").max(10, "Label cannot have more than 10 characters").safeParse(value);
    if(!check.success){
      setErrorMessage(check.error.errors[0].message)
    }else{
      setErrorMessage(null);
     
    }
  }

  return (
    <dialog id={mailreadreceipts_createEmailModalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg py-3">Add New Email</h3>
        <input
          onChange={onType}
          value={label}
          type="text"
          placeholder="Type Label"
          className="input input-bordered input-primary w-full max-w-xs"
        />
        <div className="pt-2">
        <ErrorMessage text={errorMessage ?? ""} />  
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
            <LoadingBtn loading={creating} disabled={errorMessage !== null} className="btn btn-primary ml-5" onClick={addEmail} label={"Add new"} />
          </form>
        </div>
      </div>
    </dialog>
  );
};
export default CreateEmailModal;
