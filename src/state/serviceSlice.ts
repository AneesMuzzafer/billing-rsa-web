import { createSlice } from "@reduxjs/toolkit";
import Service from "../api/service";
import { setError } from "../api/utils";
import { INode } from "./nodeSlice";
import { IVendor } from "./vendorSlice";

export interface IRemark {
    text: string;
    created_at: string;
}

export interface IService {
    id: string;
    vendor: IVendor;
    node: INode;

    name: string;
    cpNumber: number;
    capacity: string;
    linkFrom: string;
    linkTo: string;
    doco: string;
    lastMile: string;
    annualInvoiceValue: number;
    sharePercent: number;
    discountOffered: number;
    annualVendorValue: number;
    unitRate: number;
    totalPODays: number;
    remarks: Array<IRemark>;
}

export interface IServiceState {
    loading: boolean;
    error: string;

    service: IService;
    services: Array<IService>;
}

const initialState = {
    loading: false,
    error: "",

    service: {} as IService,
    services: [] as Array<IService>
}

const service = createSlice({
    name: "service",
    initialState,
    reducers: {
        clearService: (state) => {
            state.service = {} as IService
        },
    },
    extraReducers: (builder) => {
        builder.addCase(Service.getAllServices.pending, (state) => { state.loading = true });
        builder.addCase(Service.getOneService.pending, (state) => { state.loading = true });
        builder.addCase(Service.createService.pending, (state) => { state.loading = true });
        builder.addCase(Service.updateService.pending, (state) => { state.loading = true });
        builder.addCase(Service.deleteService.pending, (state) => { state.loading = true });
        builder.addCase(Service.importServices.pending, (state) => { state.loading = true });

        builder.addCase(Service.getAllServices.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.services = payload.services;
        });
        builder.addCase(Service.getOneService.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.service = payload.service;
        });
        builder.addCase(Service.createService.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.service = payload.service;
            state.services = [...state.services, payload.service];
        });
        builder.addCase(Service.updateService.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.service = payload.service;
            state.services[state.services.findIndex(n => n.id === payload.service.id)] = payload.service;
        });
        builder.addCase(Service.deleteService.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.services = state.services.filter(n => n.id !== payload.service.id);
        });
        builder.addCase(Service.importServices.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.services = [...state.services, ...payload.services];
        });

        builder.addCase(Service.getAllServices.rejected, setError);
        builder.addCase(Service.getOneService.rejected, setError);
        builder.addCase(Service.createService.rejected, setError);
        builder.addCase(Service.updateService.rejected, setError);
        builder.addCase(Service.deleteService.rejected, setError);
        builder.addCase(Service.importServices.rejected, setError);
    }
})

export const { clearService } = service.actions;

export default service.reducer;
