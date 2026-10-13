import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useState } from 'react'

export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((p) => !p)} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar sidebarCollapsed={sidebarCollapsed} />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 focus:outline-none bg-[#f6f8fa] dark:bg-[#0c1421] transition-colors"
          tabIndex={-1}
        >
          <div className="mx-auto max-w-[1580px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
