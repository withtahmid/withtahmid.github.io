import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserSchema } from "../types/backend/models/User"
import { trpc } from "../trpc";

interface UserState extends UserSchema{
    lastLoaded: number;
    state: "idle" | "success" | "error" | "loading";
}
const initialState: UserState = {
    _id: "",
    name: "",
    email: "",
    username: "",
    userType: "regular",
    isVerified: false,

    lastLoaded: 0,
    state: "idle",
}

export const fetchUserAsync = createAsyncThunk<UserSchema, undefined, { rejectValue: string }>(
    "user/fetch",
    async(_, { rejectWithValue }) => {
        try {
            const res = await trpc.fetchUser.query();
            // console.log(res);
            return res;
        } catch (error) {
            console.error(error);
            return rejectWithValue("Faild to fetch user data");            
        }
        
    }
)

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserSchema>) => {
            const user = action.payload;
            state._id = user._id;
            state.name = user.name;
            state.email = user.email;
            state.userType = user.userType;
            state.isVerified = user.isVerified;
        },
        logoutUser: (state) => {
            state._id = "";
            state.name = "";
            state.email = "";
            state.userType = "regular";
            state.isVerified = false;
        },
        setUserVerified: (state, action: PayloadAction<boolean>) => {
            state.isVerified = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchUserAsync.pending, (state) =>{
            state.state = "loading";
        })
        .addCase(fetchUserAsync.rejected, (state, action) => {
            state.state = "error";
            console.error(action.payload)
        })
        .addCase(fetchUserAsync.fulfilled, (state, action) => {
            const user = action.payload;
            state._id = user._id;
            state.name = user.name;
            state.email = user.email;
            state.userType = user.userType;
            state.isVerified = user.isVerified;
            state.lastLoaded = Date.now();
            state.state = "success";
        });
    }
});

const userReducer = userSlice.reducer;
export default userReducer;
export const {setUser, logoutUser, setUserVerified } = userSlice.actions; 