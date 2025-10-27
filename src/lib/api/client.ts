import { QueryClient } from '@tanstack/react-query'

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: unknown) => {
        if (error && typeof error === 'object' && 'status' in error && error.status === 401) return false
        return failureCount < 3
      },
    },
  },
})

// API Base URL
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

// JWT Token Management
export const getToken = () => {
  return localStorage.getItem('jwt_token')
}

export const setToken = (token: string) => {
  localStorage.setItem('jwt_token', token)
}

export const removeToken = () => {
  localStorage.removeItem('jwt_token')
}

// API Client with JWT authentication
export const apiClient = {
  get: async (url: string, options?: RequestInit) => {
    const token = getToken()
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        removeToken()
        window.location.href = '/login'
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },
  
  post: async (url: string, data?: unknown, options?: RequestInit) => {
    const token = getToken()
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        removeToken()
        window.location.href = '/login'
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },
  
  put: async (url: string, data?: unknown, options?: RequestInit) => {
    const token = getToken()
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        removeToken()
        window.location.href = '/login'
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },
  
  delete: async (url: string, options?: RequestInit) => {
    const token = getToken()
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        removeToken()
        window.location.href = '/login'
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },
}
