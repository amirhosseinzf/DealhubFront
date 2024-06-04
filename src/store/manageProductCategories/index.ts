// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import apiUrl from 'src/configs/api'

interface DataParams {
  'Filters.NameContains'?: string
  'Filters.Status'?: string
  PageNumber?: number
  PageSize?: number
  Sort?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch manageProductCategories
export const fetchData = createAsyncThunk('manageProductCategories/fetchData', async (params: DataParams) => {
  const response = await axiosInterceptorInstance.get(apiUrl.getProductCategory, {
    params
  })

  return response.data
})

export const deleteProfile = createAsyncThunk(
  'manageProductCategories/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axiosInterceptorInstance.delete('/apps/manageProductCategories/delete', {
      data: id
    })
    await dispatch(fetchData(getState().manageProductCategories.params))

    return response.data
  }
)
export const approveOrRejectProfile = createAsyncThunk(
  'manageProductCategories/approveOrRejectData',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axiosInterceptorInstance.post('/api/Profile/Evaluate', data)
    await dispatch(fetchData(getState().manageProductCategories.params))

    return response.data
  }
)

export const manageProductCategoriesSlice = createSlice({
  name: 'manageProductCategories',
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

export default manageProductCategoriesSlice.reducer
