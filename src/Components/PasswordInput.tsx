import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
const PasswordInput = ({ password, onPasswordChange, border, showing, setShowing, placeholder }: { password: string, placeholder: string, onPasswordChange: any, border?:string, showing:boolean, setShowing: any, }) => {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
    const toggleShowing = () => {
        clearTimeout(timeoutId);
        setShowing(!showing);
        setTimeoutId(setTimeout(()=> setShowing(false), 2 * 1000));
    }
    return (
        <div className="form-control">
            <label className={`input input-bordered flex items-center gap-2 ${border ?? ""}`}>
            <input className="grow"   type = { showing ? "text" : "password" } value={password} placeholder={placeholder} onChange={onPasswordChange}/>
                <button onClick={toggleShowing}> {showing ? <FaEyeSlash /> : <FaEye/> } </button>
            </label>
        </div>
    )
}
export default PasswordInput;