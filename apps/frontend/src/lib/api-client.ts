// API client — attaches Firebase ID token to every request
// Never exposes AI keys, DB credentials, or Firebase Admin credentials

import { auth } from './firebase'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

async function getAuthHeader(): Promise<Record<string, string>> {
  const user = auth.currentUser
  if (!user) return {}
  const token = await user.getIdToken()
  return { Authorization: `Bearer ${token}` }
}

interface ApiClientOptions extends RequestInit {
  skipAuth?: boolean
}

async function request<T>(path: string, options: ApiClientOptions = {}): Promise<T> {
  const { skipAuth = false, headers = {}, ...rest } = options
  const authHeaders = skipAuth ? {} : await getAuthHeader()

  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(headers as Record<string, string>),
    },
    ...rest,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({
      error: { code: 'NETWORK_ERROR', message: 'Request failed' },
    }))
    throw new ApiError(
      response.status,
      errorBody.error?.code ?? 'UNKNOWN_ERROR',
      errorBody.error?.message ?? 'An error occurred'
    )
  }

  return response.json() as Promise<T>
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }

  get isUnauthorized() {
    return this.status === 401
  }
  get isNotFound() {
    return this.status === 404
  }
  get isConflict() {
    return this.status === 409
  }
}

export const apiClient = {
  get: <T>(path: string, opts?: ApiClientOptions) =>
    request<T>(path, { method: 'GET', ...opts }),

  post: <T>(path: string, body?: unknown, opts?: ApiClientOptions) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), ...opts }),

  patch: <T>(path: string, body?: unknown, opts?: ApiClientOptions) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body), ...opts }),

  put: <T>(path: string, body?: unknown, opts?: ApiClientOptions) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body), ...opts }),

  delete: <T>(path: string, opts?: ApiClientOptions) =>
    request<T>(path, { method: 'DELETE', ...opts }),
}
