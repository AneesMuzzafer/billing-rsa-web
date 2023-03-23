import { createSlice } from "@reduxjs/toolkit";
import { setAuthToken, User } from "../api";
import { setError } from "../api/utils";

export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    meta: string;
}

export interface IUserState {
    loading: boolean;
    error: string;
    token: string;
    user: IUser;
}

const initialState = {
    loading: false,
    error: "",
    token: "",
    user: {} as IUser,
}

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder.addCase(User.signIn.pending, (state) => { state.loading = true });
        builder.addCase(User.getMyProfile.pending, (state) => { state.loading = true });
        builder.addCase(User.logout.pending, (state) => { state.loading = true });

        builder.addCase(User.signIn.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.token = payload.token;
            state.user = payload.user;
            setAuthToken(payload.token);
        })
        builder.addCase(User.getMyProfile.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.user = payload;
        })
        builder.addCase(User.logout.fulfilled, (state, { payload }) => {
            state.loading = false;
            if (payload.status === "success") {
                state.token = "";
                state.user = {} as IUser;
            }
        })

        builder.addCase(User.signIn.rejected, setError);
        builder.addCase(User.getMyProfile.rejected, setError);
        builder.addCase(User.logout.rejected, setError);
    }
})

export const { clearUserError } = user.actions;

export default user.reducer;
