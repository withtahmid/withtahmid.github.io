import { useEffect, useState } from "react";
import ErrorMessage from "../../../Components/ErrorMessage";
import LoadingBtn from "../../../Components/buttons/LoadingBtn";
import CustomNavLink from "../../../Components/CustomNavLink";
import { emailSchema, usernameSchema } from "../../../validators/zod";
import { trpc } from "../../../trpc";
import { logResponse } from "../../../utils/responseHandlers/logResponse";
import { handleTRPCError } from "../../../utils/responseHandlers/handleTRPCError";
import { useAppDispatch } from "../../../store";
import { addToast } from "../../../store/toastSlice";

const ForgotPassword = () => {
    const [ emailOrUsername, setEmailOrUsername ] = useState<string>("");
    
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    
    const dispatch = useAppDispatch();

     useEffect(() => {
        if(!loading && error){
            dispatch(addToast({ mesaage: error ?? "", type : "error" }))
        }
    }, [loading])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmailOrUsername(value);
    }
    const sendRecoveryLink = async() =>{
        const check = emailSchema.or(usernameSchema).safeParse(emailOrUsername);
        if(!check.success){
            setMessage("Invalid Email or Username format");
            return;
        }

        setMessage(null), setError(null);
        
        try {
            setLoading(true);
            var res = await trpc.auth.recoverAccount.sendRecoveryURL.mutate(emailOrUsername);
            logResponse(res);
        } catch (error) {
            return setError(handleTRPCError("Failed to send recovery email" ,error));
        }finally{
            setLoading(false);
        }
        if(res.success){
            setMessage(res.message);
        }else if("errorCode" in res){
            setMessage(res.message);
        }else{
            setError(res.message);
        }
    };

    return(<div className="flex min-h-screen h-full w-full items-center justify-center border">
             <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold">Recover Account</h1>
                <p className="py-6">
                    Please check your email account
                </p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email or Username</span>
                    </label>
                    <input onChange={handleChange} value={emailOrUsername} type="text" placeholder="Email or Username" className="input input-bordered"/>
                </div>
                    {message && (<ErrorMessage text= { message ?? ""}/>)}
                <div className="form-control mt-6">
                    <LoadingBtn loading={loading} onClick={sendRecoveryLink} label="Send recovery link" />
                    <CustomNavLink to="/login" text="Remember passowrd? Login"/>
                </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
