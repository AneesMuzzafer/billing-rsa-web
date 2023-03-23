import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ISettingState {
    enableFastTrafficAffecting: boolean;
    startMonth: string;
    endMonth: string;
};

const initialState: ISettingState = {
    enableFastTrafficAffecting: true,
    startMonth: "",
    endMonth: ""
}

export const setting = createSlice({
    name: "setting",
    initialState,
    reducers: {
        toggleFastTrafficAffecting: (state) => {
            state.enableFastTrafficAffecting = !state.enableFastTrafficAffecting
        },
        updateStartEndTime: (state, action: PayloadAction<{ start: string, end: string }>) => {
            state.startMonth = action.payload.start;
            state.endMonth = action.payload.end;
        }
    }
});

export const { toggleFastTrafficAffecting, updateStartEndTime } = setting.actions;

export default setting.reducer;