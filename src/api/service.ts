import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiThunkHandler } from "./utils";
import { IService } from "../state/serviceSlice";

const getAllServices = createAsyncThunk(
    "service/getAll",
    async (_, thunkAPI) => apiThunkHandler(axios.get("/services"), thunkAPI)
);

const getOneService = createAsyncThunk(
    "service/getOne",
    async ({ id }: { id: string }, thunkAPI) => apiThunkHandler(axios.get("/services/" + id), thunkAPI)
);

const createService = createAsyncThunk(
    "service/create",
    async (service: IService, thunkAPI) => apiThunkHandler(axios.post("/services", {
        ...service,
    }), thunkAPI)
);

const updateService = createAsyncThunk(
    "service/update",
    async (service: IService, thunkAPI) => apiThunkHandler(axios.put("/services/" + service.id, service), thunkAPI)
);

const deleteService = createAsyncThunk(
    "service/delete",
    async ({ id }: { id: string }, thunkAPI) => apiThunkHandler(axios.delete("/services/" + id), thunkAPI)
);

const importServices = createAsyncThunk(
    "service/import",
    async (services: { services: IService[] }, thunkAPI) => apiThunkHandler(axios.post("/services/import", services), thunkAPI)
);

const Service = {
    getAllServices,
    getOneService,
    createService,
    updateService,
    deleteService,
    importServices
};

export default Service;
