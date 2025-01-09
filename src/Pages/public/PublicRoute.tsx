import { ReactNode } from "react";
import { useAppSelector } from "../../store";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ():ReactNode => {
    const token = useAppSelector(state => state.core.token);
    if(token){
        return <Navigate to={"/"}/>
    }
    return <Outlet />
};
export default PublicRoute;