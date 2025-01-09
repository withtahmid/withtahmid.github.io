import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TRPCClientError } from "@trpc/client";
import { trpc } from "../trpc";
import { LoginResponse } from "../types/backend/types/response";
import { authTokenKey } from "../config";
import { setToken } from "./coreSlice";

interface LoginFormSchema {
    emailOrUsername: string;
    password: string;
    showPassword: boolean;
    state: "idle" | "success" | "error" | "loading";
    message: string;
    error: string;
}

const initialState: LoginFormSchema = {
    emailOrUsername: "",
    password: "",
    showPassword: false,
    state: "idle",
    message: "",
    error: "",
}

export const loginAsync = createAsyncThunk<LoginResponse,  { emailOrUsername: string; password: string, dispatch: any }, { rejectValue: string }>(
    "login/loginAsync",
    async({ emailOrUsername, password, dispatch }, { rejectWithValue }) => {
        try {
            const res = await trpc.login.mutate({ emailOrUsername, password});
            if (res.token) {
                localStorage.setItem(authTokenKey, res.token);
                dispatch(setToken(res.token));
            }
            return res;
        } catch (error) {
            if(error instanceof TRPCClientError){
                return rejectWithValue(error.message);
            }
        }
        return rejectWithValue("Login failed");
    }
)

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        resetlogin: (state) => {
            state.emailOrUsername = state.password = state.error = state.message  = "";
            state.state = "idle";
        },
        setEmailOrUsername: (state, action:PayloadAction<string> ) => {
            state.emailOrUsername = action.payload;
        },
        setPasswordLogin: (state, action: PayloadAction<string>) =>{
            state.password = action.payload;
        },
        setShowPasswordLogin: (state, action: PayloadAction<boolean>) => {
            state.showPassword = action.payload;
        },
        setMessageLogin: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginAsync.pending, (state) => {
            state.state = "loading";
            state.error = state.message = "";
        })
        .addCase(loginAsync.rejected, (state, action )=> {
            state.error = action.payload ?? "Login failed";
            state.state ="error"
        })
        .addCase(loginAsync.fulfilled, (state, action) => {
            state.state = "success";
            state.error = action.payload.error ?? "";
            state.message = action.payload.message ?? "";
        });
    }
});

export const { setEmailOrUsername, setPasswordLogin, resetlogin, setMessageLogin, setShowPasswordLogin} = loginSlice.actions;
export const loginReducer = loginSlice.reducer;