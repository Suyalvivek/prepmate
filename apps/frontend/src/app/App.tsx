import { ThemeProvider } from './providers/ThemeProvider'
import { QueryProvider } from './providers/QueryProvider'
import { AuthProvider } from './providers/AuthProvider'
import { Router } from './router'

export function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
