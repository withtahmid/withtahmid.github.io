import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authTokenKey } from "../config";
interface CoreState{
    token: string | null;
}

const initialState: CoreState = {
    token: localStorage.getItem(authTokenKey),
}
const coreSlice = createSlice({
    name: "core",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
        },
        clearToken: (state) => {
            localStorage.removeItem(authTokenKey);
            state.token = null;
        }
    }
});

export const { setToken, clearToken } = coreSlice.actions;
const coreReducer = coreSlice.reducer;
export default coreReducer;