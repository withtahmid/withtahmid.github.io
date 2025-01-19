import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MailReadReceiptsCreateEmailResponse, MailReadReceiptsDeleteEmailResponse, MailReadReceiptsFetchAllResponse, MailReadReceiptsSeeEmailResponse } from "../../types/backend/types/response/mailreadreceipts";
import { trpc } from "../../trpc";
import { logResponse } from "../../utils/responseHandlers/logResponse";
import { handleTRPCError } from "../../utils/responseHandlers/handleTRPCError";
import { Response } from "../../types/backend/types/response";
import { ReceiptEmailSchema } from "../../types/backend/models/mailreadreceipts/ReceiptEmail";

const fetchAll = createAsyncThunk<Response<MailReadReceiptsFetchAllResponse>, undefined, { rejectValue: string }>(
    "fetchAll",
    async(_, { rejectWithValue }) => {
        try {
            var res:Response<MailReadReceiptsFetchAllResponse> = await trpc.mailreadreceipts.fetchAll.query();
            logResponse(res);
        } catch (error) {
            return rejectWithValue(handleTRPCError("Failed to fetch mailreadreceipts", error));
        }
        return res;
    }
);

const createOne = createAsyncThunk<Response<MailReadReceiptsCreateEmailResponse>, { label: string }, { rejectValue: string }>(
    "createOne",
    async({ label }, { rejectWithValue }) => {
        try {
            var res = await trpc.mailreadreceipts.createOne.mutate({ label });
        } catch (error) {
            return rejectWithValue(handleTRPCError("Failed to create new mail receipt", error));
        }
        return res;
    }    
);

const deleteOne = createAsyncThunk<Response<MailReadReceiptsDeleteEmailResponse>, { _id: string }, { rejectValue: string }>(
    "deleteOne",
    async({ _id }, { rejectWithValue }) => {
        try {
            var res = await trpc.mailreadreceipts.deleteOne.mutate(_id);
        } catch (error) {
            return rejectWithValue(handleTRPCError("Failed to delete mail receipt", error));
        }
        return res;
    }
);
const seeOne = createAsyncThunk<Response<MailReadReceiptsSeeEmailResponse>, { _id: string }, { rejectValue: string }>(
    "seeOne",
    async({ _id }, { rejectWithValue }) => {
        try {
            var res = await trpc.mailreadreceipts.seeOne.mutate(_id);
        } catch (error) {
            return rejectWithValue(handleTRPCError("Failed to reset invoke count of mail receipt", error));
        }
        return res;
    }
);

interface MailreadReceiptsState {
    emails: ReceiptEmailSchema[],
    status: "idle" | "success" | "error" | "loading";
    message: string | null;
    error: string | null;

    previewing: string;
    deleting: string;
}

const initialState:MailreadReceiptsState = {
    emails: [],
    status: "idle",
    message: null,
    error: null,

    previewing: "",
    deleting: "",
}

const mailreadReceiptsSlice = createSlice({
    name: "mailreadreceipts",
    initialState,
    reducers: {
        setPreviewing: (state, action:PayloadAction<string>) => {
            state.previewing = action.payload;
        },
        setDeleting: (state, action:PayloadAction<string>) => {
            state.deleting = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAll.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchAll.rejected, (state, action) => {
            state.status = "error";
            state.error = action.payload ?? null;
        })
        .addCase(fetchAll.fulfilled, (state, action) => {
            state.status = "success";
            const res = action.payload;
            if(res.success){
                state.emails = res.data.emails;
                // state.message = res.message;
            }else if("errorCode" in res){
                state.message = res.message;
            }else {
                state.error = res.message;
            }            
        })
        .addCase(createOne.rejected, (state, action) => {
            state.error = action.payload ?? null;
        })
        .addCase(createOne.fulfilled, (state, action) => {
            const res = action.payload;
            if(res.success){
                state.emails.push(res.data.email)
                state.message = res.message;
            }else if("errorCode" in res){
                state.message = res.message;
            }else {
                state.error = res.message;
            }          
        })
        .addCase(deleteOne.rejected, (state, action) => {
            state.error = action.payload ?? null;
        })
        .addCase(deleteOne.fulfilled, (state, action) => {
            const res = action.payload;
            if(res.success){
                state.emails = state.emails.filter(e => e._id !== action.meta.arg._id);
                state.message = res.message;
            }else if("errorCode" in res){
                state.message = res.message;
            }else {
                state.error = res.message;
            }          
        })
        .addCase(seeOne.rejected, (state, action) => {
            state.error = action.payload ?? null;
        })
        .addCase(seeOne.fulfilled, (state, action) => {
            const res = action.payload;
            if(res.success){
                const indx = state.emails.findIndex(e => e._id === action.meta.arg._id);
                if(indx !== -1){
                    state.emails[indx].newInvokeCount = 0;
                }
                // state.message = res.message;
            }else if("errorCode" in res){
                state.message = res.message;
            }else {
                state.error = res.message;
            }          
        })
    }
});

const mailreadreceiptsReducer = mailreadReceiptsSlice.reducer;
export default mailreadreceiptsReducer;
export const mailreadReceiptsActions = {
    fetchAll,
    createOne,
    deleteOne,
    seeOne,
    setPreviewing: mailreadReceiptsSlice.actions.setPreviewing,
    setDeleting: mailreadReceiptsSlice.actions.setDeleting
};