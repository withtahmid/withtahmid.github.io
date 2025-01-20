import { Navigate, Outlet} from "react-router-dom"
import { useAppSelector } from "../../store"

const NotLoggedInRoute = () => {
    const token = useAppSelector(state => state.token.token);
    if(token){
        return <Navigate to={"/home"}/>
    }
    return <Outlet />
}
export default NotLoggedInRoute;