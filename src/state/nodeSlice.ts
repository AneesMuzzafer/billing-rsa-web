import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Node } from '../api';
import { setError } from '../api/utils';
import { ParsedTicket } from "./parsedLinks";

export interface INode {
    id: string;
    label: string;
    region: string;
    cps: number[];
    vendor: string;
    connectedLinks: string[];
    alias: string[];
}

export interface INodeState {
    loading: boolean;
    error: string;

    node: INode;
    nodes: Array<INode>;
}

const initialState: INodeState = {
    loading: false,
    error: "",

    node: {} as INode,
    nodes: [],
}

export const LinkSlice = createSlice({
    name: 'node',
    initialState,
    reducers: {
        clearNode: (state) => {
            state.node = {} as INode;
        },
        addAliases: (state, action: PayloadAction<ParsedTicket[]>) => {
            // implement add aliases
        },
    },
    extraReducers: (builder) => {
        builder.addCase(Node.getAllNodes.pending, (state) => { state.loading = true });
        builder.addCase(Node.getOneNode.pending, (state) => { state.loading = true });
        builder.addCase(Node.createNode.pending, (state) => { state.loading = true });
        builder.addCase(Node.updateNode.pending, (state) => { state.loading = true });
        builder.addCase(Node.deleteNode.pending, (state) => { state.loading = true });
        builder.addCase(Node.importNodes.pending, (state) => { state.loading = true });

        builder.addCase(Node.getAllNodes.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.nodes = payload.nodes;
        });
        builder.addCase(Node.getOneNode.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.node = payload.node;
        });
        builder.addCase(Node.createNode.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.node = payload.node;
            state.nodes = [...state.nodes, payload.node];
        });
        builder.addCase(Node.updateNode.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.node = payload.node;
            state.nodes[state.nodes.findIndex(n => n.id === payload.node.id)] = payload.node;
        });
        builder.addCase(Node.deleteNode.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.nodes = state.nodes.filter(n => n.id !== payload.node.id);
        });
        builder.addCase(Node.importNodes.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.nodes = [...state.nodes, ...payload.nodes];
        });

        builder.addCase(Node.getAllNodes.rejected, setError);
        builder.addCase(Node.getOneNode.rejected, setError);
        builder.addCase(Node.createNode.rejected, setError);
        builder.addCase(Node.updateNode.rejected, setError);
        builder.addCase(Node.deleteNode.rejected, setError);
        builder.addCase(Node.importNodes.rejected, setError);
    }
});

export const { clearNode, addAliases } = LinkSlice.actions;

export default LinkSlice.reducer;
