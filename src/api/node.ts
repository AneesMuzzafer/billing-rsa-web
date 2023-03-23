import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiThunkHandler } from "./utils";
import { INode } from "../state/nodeSlice";

const getAllNodes = createAsyncThunk(
    "network/getAllNodes",
    async (_, thunkAPI) => apiThunkHandler(axios.get("/nodes"), thunkAPI)
);

const getOneNode = createAsyncThunk(
    "network/getOneNode",
    async ({ id }: { id: string }, thunkAPI) => apiThunkHandler(axios.get("/nodes/" + id), thunkAPI)
);

const createNode = createAsyncThunk(
    "network/createNode",
    async (node: INode, thunkAPI) => apiThunkHandler(axios.post("/nodes", {
        ...node,
    }), thunkAPI)
);

const updateNode = createAsyncThunk(
    "network/updateNode",
    async (node: INode, thunkAPI) => apiThunkHandler(axios.put("/nodes/" + node.id, node), thunkAPI)
);

const deleteNode = createAsyncThunk(
    "network/deleteNode",
    async ({ id }: { id: string }, thunkAPI) => apiThunkHandler(axios.delete("/nodes/" + id), thunkAPI)
);

const importNodes = createAsyncThunk(
    "network/importNodes",
    async (nodes: { nodes: INode[] }, thunkAPI) => apiThunkHandler(axios.post("/nodes/import", nodes), thunkAPI)
);

const Node = {
    getAllNodes,
    getOneNode,
    createNode,
    updateNode,
    deleteNode,
    importNodes
};

export default Node;