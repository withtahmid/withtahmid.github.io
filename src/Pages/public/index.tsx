import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
const PublicRoute = ():ReactNode => {
    return <Outlet />
};
export default PublicRoute;