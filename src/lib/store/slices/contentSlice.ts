import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Blog {
  id: number
  title: string
  slug: string
  content: string
  featured_image?: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

export interface Destination {
  id: number
  name: string
  slug: string
  description: string
  highlights: string[]
  gallery: string[]
  meta_title?: string
  meta_description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Package {
  id: number
  name: string
  description: string
  price: number
  currency: string
  validity_from: string
  validity_to: string
  hotels: unknown[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Ad {
  id: number
  tier: 'banner' | 'sidebar' | 'popup'
  title: string
  content: string
  image_url?: string
  link_url?: string
  position: string
  is_active: boolean
  display_rules: unknown
  created_at: string
  updated_at: string
}

interface ContentState {
  blogs: Blog[]
  destinations: Destination[]
  packages: Package[]
  ads: Ad[]
  selectedItem: Blog | Destination | Package | Ad | null
  isLoading: boolean
  error: string | null
  filters: {
    search: string
    status: string
    type: string
  }
}

const initialState: ContentState = {
  blogs: [],
  destinations: [],
  packages: [],
  ads: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    type: '',
  },
}

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setBlogs: (state, action: PayloadAction<Blog[]>) => {
      state.blogs = action.payload
    },
    setDestinations: (state, action: PayloadAction<Destination[]>) => {
      state.destinations = action.payload
    },
    setPackages: (state, action: PayloadAction<Package[]>) => {
      state.packages = action.payload
    },
    setAds: (state, action: PayloadAction<Ad[]>) => {
      state.ads = action.payload
    },
    setSelectedItem: (state, action: PayloadAction<Blog | Destination | Package | Ad | null>) => {
      state.selectedItem = action.payload
    },
    updateBlog: (state, action: PayloadAction<Blog>) => {
      const index = state.blogs.findIndex(blog => blog.id === action.payload.id)
      if (index !== -1) {
        state.blogs[index] = action.payload
      }
    },
    updateDestination: (state, action: PayloadAction<Destination>) => {
      const index = state.destinations.findIndex(dest => dest.id === action.payload.id)
      if (index !== -1) {
        state.destinations[index] = action.payload
      }
    },
    updatePackage: (state, action: PayloadAction<Package>) => {
      const index = state.packages.findIndex(pkg => pkg.id === action.payload.id)
      if (index !== -1) {
        state.packages[index] = action.payload
      }
    },
    updateAd: (state, action: PayloadAction<Ad>) => {
      const index = state.ads.findIndex(ad => ad.id === action.payload.id)
      if (index !== -1) {
        state.ads[index] = action.payload
      }
    },
    setFilters: (state, action: PayloadAction<Partial<ContentState['filters']>>) => {
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
  setBlogs,
  setDestinations,
  setPackages,
  setAds,
  setSelectedItem,
  updateBlog,
  updateDestination,
  updatePackage,
  updateAd,
  setFilters,
  clearError,
} = contentSlice.actions

export default contentSlice.reducer
