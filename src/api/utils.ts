import { AnyAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

export const apiThunkHandler = async (asyncFn: Promise<AxiosResponse>, { rejectWithValue }: { rejectWithValue: (response: any) => void }) => {
    try {
        return (await asyncFn).data;
    } catch (err: any) {
        console.log("ApiThunkHandlerError", err);
        return rejectWithValue(err.response.data);
    }
};

export const setIsLoading = (flag: boolean, other?: any) => (state: any) => { state[other ?? "loading"] = flag; };

export const setError = (state: any, action: AnyAction, other?: any) => {
    if (action.payload?.errors) {
        for (const k in action.payload.errors) {
            if (Object.prototype.hasOwnProperty.call(action.payload.errors, k)) {
                state.error = action.payload.errors[k][0];
                break;
            }
        }
    } else {
        state.error = action.payload?.message || "Something went wrong!";
    }

    state[other ?? "loading"] = false;
};
