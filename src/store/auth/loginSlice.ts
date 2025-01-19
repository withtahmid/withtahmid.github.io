import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { trpc } from "../../trpc";
import { setToken } from "./tokenSlice";
import { Response } from "../../types/backend/types/response";
import { LoginResponse } from "../../types/backend/types/response/auth";
import { handleTRPCError } from "../../utils/responseHandlers/handleTRPCError";
import { logResponse } from "../../utils/responseHandlers/logResponse";

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

export const loginAsync = createAsyncThunk<Response<LoginResponse>,  { emailOrUsername: string; password: string, dispatch: any }, { rejectValue: string }>(
    "login/loginAsync",
    async({ emailOrUsername, password, dispatch }, { rejectWithValue }) => {
        try {
            var res =  await trpc.auth.login.mutate({ emailOrUsername, password});
            logResponse(res);
            if(res.success){
                dispatch(setToken(res.data.token));
            }

        } catch (error) {
            return rejectWithValue(handleTRPCError("Login failed", error));
        }
        return res;
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
            const response = action.payload;
            if(response.success){
                state.message = response.message;
            }else if("errorCode" in response){
                state.message = response.message;
            }else {
                state.error = response.message;
            }
        });
        }
});

export const { setEmailOrUsername, setPasswordLogin, resetlogin, setMessageLogin, setShowPasswordLogin} = loginSlice.actions;
export const loginReducer = loginSlice.reducer;