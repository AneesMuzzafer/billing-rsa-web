import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IBill } from "../state/historySlice";
import { apiThunkHandler } from "./utils";

const getBills = createAsyncThunk(
    "history/get",
    async (_, thunkAPI) => apiThunkHandler(axios.get("/bill"), thunkAPI)
);

const createBill = createAsyncThunk(
    "history/create",
    async (bill: IBill, thunkAPI) => apiThunkHandler(axios.post("/bill", {
        bill: bill
    }), thunkAPI)
);

const exportBill = createAsyncThunk(
    "history/export",
    async (id: string, thunkAPI) => apiThunkHandler(axios.get("/bill/export/" + id), thunkAPI)
);

const history = {
    getBills,
    createBill,
    exportBill
};

export default history;