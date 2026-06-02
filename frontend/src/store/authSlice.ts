import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  token: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      localStorage.setItem('token', action.payload)
    },
    clearToken: (state) => {
      state.token = null
      localStorage.removeItem('token')
    },
  },
})

export const { clearToken, setToken } = authSlice.actions
export default authSlice.reducer
