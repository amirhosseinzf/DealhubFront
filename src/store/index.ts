// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import invoice from 'src/store/invoice'

export const store = configureStore({
  reducer: {
    invoice
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
