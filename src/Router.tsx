import { HashRouter, Route, Routes } from "react-router-dom"
import Login from "./Pages/public/Login"
import Signup from "./Pages/public/Signup"
import RecoverAccount from "./Pages/public/RecoverAccount"
import Home from "./Pages/protected/Home"
import PublicRoute from "./Pages/public/PublicRoute"
import ProtectedRoute from "./Pages/protected/ProtectedRoute"
import LoggedInRoute from "./Pages/loggedIn/LoggedInRoute"
import VerifyAccount from "./Pages/loggedIn/VerifyAccount"

const Router = () => {
    return (
        <HashRouter >
            <Routes>
                
                <Route element = {<PublicRoute ></PublicRoute>}>
                    <Route path = "login" element = {<Login />}/>
                    <Route path="signup" element={<Signup />}/>
                    <Route path="recover-account" element={<RecoverAccount />}/>
                </Route>

                <Route element = {<LoggedInRoute></LoggedInRoute>}>
                    <Route path="verify-account" element={<VerifyAccount/>} />
                    <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
                </Route>

            </Routes>
        </HashRouter>
    )
}
export default Router;