import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ParsedTicket {
    id: number;
    linkname: string;
    ticketDesc: string;
    category: string;
    completeMatch: boolean;
    partialMatch: boolean;
    ticketId: string;
    firstMatchRefIndex: number;
    ticketStartedAt: number;
    ticketResolvedAt: number;
    trafficAffected: boolean;
    trafficAffectingStatusInTicket: boolean;
    matches: any[];
}


const initialState: ParsedTicket[] = [];

export const parsedLinkSlice = createSlice({
    name: 'parsedLink',
    initialState,
    reducers: {
        updateParsedState: (state, action: PayloadAction<ParsedTicket[]>) => {
            return action.payload;
        },
        updateOneTicket: (state, action: PayloadAction<{ ticket: ParsedTicket, networkIndex: number }>) => {
            let item = state.find(s => s.id === action.payload.ticket.id);
            if (item) {
                state[state.indexOf(item)].firstMatchRefIndex = action.payload.networkIndex;
            }
        },
        updateCompleteFlag: (state, action: PayloadAction<ParsedTicket[]>) => {
            action.payload.forEach(p => {
                let item = state.find(s => s.id === p.id);
                if (item) {
                    state[state.indexOf(item)].completeMatch = true;
                }
            });
        },
        updateOneCompleteFlag: (state, action: PayloadAction<ParsedTicket>) => {
                let item = state.find(s => s.id === action.payload.id);
                if (item) {
                    state[state.indexOf(item)].completeMatch = true;
                }
        },
    },
});

export const { updateParsedState, updateOneTicket, updateCompleteFlag } = parsedLinkSlice.actions;

export default parsedLinkSlice.reducer;