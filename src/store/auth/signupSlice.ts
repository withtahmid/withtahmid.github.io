import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { trpc } from "../../trpc";
import { IsUsernameAvailableRespone, SignupResponse } from "../../types/backend/types/response/auth";
import { Response } from "../../types/backend/types/response";
import { logResponse } from "../../utils/responseHandlers/logResponse";
import { handleTRPCError } from "../../utils/responseHandlers/handleTRPCError";

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

    done: boolean;
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
    done: false,
}

export const checkUsernameAvailability = createAsyncThunk<Response<IsUsernameAvailableRespone>, { username: string }, { rejectValue: string }>(
    "signup/checkusernameAvailable",
    async({ username }, { rejectWithValue } ) => {
        try {
            var res  = await trpc.auth.isUsernameAvailable.query( username );
            logResponse(res);
        } catch (error) {
            return rejectWithValue(handleTRPCError("Failed to check username availability", error));
        }
        return res;
    }  
)

export const signupAsync = createAsyncThunk<Response<SignupResponse>, { username: string, name: string, email: string, password: string, confirmPassword: string }, { rejectValue: string } >(
    "signup/async",
    async({ username, name, email, password, confirmPassword }, { rejectWithValue }) => {
        try {
            var res =  await trpc.auth.signup.mutate({ username, name, email, password, confirmPassword });
            logResponse(res);
        } catch (error) {
            return rejectWithValue(handleTRPCError("Failed to signup", error));
        }
        return res;
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
            state.done = false;
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
            const response = action.payload;
            if(response.success){
                state.usernameAvailable = response.data.isAvailable ? "yes" : "no",
                state.errors.username = response.data.isAvailable ? null : "Username is already taken.";
            }else{
                state.errors.username = response.message;
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
            const response = action.payload;
            if(response.success){
                state.done = true;
            }else if('errorCode' in response){
                state.error = response.message;
            }else {
                state.error = response.message;
            }
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