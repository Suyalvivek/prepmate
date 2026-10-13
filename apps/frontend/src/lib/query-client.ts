import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './api-client'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,      // 2 minutes
      retry: (failureCount, error) => {
        // Don't retry auth errors or not-found
        if (error instanceof ApiError) {
          if (error.isUnauthorized || error.isNotFound) return false
        }
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})
