import ErrorMessage from "../../Components/ErrorMessage";
import LoadingBtn from "../../Components/LoadingBtn";
import PasswordInput from "../../Components/PasswordInput";
import UsernameInput from "../../Components/UsernameInput";
import { useAppDispatch, useAppSelector } from "../../store";
import { 
    resetSignup, 
    setConfirmPasswordErrorSignup,
    setConfirmPasswordSignup, 
    setEmailErrorSignup, 
    setEmailSignup, 
    setNameErrorSignup, 
    setNameSignup, 
    setPasswordErrorSignup, 
    setPasswordSignup, 
    setShowPasswordSignup,
    signupAsync } from "../../store/signupSlice";

import { parseZodError, signupFormSchema } from "../../validators/zod";
import { useEffect } from "react";
import { addToast } from "../../store/toastSlice";
import CustomNavLink from "../../Components/CustomNavLink";

const Signup = ():React.ReactNode => {

    const username = useAppSelector(state => state.signup.username);
    const email = useAppSelector(state => state.signup.email);
    const name = useAppSelector(state => state.signup.name);
    const password = useAppSelector(state => state.signup.password);
    const confirmPassword = useAppSelector(state => state.signup.confirmPassword);
    const state = useAppSelector(state => state.signup.state);
    const message = useAppSelector(state => state.signup.message);
    const error = useAppSelector(state => state.signup.error);
    const usernameAvailable = useAppSelector(state => state.signup.usernameAvailable);
    const nameError = useAppSelector(state => state.signup.errors.name);
    const emailError = useAppSelector(state => state.signup.errors.email);
    const passwordError = useAppSelector(state => state.signup.errors.password);
    const confirmPasswordError = useAppSelector(state => state.signup.errors.confirmPassword);
    const showPassword = useAppSelector(state => state.signup.showPassword);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(resetSignup());
    }, []);

    useEffect(() => {
           if(error.length > 0){
               dispatch(addToast({ mesaage: error, type: "error" }));
           }
    }, [error]);

    const setShowPassword = (val: boolean) => {
        dispatch(setShowPasswordSignup(val));
    }


    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setNameSignup(value));
    }
    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setEmailSignup(value));
    }

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setPasswordSignup(value));
    }

    const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setConfirmPasswordSignup(value));
    }

    const onSignupClick = () => {   
        const formData = { username, name, email, password };
        const check = signupFormSchema.safeParse(formData);
        const confirmPasswordError_ = password !== confirmPassword ?  "Does not match with password." : null;
        if(!check.success || confirmPasswordError_){
            dispatch(setConfirmPasswordErrorSignup(confirmPasswordError_));
            try {
                const errors = parseZodError(check);
                dispatch(setNameErrorSignup(errors.name ?? null));
                dispatch(setEmailErrorSignup(errors.email ?? null));
                dispatch(setPasswordErrorSignup(errors.password ?? null));
            } catch (error) {
                console.error(error);   
            }
            return;
        }

        dispatch(setConfirmPasswordErrorSignup(null));
        dispatch(setNameErrorSignup(null));
        dispatch(setEmailErrorSignup(null));
        dispatch(setPasswordErrorSignup(null));

        if(usernameAvailable !== "yes"){
            console.error("should not reach here");
            return;
        }

        dispatch(signupAsync({ ...formData, dispatch }));
    }

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold">Signup now!</h1>
                <p className="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                quasi. In deleniti eaque aut repudiandae et a id nisi.
                </p>
            </div>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                    <UsernameInput />
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input className={`input input-bordered ${nameError && nameError.length > 0 ? "input-error" : ""}`} type= "text" value={name} placeholder="Name" onChange={onNameChange}/>
                        {nameError && nameError.length > 0 && (<ErrorMessage text={nameError}/>)}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input className={`input input-bordered ${emailError && emailError.length > 0 ? "input-error" : ""}`} type= "text" value={email} placeholder="Email" onChange={onEmailChange}/>
                        {emailError && emailError.length > 0 && (<ErrorMessage text={emailError}/>)}
                    </div>
                    
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <PasswordInput 
                            password={password} 
                            border={passwordError && passwordError.length > 0 ? "input-error" : ""} 
                            onPasswordChange={onPasswordChange} 
                            showing = {showPassword}
                            setShowing={setShowPassword}
                            placeholder = "Password"
                        /> 
                        {passwordError && passwordError.length > 0 && (<ErrorMessage text={passwordError}/>)}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Confirm Password</span>
                        </label>
                        <PasswordInput 
                            password={confirmPassword   } 
                            border={confirmPasswordError && confirmPasswordError.length > 0 ? "input-error" : ""} 
                            onPasswordChange={onConfirmPasswordChange} 
                            showing = {showPassword}
                            setShowing={setShowPassword}
                            placeholder = "Confirm Password"
                        /> 
                        {confirmPasswordError && confirmPasswordError.length > 0 && (<ErrorMessage text={confirmPasswordError}/>)}
                    </div>

                    <ErrorMessage text ={message}/>
                    <div className="form-control mt-6">
                        <LoadingBtn loading= {state === "loading"} label="Signup" onClick = {onSignupClick}/>
                    </div>
                    <CustomNavLink to="/login" text="Already have an account? Login"/>
                </div>
            </div>
            </div>
        </div>
    )
}
export default Signup;