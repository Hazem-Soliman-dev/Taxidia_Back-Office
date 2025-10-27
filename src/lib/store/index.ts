import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './slices/authSlice'
import { usersSlice } from './slices/usersSlice'
import { agentsSlice } from './slices/agentsSlice'
import { providersSlice } from './slices/providersSlice'
import { commissionsSlice } from './slices/commissionsSlice'
import { contentSlice } from './slices/contentSlice'
import { supportSlice } from './slices/supportSlice'
import { analyticsSlice } from './slices/analyticsSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    users: usersSlice.reducer,
    agents: agentsSlice.reducer,
    providers: providersSlice.reducer,
    commissions: commissionsSlice.reducer,
    content: contentSlice.reducer,
    support: supportSlice.reducer,
    analytics: analyticsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
