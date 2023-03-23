import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiThunkHandler } from "./utils";

const getAllVendors = createAsyncThunk(
    "vendor/getAllVendors",
    async (_, thunkApi) => apiThunkHandler(axios.get("/vendors"), thunkApi)
);

const vendor = {
    getAllVendors,
}

export default vendor;