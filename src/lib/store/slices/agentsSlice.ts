import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Agent {
  id: number
  name: string
  email: string
  phone?: string
  parent_agent_id?: number
  account_id: number
  is_active: boolean
  balance: number
  commission_rate: number
  created_at: string
  updated_at: string
  parent_agent?: Agent
  sub_agents?: Agent[]
}

interface AgentsState {
  agents: Agent[]
  selectedAgent: Agent | null
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
    status: string
    parent_agent_id?: number
  }
}

const initialState: AgentsState = {
  agents: [],
  selectedAgent: null,
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
    status: '',
  },
}

export const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setAgents: (state, action: PayloadAction<{ agents: Agent[]; pagination: { current_page: number; last_page: number; per_page: number; total: number } }>) => {
      state.agents = action.payload.agents
      state.pagination = action.payload.pagination
    },
    setSelectedAgent: (state, action: PayloadAction<Agent | null>) => {
      state.selectedAgent = action.payload
    },
    updateAgent: (state, action: PayloadAction<Agent>) => {
      const index = state.agents.findIndex(agent => agent.id === action.payload.id)
      if (index !== -1) {
        state.agents[index] = action.payload
      }
    },
    setFilters: (state, action: PayloadAction<Partial<AgentsState['filters']>>) => {
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
  setAgents,
  setSelectedAgent,
  updateAgent,
  setFilters,
  clearError,
} = agentsSlice.actions

export default agentsSlice.reducer
