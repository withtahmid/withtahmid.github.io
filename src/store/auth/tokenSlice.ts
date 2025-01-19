import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authTokenKey } from "../../config";
interface CoreState { token: string | null; }

const initialState: CoreState = {
    token: localStorage.getItem(authTokenKey),
}
const tokenSlice = createSlice({
    name: "core",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
            localStorage.setItem(authTokenKey, action.payload ?? "");   
        },
        clearToken: (state) => {
            localStorage.removeItem(authTokenKey);
            state.token = null;
        }
    }
});

export const { setToken, clearToken } = tokenSlice.actions;
const tokenReducer = tokenSlice.reducer;
export default tokenReducer;