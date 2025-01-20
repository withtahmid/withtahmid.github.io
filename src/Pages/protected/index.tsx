import { ReactNode, useEffect, } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { Navigate, Outlet, useLocation} from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { fetchUserAsync } from "../../store/user/userSlice";

const ProtectedRoute = ():ReactNode => {
    const token = useAppSelector(state => state.token.token);
    const location = useLocation();
    const dispatch = useAppDispatch();
    useEffect(() => {
        if(token){
            dispatch(fetchUserAsync());
        }
    }, [token]);

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <div><Navbar /></div>
            <main className="flex-grow relative overflow-auto bg-base-100">
            <div className="absolute top-0 bottom-0 left-0 right-0">
                <Outlet />
            </div>   
            </main>
        </div>
    )
};

export default ProtectedRoute;