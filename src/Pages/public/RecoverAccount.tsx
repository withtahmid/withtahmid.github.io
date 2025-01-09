import { useEffect, useState } from "react";
import ErrorMessage from "../../Components/ErrorMessage";
import LoadingBtn from "../../Components/LoadingBtn";
import { useAppDispatch, useAppSelector } from "../../store";
import { resetAccountRecovery, sendAccountRecoveryCode, setConfirmPasswordErrorFP, setConfirmPasswordFP, setEmailOrUsernameFP, setPasswordErrorFP, setPasswordFP, setVerificationCodeErrorFP, setVerificationCodeFP, submitAccountRecoveryCode } from "../../store/recoverAccountSlice";
import { addToast } from "../../store/toastSlice";
import PasswordInput from "../../Components/PasswordInput";
import {  passwordSchema } from "../../validators/zod";
import CustomNavLink from "../../Components/CustomNavLink";
const FindAccount = () => {
    const emailOrUsername = useAppSelector(state => state.recoverAccount.emailOrUsername);
    const dispatch = useAppDispatch();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setEmailOrUsernameFP(value));
    }
    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text">Email or Username</span>
            </label>
            <input onChange={handleChange} value={emailOrUsername} type="text" placeholder="Email or Username" className="input input-bordered"/>
        </div>
    )
}

const SubmitCode = () => {
    const password = useAppSelector(state => state.recoverAccount.password);
    const confirmPassword = useAppSelector(state => state.recoverAccount.confirmPassword);
    const verificationCode = useAppSelector(state => state.recoverAccount.verificationCode);

    const [ showing, setShowing ] = useState(false);
    
    const passwordError = useAppSelector(state => state.recoverAccount.errors.password);
    const confirmPasswordError = useAppSelector(state => state.recoverAccount.errors.confirmPassword);
    const verificationCodeError = useAppSelector(state => state.recoverAccount.errors.verificationCode)

    const dispatch = useAppDispatch ()

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setPasswordFP(value));
    }   
    const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setConfirmPasswordFP(value));
    }
    const onVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(value.length <= 6 && !isNaN(Number(value))){
            dispatch(setVerificationCodeFP(value));
        }
    }

    return(
        <>
        <div className="form-control">
            <label className="label">
                <span className="label-text">Verification Code</span>
            </label>
            <input onChange={onVerificationCodeChange} value={verificationCode} type="text" placeholder="Verification Code" className="input input-bordered"/>
            {verificationCodeError && verificationCodeError.length > 0 && (<ErrorMessage text={verificationCodeError}/>)}
        </div>
         <div className="form-control">
            <label className="label">
                <span className="label-text">Password</span>
            </label>
            <PasswordInput
                password={password} 
                border={passwordError && passwordError.length > 0 ? "input-error" : ""} 
                onPasswordChange={onPasswordChange} 
                showing = {showing}
                setShowing={setShowing}
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
                showing = {showing}
                setShowing={setShowing}
                placeholder = "Confirm Password"
            /> 
            {confirmPasswordError && confirmPasswordError.length > 0 && (<ErrorMessage text={confirmPasswordError}/>)}
        </div>

        </>
    )
}

const RecoverAccount = ():React.ReactNode => {

    const password = useAppSelector(state => state.recoverAccount.password);
    const confirmPassword = useAppSelector(state => state.recoverAccount.confirmPassword);
    const verificationCode = useAppSelector(state => state.recoverAccount.verificationCode);

    const message = useAppSelector(state => state.recoverAccount.message);
    const error = useAppSelector(state => state.recoverAccount.error);
    // const responseError = useAppSelector(state => state.recoverAccount.errors.response)
    const state = useAppSelector(state => state.recoverAccount.state);
    const emailSent = useAppSelector(state => state.recoverAccount.emailSent);
    const emailOrUsername = useAppSelector(state => state.recoverAccount.emailOrUsername);
    const canResendCodeAt = useAppSelector(state => state.recoverAccount.canResendCodeAt)

    const [ countdown, setCountdown ] = useState(Math.max(0, Math.round((canResendCodeAt - Date.now()) / 1000)));

    const dispatch = useAppDispatch();

    useEffect(() => {
        if(error && error.length > 0){
            dispatch(addToast({ mesaage: error ?? "", type : "error" }))
        }
    }, [error])

    useEffect(() => {
        dispatch(resetAccountRecovery())
    }, [])

    useEffect(() => {
        const id = setInterval(() => {
            setCountdown(Math.max(0, Math.round((canResendCodeAt - Date.now()) / 1000)));
        });
        return () => clearInterval(id);
    }, [canResendCodeAt])

    const sendCode = () => {
        dispatch(sendAccountRecoveryCode({ emailOrUsername }))
    }

    const submitCode = () => {
        const check = passwordSchema.safeParse(password);
        const confirmPasswordError_ = password !== confirmPassword ?  "Does not match with password." : null;
        const verificationCodeError_ = verificationCode.length !== 6 ? "Verification code must be 6 digit long" :  null;
        if(check.error || confirmPasswordError_ || verificationCodeError_){
            if(check.error){
                dispatch(setPasswordErrorFP(check.error.format()._errors[0]));
            }
            console.log(confirmPasswordError_)
            dispatch(setConfirmPasswordErrorFP(confirmPasswordError_));
            dispatch(setVerificationCodeErrorFP(verificationCodeError_));
            return;
        }
        dispatch(setPasswordErrorFP(null));
        dispatch(setConfirmPasswordErrorFP(null));
        dispatch(setVerificationCodeErrorFP(null));

        dispatch(submitAccountRecoveryCode({ emailOrUsername,  verificationCode, password, dispatch }))
    }

    const resendCode = () => {
        dispatch(sendAccountRecoveryCode({ emailOrUsername }))
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
                    {/* {emailSent&&(<h1>Code is sent to <strong>{emailSent}</strong></h1>)} */}
                    {
                        emailSent ? <SubmitCode /> : <FindAccount />
                     }
                    {emailSent && (<div className="flex justify-between mx-2">
                        {
                        state === "resending" ? (<label className="text-sm">Sending code ....</label>) :
                        countdown === 0 ? (<button onClick={resendCode} className="my-1 label-text cursor-pointer hover:underline" disabled={countdown > 0}>Resend Code</button>):
                        (<label className="text-sm">Resend code after {countdown} seconds</label>)
                        }
                    </div>)}
                    {message && (<ErrorMessage text= { message ?? ""}/>)}
                    <div className="form-control mt-6">
                        <LoadingBtn onClick={emailSent ? submitCode :  sendCode} loading = {state === "loading"} label={emailSent ? "Change Password" : "Send Code"} />
                        <CustomNavLink to="/login" text="Remember passowrd? Login"/>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}
export default RecoverAccount;