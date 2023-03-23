import { createSlice } from "@reduxjs/toolkit";
import { History } from "../api";
import { setError } from "../api/utils";
import { billTable } from "../screens/BillDataTable";
import { BillData } from "./billSlice";
import { IVendor } from "./vendorSlice";

export interface IMonthBill {
    id: string;
    month: number;
    billTable: billTable[];
    billTotal: number;
}

export interface IBillGroup {
    id: string;
    vendor: IVendor;
    billGroup: IMonthBill[];
    billGroupTotal: number;
}

export interface IBill {
    id: string;
    billEntity: IBillGroup[];
    billJson: BillData[];
    created_at: string;
}

interface IHistoryState {
    loading: boolean;
    error: string;

    bill: IBill;
    bills: IBill[];
}

const initialState: IHistoryState = {
    loading: false,
    error: "",

    bill: {} as IBill,
    bills: [],
};

const history = createSlice({
    name: "history",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(History.getBills.pending, (state) => {state.loading = true});
        builder.addCase(History.createBill.pending, (state) => {state.loading = true});

        builder.addCase(History.getBills.fulfilled, (state, {payload}) => {
            state.loading = false
            state.bills = payload.bills;
            state.bill = payload.bills[0];
        });
        builder.addCase(History.createBill.fulfilled, (state, {payload}) => {
            state.loading = false
            state.bill = payload.bill;
            state.bills = [...state.bills, payload.bill];
        });

        builder.addCase(History.getBills.rejected, setError);
        builder.addCase(History.createBill.rejected, setError);
    }
});

export default history.reducer;
