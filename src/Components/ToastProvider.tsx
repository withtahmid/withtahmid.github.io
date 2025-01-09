import { ReactNode } from "react";
import { useAppSelector } from "../store";
import Toast from "./Toast";
const ToastProvider = ( { children }: { children: ReactNode } ) => {
    const toasts = useAppSelector(state => state.toast);
    return (
        <>
        {children}
        {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type}/>)}
        </>
    )
};
export default ToastProvider;