// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import apiUrl from 'src/configs/api'

interface DataParams {
  'Filters.UserAccountGuid'?: string
  'Filters.ApprovalStatus'?: string
  PageNumber?: number
  PageSize?: number
  Sort?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch manageProfiles
export const fetchData = createAsyncThunk('manageProfile/fetchData', async (params: DataParams) => {
  debugger
  const response = await axiosInterceptorInstance.get(apiUrl.getChangesRequest, {
    params
  })
  debugger

  return response.data
})

export const deleteProfile = createAsyncThunk(
  'manageProfile/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axiosInterceptorInstance.delete('/apps/manageProfile/delete', {
      data: id
    })
    await dispatch(fetchData(getState().manageProfile.params))

    return response.data
  }
)
export const approveOrRejectProfile = createAsyncThunk(
  'manageProfile/approveOrRejectData',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axiosInterceptorInstance.post('/api/Profile/Evaluate', data)
    await dispatch(fetchData(getState().manageProfile.params))

    return response.data
  }
)

export const manageProfileSlice = createSlice({
  name: 'manageProfile',
  initialState: {
    data: [],
    totalCount: 1,
    pageNumber: 1,
    pageSize: 10
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      debugger
      state.data = action.payload.items
      state.pageNumber = action.payload.pageNumber
      state.pageSize = action.payload.pageSize
      state.totalCount = action.payload.totalCount
    })
  }
})

export default manageProfileSlice.reducer
