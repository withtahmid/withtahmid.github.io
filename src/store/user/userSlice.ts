import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserSchema } from "../../types/backend/models/User"
import { trpc } from "../../trpc";
import { FetchUserResponse } from "../../types/backend/types/response/user";
import { logResponse } from "../../utils/responseHandlers/logResponse";
import { handleTRPCError } from "../../utils/responseHandlers/handleTRPCError";
import { Response } from "../../types/backend/types/response";

interface UserState{
    user: UserSchema;
    // lastLoaded: number;
    state: "idle" | "success" | "error" | "loading";
    message: string | null;
    error: string | null;
}
const initialState: UserState = {
    user: {
        _id: "",
        name: "",
        email: "",
        username: "",
        userType: "regular",
    },
    // lastLoaded: 0,
    state: "idle",
    message: null,
    error: null,
}

export const fetchUserAsync = createAsyncThunk<Response<FetchUserResponse>, undefined, { rejectValue: string }>(
    "user/fetch",
    async(_, { rejectWithValue }) => {
        try {
            var res = await trpc.user.fetchUser.query();
            logResponse(res);
        } catch (error) {
            return rejectWithValue(handleTRPCError("Faild to fetch user data", error));            
        }
        return res;
        
    }
)

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserSchema>) => {
            state.user = action.payload;
        },
        logoutUser: (state) => {
           state.user = {
                _id: "",
                name: "",
                email: "",
                username: "",
                userType: "regular",
            }
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchUserAsync.pending, (state) =>{
            state.state = "loading";
        })
        .addCase(fetchUserAsync.rejected, (state, action) => {
            state.state = "error";
            state.error = action.payload ?? null;
        })
        .addCase(fetchUserAsync.fulfilled, (state, action) => {
            state.state = "success";
            const response = action.payload;
            if(response.success){
                state.user = response.data
                // state.lastLoaded = Date.now();
            }else if("errorCode" in response){
                state.message = response.message;
            }else{
                state.error = response.message;
            }
        });
    }
});

const userReducer = userSlice.reducer;
export default userReducer;
export const { setUser, logoutUser } = userSlice.actions; 