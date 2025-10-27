import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../lib/store'
import { logout } from '../../lib/store/slices/authSlice'
import { removeToken } from '../../lib/api/client'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ImpersonationBanner } from './ImpersonationBanner'

interface DashboardLayoutProps {
	children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const { user, account, isImpersonating, impersonatedUser } = useSelector((state: RootState) => state.auth)
	const dispatch = useDispatch()

	const handleLogout = () => {
		removeToken()
		dispatch(logout())
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Impersonation Banner */}
			{isImpersonating && impersonatedUser && (
				<ImpersonationBanner user={impersonatedUser} />
			)}

			{/* Layout Container */}
			<div className="flex h-screen overflow-hidden">
				{/* Sidebar */}
				<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

				{/* Main Content */}
				<div className="flex-1 flex flex-col overflow-hidden min-w-0">
					{/* Header */}
					<Header
						user={user}
						account={account}
						onLogout={handleLogout}
						onMenuClick={() => setSidebarOpen(true)}
					/>

					{/* Page Content */}
					<main className="flex-1 overflow-y-auto overflow-x-hidden py-6 bg-background">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
							{children}
						</div>
					</main>
				</div>
			</div>
		</div>
	)
}
