import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiThunkHandler } from "./utils";

const signIn = createAsyncThunk(
    "user/signIn",
    async ({ email, password }: { email: string; password: string }, thunkAPI) => apiThunkHandler(axios.post("/sign-in", {
        email,
        password
    }), thunkAPI)
);

const getMyProfile = createAsyncThunk(
    "user/me",
    async (_, thunkAPI) => apiThunkHandler(axios.get("/me"), thunkAPI)
);

const logout = createAsyncThunk(
    "user/logout",
    async (_, thunkAPI) => apiThunkHandler(axios.get("/logout"), thunkAPI)
)

const User = {
   signIn,
   getMyProfile,
   logout
};

export default User;
