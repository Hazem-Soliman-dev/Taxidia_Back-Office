import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Ticket {
  id: number
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  requester_type: 'customer' | 'agent' | 'guest'
  requester_id?: number
  requester_name: string
  requester_email: string
  assigned_to?: number
  assigned_user?: { name: string; email: string }
  created_at: string
  updated_at: string
  messages_count: number
  last_message_at?: string
}

export interface TicketMessage {
  id: number
  ticket_id: number
  user_id?: number
  message: string
  type: 'text' | 'image' | 'file'
  is_internal: boolean
  attachments?: unknown[]
  created_at: string
  user?: { name: string; email: string }
}

export interface CannedResponse {
  id: number
  title: string
  content: string
  tags: string[]
  is_active: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

interface SupportState {
  tickets: Ticket[]
  selectedTicket: Ticket | null
  ticketMessages: TicketMessage[]
  cannedResponses: CannedResponse[]
  isLoading: boolean
  error: string | null
  filters: {
    search: string
    status: string
    priority: string
    assigned_to?: number
  }
}

const initialState: SupportState = {
  tickets: [],
  selectedTicket: null,
  ticketMessages: [],
  cannedResponses: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    priority: '',
  },
}

export const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload
    },
    setSelectedTicket: (state, action: PayloadAction<Ticket | null>) => {
      state.selectedTicket = action.payload
    },
    setTicketMessages: (state, action: PayloadAction<TicketMessage[]>) => {
      state.ticketMessages = action.payload
    },
    addTicketMessage: (state, action: PayloadAction<TicketMessage>) => {
      state.ticketMessages.push(action.payload)
    },
    setCannedResponses: (state, action: PayloadAction<CannedResponse[]>) => {
      state.cannedResponses = action.payload
    },
    updateTicket: (state, action: PayloadAction<Ticket>) => {
      const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id)
      if (index !== -1) {
        state.tickets[index] = action.payload
      }
    },
    setFilters: (state, action: PayloadAction<Partial<SupportState['filters']>>) => {
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
  setTickets,
  setSelectedTicket,
  setTicketMessages,
  addTicketMessage,
  setCannedResponses,
  updateTicket,
  setFilters,
  clearError,
} = supportSlice.actions

export default supportSlice.reducer
