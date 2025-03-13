import { configureStore } from '@reduxjs/toolkit'

import ether from "./ether"


const store = configureStore({
    reducer: {
        ether: ether
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
