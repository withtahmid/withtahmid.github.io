import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { trpc } from "../../../trpc";
import { logResponse } from "../../../utils/responseHandlers/logResponse";
import { handleTRPCError } from "../../../utils/responseHandlers/handleTRPCError";
import { Response } from "../../../types/backend/types/response";
import { VerifyAccountResponse } from "../../../types/backend/types/response/auth";
const VerifyAccount = () => {
    const { urlParam } = useParams();
    const [ loading, setLoading ] = useState(false);
    const [ verified, setVerified ] = useState(false);
    const [ message, setMessage ] = useState<string | null>(null);
    const [error, setError ] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {

    }, [message]);

    useEffect(() => {

    }, [error]);

    const verifyAccount = async() => {
        
        if(!urlParam){
            return;
        }
        
        try {
            setLoading(true);
            var res:Response<VerifyAccountResponse> = await trpc.auth.verifyAccount.mutate(urlParam);
            logResponse(res);
        } catch (error) {
            return setError(handleTRPCError("Failed to verify account. Please try again.     ", error));
        }finally{
            setLoading(false);
        }

        setVerified(res.success);
        if(res.success){
            setMessage(res.message);
        }else if("errorCode" in res){
            setMessage(res.message)
        }else{
            setError(res.message);
        }
        
    }


    useEffect(() => {
        verifyAccount();
    }, [urlParam])

    return (
    <div className="min-h-screen flex items-center justify-center">
    <div className="text-3xl">
    {
        loading ? (<h1>Verifying account .....</h1>) : 
        verified ? (
            <div className="flex flex-col gap-2">
                <h1>{message ?? "Verification Successfull"}</h1>
                <button onClick={() => navigate("/login")} className="btn btn-primary">Login Now!</button>
            </div>

        ) :
        error ? (<h1 className="text-error">{error}</h1>) : 
        message ? (<h1 className="text-warning">{message}</h1>) : <></>
    }
    </div>
    </div>)
};
export default VerifyAccount;

