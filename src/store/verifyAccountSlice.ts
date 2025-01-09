import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResendCodeResponse, VerifyAccountResponse } from "../types/backend/types/response";
import { trpc } from "../trpc";

interface VerifyAccountFormState{
    canResendCodeAt: number;
    verificationCode: string;
    error: string | null;
    message: string | null;
    state: "idle" | "success" | "error" | "loading" | "resending"
    verified: boolean;
}

const initialState: VerifyAccountFormState = {
    canResendCodeAt: 0,
    verificationCode: "",
    error: null,
    message: null,
    state: "idle",
    verified: false,
}

export const resendVerificationCode = createAsyncThunk<ResendCodeResponse, undefined, { rejectValue: string }>(
    "verifyAccount/resendCode",
    async(_, { rejectWithValue }) => {
        try{
            const res = await trpc.verifyAccount.resendCode.mutate();
            return res;
        } catch (error) {
            return rejectWithValue("Verification Failed");            
        }
    }
)

export const verifyAccountAsync = createAsyncThunk<VerifyAccountResponse, { verificationCode: string }, { rejectValue: string }>(
    "verifyAccount/verify",
    async({ verificationCode }, { rejectWithValue }) => {
        try {
            const res = await trpc.verifyAccount.submitCode.mutate(verificationCode);
            return res;
        } catch (error) {
            return rejectWithValue("Verification Failed");            
        }
    }
);

export const fetchCanResendAt = createAsyncThunk<ResendCodeResponse, undefined, { rejectValue: string }>(
    "verifyAccount/fetchCanResendAt",
    async(_, { rejectWithValue }) => {
        try {
            return await trpc.canResendCode.query();
        } catch (error) {
            return rejectWithValue("Faild to connect");
        }
    }
)

const verifyAccountSlice = createSlice({
    name: "verifyAccount",
    initialState,
    reducers:{
        setVerificationCode: (state, action: PayloadAction<string>) => {
            state.verificationCode = action.payload;
        },
        setVerifyAccountMessage: (state, action: PayloadAction<string | null>) => {
            state.message = action.payload;
        },
        resetVerifyAccount: (state) => {
            state.verificationCode = "";
            state.error = null;
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(verifyAccountAsync.pending, (state) => {
            state.state = "loading";
        })
        .addCase(verifyAccountAsync.rejected, (state, action) => {
            state.state = "error";
            state.error = action.payload ?? "Verification Failed";
        })
        .addCase(verifyAccountAsync.fulfilled, (state, action) => {
            state.message = action.payload.message ?? null;
            state.error = action.payload.error ?? null;
            state.verified = action.payload.success;
            state.state = "success";
        })

        .addCase(resendVerificationCode.pending, (state) => {
            state.state = "resending";
        })
        .addCase(resendVerificationCode.rejected, (state, action) => {
            state.state = "error";
            state.error = action.payload ?? "Verification Failed";
        })
        .addCase(resendVerificationCode.fulfilled, (state, action) => {
            state.message = action.payload.message ?? null;
            state.error = action.payload.error ?? null;
            state.canResendCodeAt = action.payload.canResendAt;
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

const verifyAccountReducer = verifyAccountSlice.reducer;
export default verifyAccountReducer;
export const { setVerificationCode, resetVerifyAccount, setVerifyAccountMessage } = verifyAccountSlice.actions;