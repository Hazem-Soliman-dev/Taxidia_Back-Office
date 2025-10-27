import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { store } from './lib/store'
import { queryClient } from './lib/api/client'
import { ThemeProvider } from './contexts/ThemeContext'
import { AppRouter } from './AppRouter'
import './index.css'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="taxidia-theme">
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default App
