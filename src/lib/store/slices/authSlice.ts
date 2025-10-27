import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: number
  name: string
  email: string
  role: string
  account_id?: number
  agent_id?: number
  permissions: string[]
}

export interface Account {
  id: number
  name: string
  type: string
  is_active: boolean
}

interface AuthState {
  user: User | null
  account: Account | null
  isAuthenticated: boolean
  isImpersonating: boolean
  impersonatedUser: User | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  account: null,
  isAuthenticated: false,
  isImpersonating: false,
  impersonatedUser: null,
  isLoading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
    },
    selectAccount: (state, action: PayloadAction<{ account: Account; token: string }>) => {
      state.account = action.payload.account
      state.isLoading = false
      state.error = null
    },
    startImpersonation: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isImpersonating = true
      state.impersonatedUser = action.payload.user
      state.isLoading = false
      state.error = null
    },
    endImpersonation: (state) => {
      state.isImpersonating = false
      state.impersonatedUser = null
    },
    logout: (state) => {
      state.user = null
      state.account = null
      state.isAuthenticated = false
      state.isImpersonating = false
      state.impersonatedUser = null
      state.isLoading = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setLoading,
  setError,
  loginSuccess,
  selectAccount,
  startImpersonation,
  endImpersonation,
  logout,
  clearError,
} = authSlice.actions

export default authSlice.reducer
