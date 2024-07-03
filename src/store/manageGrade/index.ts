// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import apiUrl from 'src/configs/api'

interface DataParams {
  'Filters.TradeEntityGuid'?: string
  'Filters.ProductCategoryGuid'?: string
  PageNumber?: number
  PageSize?: number
  Sort?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch manageGrid
export const fetchData = createAsyncThunk('manageGrid/fetchData', async (params: DataParams) => {
  const response = await axiosInterceptorInstance.get(apiUrl.getGrid, {
    params: { ...params, IncludeTotalCount: true }
  })

  return response.data
})

export const deleteProfile = createAsyncThunk(
  'manageGrid/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axiosInterceptorInstance.delete('/apps/manageGrid/delete', {
      data: id
    })
    await dispatch(fetchData(getState().manageGrid.params))

    return response.data
  }
)
export const approveOrRejectProfile = createAsyncThunk(
  'manageGrid/approveOrRejectData',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axiosInterceptorInstance.post('/api/Profile/Evaluate', data)
    await dispatch(fetchData(getState().manageGrid.params))

    return response.data
  }
)

export const manageGridSlice = createSlice({
  name: 'manageGrid',
  initialState: {
    data: [],
    totalCount: 1,
    pageNumber: 1,
    pageSize: 10
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.items
      state.pageNumber = action.payload.pageNumber
      state.pageSize = action.payload.pageSize
      state.totalCount = action.payload.totalCount
    })
  }
})

export default manageGridSlice.reducer
