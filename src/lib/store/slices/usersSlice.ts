import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: number
  name: string
  email: string
  role: string
  account_id?: number
  agent_id?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface UsersState {
  users: User[]
  selectedUser: User | null
  isLoading: boolean
  error: string | null
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  filters: {
    search: string
    role: string
    status: string
  }
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  },
  filters: {
    search: '',
    role: '',
    status: '',
  },
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setUsers: (state, action: PayloadAction<{ users: User[]; pagination: { current_page: number; last_page: number; per_page: number; total: number } }>) => {
      state.users = action.payload.users
      state.pagination = action.payload.pagination
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = action.payload
      }
    },
    setFilters: (state, action: PayloadAction<Partial<UsersState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setLoading,
  setError,
  setUsers,
  setSelectedUser,
  updateUser,
  setFilters,
  clearError,
} = usersSlice.actions

export default usersSlice.reducer
