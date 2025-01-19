import { HashRouter, Route, Routes } from "react-router-dom"
import NotLoggedInRoute from "./Pages/notLoggedIn"
import PublicRoute from "./Pages/public"
import Login from "./Pages/notLoggedIn/auth/Login"
import Signup from "./Pages/notLoggedIn/auth/Signup"
import RecoverAccount from "./Pages/notLoggedIn/auth/RecoverAccount"
import VerifyAccount from "./Pages/public/auth/VerifyAccount"
import ProtectedRoute from "./Pages/protected"
import Profile from "./Pages/protected/Profile"
import ForgotPassword from "./Pages/notLoggedIn/auth/ForgotPassword"
import NotFound from "./Pages/error/NotFound"
import Home from "./Pages/public/Home"
import MailReadReceipts from "./Pages/mailreadreceipts/components/Mailreadreceipts"

const Router = () => {
    return (
        <HashRouter >
            <Routes>
                
                <Route element = {<NotLoggedInRoute></NotLoggedInRoute>}>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/signup" element={<Signup />}/>
                    <Route path="/forgot-password/" element={<ForgotPassword />}/>
                    <Route path="/recover-account/:urlParam" element={<RecoverAccount />}/>
                </Route>

                <Route element={<ProtectedRoute></ProtectedRoute>}>
                    <Route path="/profile" element = {<Profile />}/>
                    <Route path="/mailreadreceipts" element={<MailReadReceipts />}/>
                </Route>

                <Route element = {<PublicRoute></PublicRoute>}>
                    <Route path="/verify-account/:urlParam" element={<VerifyAccount />}/>
                    <Route index element={<Home />}/>
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </HashRouter>
    )
}
export default Router;