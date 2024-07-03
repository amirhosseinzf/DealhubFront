// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import invoice from 'src/store/invoice'
import manageProfile from 'src/store/manageProfile'
import manageProductCategories from 'src/store/manageProductCategories'
import manageGrid from 'src/store/manageGrade'

export const store = configureStore({
  reducer: {
    invoice,
    manageProfile,
    manageProductCategories,
    manageGrid
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
