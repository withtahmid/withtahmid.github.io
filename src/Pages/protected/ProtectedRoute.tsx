import React, { ReactNode } from "react";
import { useAppSelector } from "../../store";
import { Navigate } from "react-router-dom";
import Broken from "../error/Broken";
const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }):ReactNode => {
    const token = useAppSelector(state => state.core.token);
    const isVerified = useAppSelector(state => state.user.isVerified);
    const userState = useAppSelector(state => state.user.state)
    if(!token){
        return <Navigate to={"/login"}/>
    }
    if(userState === "error"){
        return <Broken/>
    }
    else if(!isVerified && userState === "success"){
        return <Navigate to={"/verify-account"}/>
    }
    
    return (
        <>
        {children}
        </>
    );
};
export default ProtectedRoute;  