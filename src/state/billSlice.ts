import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IService } from './serviceSlice';
export interface DownTime {
    id: number;
    startedAt: number;
    resolvedAt: number;
    downtime: number;
}
export interface BillData {
    id: string;
    service: IService;
    month: number;
    numberOfDays: number;
    downtimes: DownTime[];
}

export interface IBillState {
    loading: boolean;
    error: string;

    billItems: BillData[];
}

const initialState: IBillState = {
    loading: false,
    error: "",

    billItems: [],
}

export const BillSlice = createSlice({
    name: 'bills',
    initialState,
    reducers: {
        setBillItems: (state, action: PayloadAction<BillData[]>) => {
            state.billItems = action.payload;
        },
        updateOne: (state, action: PayloadAction<{ id: string; days: number; dt: DownTime[] }>) => {
            const index = state.billItems.findIndex(s => s.id === action.payload.id);
            state.billItems[index].downtimes = action.payload.dt;
            state.billItems[index].numberOfDays = action.payload.days;
        }
    },
});

export const { setBillItems, updateOne } = BillSlice.actions;

export default BillSlice.reducer;
