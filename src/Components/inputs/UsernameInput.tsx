import { FaCheckCircle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { useAppDispatch, useAppSelector } from "../../store";
import { checkUsernameAvailability, setUsernameAvailability, setUsernameErrorSignup, setUsernameSignup } from "../../store/auth/signupSlice";
import { useState } from "react";
import ErrorMessage from "../ErrorMessage";
import { usernameSchema } from "../../validators/zod";
const UsernameInput = () => {

    const available = useAppSelector(state => state.signup.usernameAvailable);
    const username = useAppSelector(state => state.signup.username);
    const usernameError = useAppSelector(state => state.signup.errors.username)
    const dispatch = useAppDispatch();


    const [ timeoutId, setTimeoutId ] = useState<NodeJS.Timeout>();

    const debounceCheck = (ursnm: string) => {
        clearTimeout(timeoutId);
        setTimeoutId(setTimeout(()=>{ 
            dispatch(checkUsernameAvailability({ username: ursnm })) 
        }, 1000));
    }
    
    const onUsernameChane = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setUsernameSignup(value));
        dispatch(setUsernameAvailability("typing"));
        const check = usernameSchema.safeParse(value);
        if(!check.success){
            dispatch(setUsernameAvailability("error"))
            console.log(check.error.errors[0].message)
            dispatch(setUsernameErrorSignup(check.error.errors[0].message))
        }else{
            debounceCheck(value);
            dispatch(setUsernameErrorSignup(""))
        }
    }

    return (
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Username</span>
                </label>
                {
                     available === "idle" ? 
                     <> <label className="input input-bordered flex items-center gap-2"> <input className="grow"  type="text" value={username} placeholder="username" onChange={onUsernameChane}/>
                     <span></span>
                    </label> </> :
                    available === "yes" ?
                    <> <label className="input input-bordered  input-success flex items-center gap-2"> <input className="grow"  type="text" value={username} placeholder="username" onChange={onUsernameChane}/>
                        <span className="text-success"> <FaCheckCircle /> </span>
                    </label> </> : 
                    available === "no"  || available === "error" ? 
                    <> <label className="input input-bordered  input-error flex items-center gap-2"> <input className="grow"  type="text" value={username} placeholder="username" onChange={onUsernameChane}/>
                        <span className="text-error"> <VscError /> </span>
                    </label> </> :
                    available === "loading" ? 
                    <> <label className="input input-bordered flex items-center gap-2 skeleton"> <input className="grow"  type="text" value={username} placeholder="username" onChange={onUsernameChane}/>
                        <span className="loading loading-ring loading-sm"></span>
                    </label> </> :
                    <> <label className="input input-bordered flex items-center gap-2 skeleton"> <input className="grow"  type="text" value={username} placeholder="username" onChange={onUsernameChane}/>
                        <span className="loading loading-ring loading-sm"></span>
                    </label> </>
                }
            {(usernameError && usernameError.length > 0 ) && (<ErrorMessage text= { usernameError ?? "" } />)} 
            </div>
        )
}
export default UsernameInput