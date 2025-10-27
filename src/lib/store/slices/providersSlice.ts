import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Provider {
  id: number
  code: string
  name: string
  type: string
  is_enabled: boolean
  settings: Record<string, unknown>
  health_status: string
  last_checked_at?: string
  created_at: string
  updated_at: string
}

interface ProvidersState {
  providers: Provider[]
  selectedProvider: Provider | null
  isLoading: boolean
  error: string | null
}

const initialState: ProvidersState = {
  providers: [],
  selectedProvider: null,
  isLoading: false,
  error: null,
}

export const providersSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setProviders: (state, action: PayloadAction<Provider[]>) => {
      state.providers = action.payload
    },
    setSelectedProvider: (state, action: PayloadAction<Provider | null>) => {
      state.selectedProvider = action.payload
    },
    updateProvider: (state, action: PayloadAction<Provider>) => {
      const index = state.providers.findIndex(provider => provider.id === action.payload.id)
      if (index !== -1) {
        state.providers[index] = action.payload
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setLoading,
  setError,
  setProviders,
  setSelectedProvider,
  updateProvider,
  clearError,
} = providersSlice.actions

export default providersSlice.reducer
