import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Commission {
  id: number
  type: 'percentage' | 'fixed'
  value: number
  effective_from: string
  effective_to?: string
  scope: 'global' | 'account' | 'user'
  scope_id?: number
  is_active: boolean
  created_by: number
  created_at: string
  updated_at: string
}

interface CommissionsState {
  commissions: Commission[]
  selectedCommission: Commission | null
  isLoading: boolean
  error: string | null
  filters: {
    scope: string
    status: string
  }
}

const initialState: CommissionsState = {
  commissions: [],
  selectedCommission: null,
  isLoading: false,
  error: null,
  filters: {
    scope: '',
    status: '',
  },
}

export const commissionsSlice = createSlice({
  name: 'commissions',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setCommissions: (state, action: PayloadAction<Commission[]>) => {
      state.commissions = action.payload
    },
    setSelectedCommission: (state, action: PayloadAction<Commission | null>) => {
      state.selectedCommission = action.payload
    },
    updateCommission: (state, action: PayloadAction<Commission>) => {
      const index = state.commissions.findIndex(commission => commission.id === action.payload.id)
      if (index !== -1) {
        state.commissions[index] = action.payload
      }
    },
    setFilters: (state, action: PayloadAction<Partial<CommissionsState['filters']>>) => {
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
  setCommissions,
  setSelectedCommission,
  updateCommission,
  setFilters,
  clearError,
} = commissionsSlice.actions

export default commissionsSlice.reducer
