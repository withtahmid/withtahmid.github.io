import { ReactNode, useEffect, } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { fetchUserAsync } from "../../store/userSlice";
import Loading from "../../Components/Loading";

const LoggedInRoute = ():ReactNode => {
    const token = useAppSelector(state => state.core.token);
    // const isVerified = useAppSelector(state => state.user.isVerified)
    const state = useAppSelector(state => state.user.state);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if(token){
            console.log("Fetching user")
            dispatch(fetchUserAsync());
        }
    }, [token]);

    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <div className="border"><Navbar /></div>
            <main className="border-red-700 border-2 flex-grow relative overflow-auto">
            <div className="absolute top-0 bottom-0 left-0 right-0">
                {
                    state === "loading" ? <Loading /> : <Outlet />
                }
            </div>   
            </main>
        </div>
    )
};
export default LoggedInRoute;