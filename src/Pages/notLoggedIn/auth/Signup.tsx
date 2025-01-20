import ErrorMessage from "../../../Components/ErrorMessage";
import LoadingBtn from "../../../Components/buttons/LoadingBtn";
import PasswordInput from "../../../Components/inputs/PasswordInput";
import UsernameInput from "../../../Components/inputs/UsernameInput";
import { useAppDispatch, useAppSelector } from "../../../store";
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
    signupAsync } from "../../../store/auth/signupSlice";

import { parseZodError, signupFormSchema } from "../../../validators/zod";
import { useEffect } from "react";
import { addToast } from "../../../store/toastSlice";
import CustomNavLink from "../../../Components/CustomNavLink";
import { useNavigate } from "react-router-dom";


const Modal = ({ email }: { email: string }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const closeModal = () => {
        dispatch(resetSignup());
        const modal = document.getElementById("signupSuccessModal") as HTMLDialogElement;
        if (modal) {
            modal.close();
        }
        navigate("/login");
    }
    return (
        <dialog id="signupSuccessModal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Signup Successfull!</h3>
            <p className="py-4">Account verification email has been sent to <strong>{email}</strong>.</p>
            <div className="modal-action">
              <form method="dialog">
                <button onClick={closeModal} className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>)
}

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
    const done = useAppSelector(state => state.signup.done);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(resetSignup());
    }, []);

    useEffect(() => {
        if(done){
            const modal = document.getElementById("signupSuccessModal") as HTMLDialogElement;
            if (modal) {
                modal.showModal();
            }
        }
    }, [done])

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
        const formData = { username, name, email, password, confirmPassword };
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
        dispatch(signupAsync(formData));
    }

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold">Signup now!</h1>
                <p className="py-6">
                Hey there, ready to join the fun? Sign up and let’s make some magic happen together. 'The best way to predict the future is to create it.' — ChatGPT
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
            <Modal email={email}/>
        </div>
    )
}
export default Signup;