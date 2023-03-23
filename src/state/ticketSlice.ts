import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TicketObject } from '../utils/utils';

export interface LinkData {
    id: number;
    label: string;
    region?: string;
    lm?: string;
    connectedLinks?: string[];
    alias?: string[];
}

const initialState: TicketObject[] = [];

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        updateTicketState: (state, action: PayloadAction<TicketObject[]>) => {
            return action.payload;
        },
        updateOneTicket: (state, action: PayloadAction<TicketObject>) => {
            let item = state.find(s => s.id === action.payload.id);
            if (item) {
                state[state.indexOf(item)].connectedLinks = action.payload.connectedLinks;
            }
        },
    },
});

export const { updateTicketState, updateOneTicket } = counterSlice.actions;

export default counterSlice.reducer;
