import { configureStore } from '@reduxjs/toolkit'
import billReducer from './billSlice'
import historyReducer from './historySlice'
import nodeReducer from "./nodeSlice"
import parsedTicketReducer from "./parsedLinks"
import serviceReducer from './serviceSlice'
import settingReducer from './settingSlice'
import userReducer from './userSlice'
import vendor from './vendorSlice'

export const store = configureStore({
  reducer: {
      nodes: nodeReducer,
      services: serviceReducer,
      parsedTickets: parsedTicketReducer,
      billItems: billReducer,
      vendors: vendor,
      history: historyReducer,
      settings: settingReducer,
      user: userReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
