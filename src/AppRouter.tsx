import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from './lib/store'
import { LoginPage } from './pages/LoginPage'
import { SelectAccountPage } from './pages/SelectAccountPage'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { DashboardPage } from './pages/DashboardPage'
import { AdminsPage } from './pages/AdminsPage'
import { StaffPage } from './pages/StaffPage'
import { AgentsPage } from './pages/AgentsPage'
import { CustomersPage } from './pages/CustomersPage'
import { ProvidersPage } from './pages/ProvidersPage'
import { CommissionsPage } from './pages/CommissionsPage'
import { ContentPage } from './pages/ContentPage'
import { SupportPage } from './pages/SupportPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { SettingsPage } from './pages/SettingsPage'

export function AppRouter() {
	// Authentication toggle via environment variable
	// Set VITE_ENABLE_AUTH=true to enable authentication
	const authEnabled = import.meta.env.VITE_ENABLE_AUTH === 'true'
	const { isAuthenticated, account } = useSelector((state: RootState) => state.auth)

	if (authEnabled && !isAuthenticated) {
		return (
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		)
	}

	if (authEnabled && !account) {
		return (
			<Routes>
				<Route path="/select-account" element={<SelectAccountPage />} />
				<Route path="*" element={<Navigate to="/select-account" replace />} />
			</Routes>
		)
	}

	return (
		<DashboardLayout>
			<Routes>
				<Route path="/" element={<Navigate to="/dashboard" replace />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/admins" element={<AdminsPage />} />
				<Route path="/staff" element={<StaffPage />} />
				<Route path="/agents" element={<AgentsPage />} />
				<Route path="/customers" element={<CustomersPage />} />
				<Route path="/providers" element={<ProvidersPage />} />
				<Route path="/commissions" element={<CommissionsPage />} />
				<Route path="/content" element={<ContentPage />} />
				<Route path="/support" element={<SupportPage />} />
				<Route path="/analytics" element={<AnalyticsPage />} />
				<Route path="/settings" element={<SettingsPage />} />
				<Route path="*" element={<Navigate to="/dashboard" replace />} />
			</Routes>
		</DashboardLayout>
	)
}
