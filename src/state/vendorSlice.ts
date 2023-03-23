import { createSlice } from "@reduxjs/toolkit";
import { Vendor } from "../api";
import { setError } from "../api/utils";

export interface IVendor {
    id: string;
    name: string;
    meta: string;
}

export interface IVendorState {
    loading: boolean;
    error: string;

    vendor: IVendor;
    vendors: Array<IVendor>;
}

const initialState = {
    loading: false,
    error: "",

    vendor: {} as IVendor,
    vendors: [] as Array<IVendor>
}

export const vendor = createSlice({
    name: "vendor",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(Vendor.getAllVendors.pending, (state) => { state.loading = true });

        builder.addCase(Vendor.getAllVendors.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.vendors = payload.vendors;
        })

        builder.addCase(Vendor.getAllVendors.rejected, setError);
    }
})

export default vendor.reducer;
