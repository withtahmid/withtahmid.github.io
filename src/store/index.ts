import {  configureStore} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { loginReducer } from "./auth/loginSlice";
import signupReducer from "./auth/signupSlice";
import toastReducer from "./toastSlice";
import userReducer from "./user/userSlice";
import tokenReducer from "./auth/tokenSlice";
import mailreadreceiptsReducer from "./mailreadreceipts";
export const store = configureStore({
    reducer: {
        login: loginReducer,
        signup: signupReducer,
        token: tokenReducer,
        toast: toastReducer,
        user: userReducer,
        mailredreceipts: mailreadreceiptsReducer,
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;