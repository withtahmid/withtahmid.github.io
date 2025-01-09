import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Toast, ToastType } from "../types/toast";
import { store } from ".";
const initialState: Toast[] = [];
const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers:{
        addToast: (state, action: PayloadAction<{ mesaage: string, type: ToastType}>) =>{
            const id = `${Date.now()}${Math.round(Math.random()*1000)}${Math.round(Math.random()*1000)}`
            const toast: Toast = {
                id: id,
                message: action.payload.mesaage,
                type: action.payload.type,
            }
            state.push(toast);
            setTimeout(()=>{
                store.dispatch(removeToast(id));
            }, 5000);
        },
        removeToast: (state, action: PayloadAction<string>) =>{
            return state.filter(t => t.id !== action.payload);
        }
    },
});

export const { addToast, removeToast }  = toastSlice.actions;
const toastReducer = toastSlice.reducer;
export default toastReducer;