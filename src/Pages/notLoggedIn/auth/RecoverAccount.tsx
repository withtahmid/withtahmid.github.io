import { useEffect, useState } from "react";
import ErrorMessage from "../../../Components/ErrorMessage";
import LoadingBtn from "../../../Components/buttons/LoadingBtn";
import { useAppDispatch } from "../../../store";
import { addToast } from "../../../store/toastSlice";
import PasswordInput from "../../../Components/inputs/PasswordInput";
import {  passwordSchema } from "../../../validators/zod";
import CustomNavLink from "../../../Components/CustomNavLink";
import { handleTRPCError } from "../../../utils/responseHandlers/handleTRPCError";
import { trpc } from "../../../trpc";
import { useParams } from "react-router-dom";
import { setToken } from "../../../store/auth/tokenSlice";
import { logResponse } from "../../../utils/responseHandlers/logResponse";

const RecoverAccount = ():React.ReactNode => {

    const { urlParam } = useParams();

    const [ password, setPassword ] = useState(""); 
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [ message, setMessage ] = useState<string | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    const [ passwordError, setPasswordError ] = useState<string | null>(null);
    const [ confirmPasswordError, setConfirmPasswordError ] = useState<string | null>(null);
    const [ passwordShowing, setPasswordShowing ] = useState(false);

    const [ loading, setLoading ] = useState(false);
    
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!loading && error){
            dispatch(addToast({ mesaage: error ?? "", type : "error" }))
        }
    }, [loading]);


    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
    }

    const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
    }

    const changePassword = async() => {
        const check = passwordSchema.safeParse(password);
        const confirmPasswordError_ = password !== confirmPassword ?  "Does not match with password." : null;
        if(check.error || confirmPasswordError_ ){
            if(check.error){
                setPasswordError(check.error.format()._errors[0])
            }else{
                setPasswordError(null)
            }
            setConfirmPasswordError(confirmPasswordError_)
            return;
        }
        setPasswordError(null);
        setConfirmPasswordError(null)

        try {
            setLoading(true);
            var res = await trpc.auth.recoverAccount.changePassword.mutate({ password, confirmPassword, urlParam: urlParam ?? "" });
            logResponse(res);
        } catch (error) {
            return setError(handleTRPCError("Failed to change password", error));
        }finally{
            setLoading(false);
        }

        if(res.success){
            const token = res.data.token;
            dispatch(setToken(token));
            dispatch(addToast({ mesaage: res.message, type: "success" }));
        }else if("errorCode" in res){
            setMessage(res.message);
        }else{
            setError(res.message);
        }

    }

    return (
        <div className="flex min-h-screen h-full w-full items-center justify-center border">
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
                        <span className="label-text">Password</span>
                    </label>
                    <PasswordInput
                        password={password} 
                        border={passwordError && passwordError.length > 0 ? "input-error" : ""} 
                        onPasswordChange={onPasswordChange} 
                        showing = {passwordShowing}
                        setShowing={setPasswordShowing}
                        placeholder = "Password"
                    /> 
                    {passwordError && passwordError.length > 0 && (<ErrorMessage text={passwordError}/>)}
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Confirm Password</span>
                    </label>
                    < PasswordInput
                        password={confirmPassword   } 
                        border={confirmPasswordError && confirmPasswordError.length > 0 ? "input-error" : ""} 
                        onPasswordChange={onConfirmPasswordChange} 
                        showing = {passwordShowing}
                        setShowing={setPasswordShowing}
                        placeholder = "Confirm Password"
                    /> 
                    {confirmPasswordError && confirmPasswordError.length > 0 && (<ErrorMessage text={confirmPasswordError}/>)}
                </div>
                    {message && (<ErrorMessage text= { message ?? ""}/>)}
                    <div className="form-control mt-6">
                        <LoadingBtn onClick={changePassword} loading = {loading} label="Change Password" />
                        <CustomNavLink to="/login" text="Remember passowrd? Login"/>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}
export default RecoverAccount;

