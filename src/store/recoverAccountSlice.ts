import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { trpc } from "../trpc";
import { AccountRecoveryCodeSendResponse, SubmitAccountVerificationCodeResponse } from "../types/backend/types/response";
import { fetchCanResendAt } from "./verifyAccountSlice";
import { authTokenKey } from "../config";
import { setToken } from "./coreSlice";

interface ForgotPasswordState{
    canResendCodeAt: number;
    emailOrUsername: string;
    verificationCode: string;
    emailSent: string | null;
    state: "idle" | "success" | "error" | "loading" | "resending";
    message: string | null;
    error: string | null;

    password: string;
    confirmPassword: string;

    errors: { 
        verificationCode: string | null;
        password: string | null;
        confirmPassword: string | null;
        response: string | null;

    }
}

const initialState: ForgotPasswordState = {
    canResendCodeAt: 0,
    emailOrUsername: "",
    verificationCode: "",
    emailSent: null,
    state: "idle",
    message: null,
    error: null,
    password: "",
    confirmPassword: "",

    errors: { 
        verificationCode:  null,
        password:  null,
        confirmPassword:  null,
        response: null,
    }
}

export const sendAccountRecoveryCode = createAsyncThunk<AccountRecoveryCodeSendResponse, { emailOrUsername: string }, { rejectValue: string }>(
    "recoverAccount/sendCode",
    async({  emailOrUsername }, { rejectWithValue }) => {
        try {
            const res = await trpc.recoverAccount.sendCode.mutate({ emailOrUsername });
            return res;
        } catch (error) {
            return rejectWithValue("Faiild to send code");
        }
    }
)

export const submitAccountRecoveryCode = createAsyncThunk<SubmitAccountVerificationCodeResponse, { emailOrUsername: string, password: string, verificationCode: string, dispatch: any }, { rejectValue: string }>(
    "recoverAccount/submitCode",
    async({  emailOrUsername, password, verificationCode, dispatch }, { rejectWithValue }) => {
        try {
            const res = await trpc.recoverAccount.submitCode.mutate({ emailOrUsername, password, verificationCode });
            if (res.token) {
                localStorage.setItem(authTokenKey, res.token);
                dispatch(setToken(res.token));
            }
            return res;
        } catch (error) {
            return rejectWithValue("Faiild to send code");
        }
    }
)

const recoverAccountSlice = createSlice({
    name: "recoverAccount",
    initialState,
    reducers: {
        resetAccountRecovery: (state) => {
            state.verificationCode = state.password = state.confirmPassword = "";
            state.message = state.error = null;
            state.errors = { verificationCode: null, password: null, confirmPassword: null, response: null };
            state.state = "idle";
            state.emailSent = null;
        },
        setEmailOrUsernameFP: (state, action:PayloadAction<string> ) => {
            state.emailOrUsername = action.payload;
        },
        setVerificationCodeFP: (state, action:PayloadAction<string> ) => {
            state.verificationCode = action.payload;
        },
        setPasswordFP: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
        setConfirmPasswordFP: (state, action: PayloadAction<string>) => {
            state.confirmPassword = action.payload;
        },
        setEmailSent: (state, action:PayloadAction<string | null> ) => {
            state.emailSent = action.payload;
        },
        setPasswordErrorFP: (state, action:PayloadAction<string | null> )=>{
            state.errors.password = action.payload;
        },
        setConfirmPasswordErrorFP: (state, action: PayloadAction<string | null>) => {
            state.errors.confirmPassword = action.payload;
        },
        setVerificationCodeErrorFP: (state, action: PayloadAction<string | null>)=>{
            state.errors.verificationCode = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(sendAccountRecoveryCode.pending, (state) => {
            state.state = "loading";
        })
        .addCase(sendAccountRecoveryCode.rejected, (state, action) => {
            state.state = "error";
            state.error = action.payload ?? "Somwthing went wrong";
        })
        .addCase(sendAccountRecoveryCode.fulfilled, (state, action) => {
            const res = action.payload;
            state.message = res.message ?? null
            state.error = res.error ?? null;
            state.canResendCodeAt = res.canResendAt;
            state.emailSent = res.emailSent;
            state.state = "success";
        })
        .addCase(submitAccountRecoveryCode.pending, (state) => {
            state.state = "loading";
        })
        .addCase(submitAccountRecoveryCode.rejected, (state, action) => {
            state.state = "error";
            state.error = action.payload ?? "Something went wrong";
        })
        .addCase(submitAccountRecoveryCode.fulfilled, (state, action) => {
            const res = action.payload;
            state.message = res.message ?? null
            state.error = res.error ?? null;
            state.state = "success";
        })

        .addCase(fetchCanResendAt.rejected, (state, action) => {
            state.state = "error";
            state.error = action.payload ?? "Server Error";
        })
        .addCase(fetchCanResendAt.fulfilled, (state, action) => {
            state.message = action.payload.message ?? null;
            state.error = action.payload.error ?? null;
            state.canResendCodeAt = action.payload.canResendAt;
            state.state = "success";
        });
    }
});
const recoverAccountReducer = recoverAccountSlice.reducer;
export default recoverAccountReducer;
export const  { 
    resetAccountRecovery,
    setEmailOrUsernameFP,
    setVerificationCodeFP, 
    setEmailSent,
    setPasswordFP,
    setConfirmPasswordFP,
    setPasswordErrorFP,
    setConfirmPasswordErrorFP,
    setVerificationCodeErrorFP
} = recoverAccountSlice.actions;
