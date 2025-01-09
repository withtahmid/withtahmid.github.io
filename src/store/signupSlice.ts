import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { trpc } from "../trpc";
import { TRPCClientError } from "@trpc/client";
import { SignupResponse } from "../types/backend/types/response";
import { setToken } from "./coreSlice";
import { authTokenKey } from "../config";

interface SignupFormState{
    username: string;
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    state: "idle" | "success" | "error" | "loading";
    error: string;
    message: string;
    usernameAvailable: "idle" | "loading" | "error" | "yes" | "no" | "typing"

    errors: {
        username: string | null;
        name: string | null;
        email: string | null;
        password: string | null;
        confirmPassword: string | null;
    },
}

const initialState: SignupFormState = {
    username: "",
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    showPassword : false,
    state: "idle",
    error: "",
    message: "",
    usernameAvailable: "idle",

    errors: {
        username: null,
        name: null,
        email: null,
        password: null,
        confirmPassword: null,
    },
}

export const checkUsernameAvailability = createAsyncThunk<boolean, { username: string }, { rejectValue: string }>(
    "signup/checkusernameAvailable",
    async({ username }, { rejectWithValue } ) => {
        try {
            return await trpc.usernameAvailable.query( username );
        } catch (error) {
            if(error instanceof TRPCClientError){
                return rejectWithValue(error.message);
            }
        }
        return false;
    }  
)

export const signupAsync = createAsyncThunk<SignupResponse, { username: string, name: string, email: string, password: string, dispatch: any }, { rejectValue: string } >(
    "signup/async",
    async({ username, name, email, password, dispatch }, { rejectWithValue }) => {
        try {
            const res = await trpc.signup.mutate({ username, name, email, password });
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
        return rejectWithValue("Signup failed");
    }
) 


const signupSlice = createSlice({
    name: "signup",
    initialState,
    reducers: {
        resetSignup: (state) => {
            state.username = state.email = state.password = state.error = state.message = state.confirmPassword = "";
            state.state = state.usernameAvailable = "idle";
            state.errors = { password: "", confirmPassword: "", name: "", email:"", username:"" };
        },
        setUsernameSignup: (state, action:PayloadAction<string> )=>{
            state.username = action.payload;
        },
        setEmailSignup: (state, action:PayloadAction<string> )=>{
            state.email = action.payload;
        },
        setNameSignup: (state, action:PayloadAction<string> )=>{
            state.name = action.payload;
        },
        setPasswordSignup: (state, action:PayloadAction<string> )=>{
            state.password = action.payload;
        },
        setConfirmPasswordSignup: (state, action: PayloadAction<string>) => {
            state.confirmPassword = action.payload;
        },
        setShowPasswordSignup: (state, action: PayloadAction<boolean>) => {
            state.showPassword = action.payload;
        },
        setUsernameAvailability: (state, action: PayloadAction<"idle" | "loading" | "error" | "yes" | "no" | "typing">) => {
            state.usernameAvailable = action.payload
        },
        setUsernameErrorSignup: (state, action: PayloadAction<string | null>) => {
            state.errors.username = action.payload;
        },
        setNameErrorSignup: (state, action:PayloadAction<string | null> )=>{
            state.errors.name = action.payload;
        },
        setEmailErrorSignup: (state, action:PayloadAction<string | null> )=>{
            state.errors.email = action.payload;
        },
        setPasswordErrorSignup: (state, action:PayloadAction<string | null> )=>{
            state.errors.password = action.payload;
        },
        setConfirmPasswordErrorSignup: (state, action: PayloadAction<string | null>) => {
            state.errors.confirmPassword = action.payload;
        }

    },
    extraReducers: (builder) => {
        builder
        .addCase(checkUsernameAvailability.pending, (state) => {
            state.usernameAvailable = "loading";
        })
        .addCase(checkUsernameAvailability.rejected, (state, action) => {
            state.usernameAvailable = "error";
            state.errors.username = action.payload ?? "Failed to check username availability";
        })
        .addCase(checkUsernameAvailability.fulfilled, (state, action) => {
            state.usernameAvailable = action.payload ? "yes" : "no";
            if(!action.payload){
                state.errors.username = "Username is already taken."
            }
        })

        .addCase(signupAsync.pending, (state) => {
            state.state = "loading";

        })
        .addCase(signupAsync.rejected, (state, action) => {
            state.state = "error";
            state.error = action.payload ?? "Signup Failed";
        })
        .addCase(signupAsync.fulfilled, (state, action) => {
            state.state = "success";
            state.message = action.payload.message ?? "";
            state.error = action.payload.error ?? "";
        })
    }
});

export const { 
    resetSignup,
    setUsernameSignup,
    setNameSignup,
    setEmailSignup,
    setPasswordSignup,
    setConfirmPasswordSignup, 
    setShowPasswordSignup,
    setUsernameAvailability,
    setUsernameErrorSignup,
    setNameErrorSignup,
    setEmailErrorSignup,
    setPasswordErrorSignup,
    setConfirmPasswordErrorSignup
} = signupSlice.actions;

const signupReducer = signupSlice.reducer;
export default signupReducer;