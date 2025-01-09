import {  configureStore} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { loginReducer } from "./loginSlice";
import coreReducer from "./coreSlice";
import signupReducer from "./signupSlice";
import toastReducer from "./toastSlice";
import userReducer from "./userSlice";
import verifyAccountReducer from "./verifyAccountSlice";
import recoverAccountReducer from "./recoverAccountSlice";

export const store = configureStore({
    reducer: {
        login: loginReducer,
        signup: signupReducer,
        core: coreReducer,
        toast: toastReducer,
        user: userReducer,
        verifyAccount: verifyAccountReducer,
        recoverAccount: recoverAccountReducer,
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;