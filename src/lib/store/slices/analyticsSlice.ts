import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface DashboardStats {
  total_bookings: number
  total_revenue: number
  conversion_rate: number
  cancellation_rate: number
  search_to_book_ratio: number
  active_users: number
  new_users_today: number
  revenue_today: number
}

export interface ProviderPerformance {
  provider_id: number
  provider_name: string
  response_time: number
  success_rate: number
  avg_price: number
  bookings_count: number
  revenue: number
}

export interface BookingTrend {
  date: string
  bookings: number
  revenue: number
}

export interface RevenueByProvider {
  provider: string
  revenue: number
  percentage: number
}

export interface TopDestination {
  destination: string
  bookings: number
  revenue: number
}

interface AnalyticsState {
  dashboardStats: DashboardStats | null
  providerPerformance: ProviderPerformance[]
  bookingTrends: BookingTrend[]
  revenueByProvider: RevenueByProvider[]
  topDestinations: TopDestination[]
  isLoading: boolean
  error: string | null
  dateRange: {
    start: string
    end: string
  }
}

const initialState: AnalyticsState = {
  dashboardStats: null,
  providerPerformance: [],
  bookingTrends: [],
  revenueByProvider: [],
  topDestinations: [],
  isLoading: false,
  error: null,
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  },
}

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setDashboardStats: (state, action: PayloadAction<DashboardStats>) => {
      state.dashboardStats = action.payload
    },
    setProviderPerformance: (state, action: PayloadAction<ProviderPerformance[]>) => {
      state.providerPerformance = action.payload
    },
    setBookingTrends: (state, action: PayloadAction<BookingTrend[]>) => {
      state.bookingTrends = action.payload
    },
    setRevenueByProvider: (state, action: PayloadAction<RevenueByProvider[]>) => {
      state.revenueByProvider = action.payload
    },
    setTopDestinations: (state, action: PayloadAction<TopDestination[]>) => {
      state.topDestinations = action.payload
    },
    setDateRange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.dateRange = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setLoading,
  setError,
  setDashboardStats,
  setProviderPerformance,
  setBookingTrends,
  setRevenueByProvider,
  setTopDestinations,
  setDateRange,
  clearError,
} = analyticsSlice.actions

export default analyticsSlice.reducer
