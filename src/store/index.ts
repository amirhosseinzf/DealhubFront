// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import invoice from 'src/store/invoice'
import manageProfile from 'src/store/manageProfile'
import manageProductCategories from 'src/store/manageProductCategories'

export const store = configureStore({
  reducer: {
    invoice,
    manageProfile,
    manageProductCategories
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
