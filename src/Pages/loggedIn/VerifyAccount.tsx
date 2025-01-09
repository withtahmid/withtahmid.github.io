import { useEffect, useState } from "react";
import ErrorMessage from "../../Components/ErrorMessage";
import LoadingBtn from "../../Components/LoadingBtn";
import { useAppDispatch, useAppSelector } from "../../store";
import { 
    fetchCanResendAt, 
    resendVerificationCode, 
    resetVerifyAccount, 
    setVerificationCode, 
    setVerifyAccountMessage, 
    verifyAccountAsync }
from "../../store/verifyAccountSlice";
import { addToast } from "../../store/toastSlice";
import { Navigate } from "react-router-dom";
import { setUserVerified } from "../../store/userSlice";

const VerifyAccount = () => {

    const verificationCode = useAppSelector(state => state.verifyAccount.verificationCode);
    const state = useAppSelector(state => state.verifyAccount.state)
    const error = useAppSelector(state => state.verifyAccount.error);
    const message = useAppSelector(state => state.verifyAccount.message);
    const verified = useAppSelector(state => state.verifyAccount.verified);
    const userVerified = useAppSelector(state => state.user.isVerified)
    const canResendCodeAt = useAppSelector(state => state.verifyAccount.canResendCodeAt)
    const [ countdown, setCountdown ] = useState(Math.max(0, Math.round((canResendCodeAt - Date.now()) / 1000)));

    const dispatch = useAppDispatch();
    useEffect(() => {
        if(verified){
            dispatch(setUserVerified(true));
            dispatch(addToast({ mesaage: "Account Verification Successfull", type: "success" }));
        }
    }, [verified]);

    useEffect(() => {
        dispatch(fetchCanResendAt());
        dispatch(resetVerifyAccount());
    }, []); 

    useEffect(() => {
        const id = setInterval(() => {
            setCountdown(Math.max(0, Math.round((canResendCodeAt - Date.now()) / 1000)));
        });
        return () => clearInterval(id);
    }, [canResendCodeAt])

    useEffect(() => {
        if(error){
            dispatch(addToast({ mesaage: error, type: "error" }));
        }
    }, [error])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(value.length <= 6 && !isNaN(Number(value))){
            dispatch(setVerificationCode(value))
        }
    }

    const verifyAccount = () => {
        if(verificationCode.length === 6){
            dispatch(verifyAccountAsync({ verificationCode }));
        }else{
            dispatch(setVerifyAccountMessage("Enter 6 digit verification code"));
        }
    }

    const resendCode = () => {
        dispatch(resendVerificationCode());
    }

    if(userVerified){
        return <Navigate to={"/"} replace/>
    }

    return (
        <div className="flex min-h-full h-full w-full items-center justify-center border">
             <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold">Verify Account</h1>
                <p className="py-6">
                    Please check your email account
                </p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                    <div className="form-control">
                    <label className="label">
                        <span className="label-text">Verification Code</span>
                    </label>
                    <input onChange={handleChange} value={verificationCode} type="email" placeholder="Verification Code" className="input input-bordered"/>
                    <div className="flex justify-between mx-2">
                        {
                        state === "resending" ? (<label className="text-sm">Sending code ....</label>) :
                        countdown === 0 ? (<button onClick={resendCode} className="my-1 label-text cursor-pointer hover:underline" disabled={countdown > 0}>Resend Code</button>):
                        (<label className="text-sm">Resend code after {countdown} seconds</label>)
                        }
                    </div>
                    </div>
                    <ErrorMessage text= { message ?? ""}/>
                    <div className="form-control mt-6">
                        <LoadingBtn onClick={verifyAccount} loading = {state === "loading"} label="Verify Account" />
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};
export default VerifyAccount;
