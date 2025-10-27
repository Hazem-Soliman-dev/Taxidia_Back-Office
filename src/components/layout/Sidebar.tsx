import { Link, useLocation } from 'react-router-dom'
import { X, Home, Shield, Users, UserCheck, Settings, DollarSign, FileText, MessageSquare, BarChart3, Cog, Briefcase } from 'lucide-react'

interface SidebarProps {
	open: boolean
	onClose: () => void
}

const navigation = [
	{ name: 'Dashboard', href: '/dashboard', icon: Home },
	{ name: 'Admins', href: '/admins', icon: Shield },
	{ name: 'Staff', href: '/staff', icon: UserCheck },
	{ name: 'Agents', href: '/agents', icon: Briefcase },
	{ name: 'Customers', href: '/customers', icon: Users },
	{ name: 'Providers', href: '/providers', icon: Settings },
	{ name: 'Commissions', href: '/commissions', icon: DollarSign },
	{ name: 'Content', href: '/content', icon: FileText },
	{ name: 'Support', href: '/support', icon: MessageSquare },
	{ name: 'Analytics', href: '/analytics', icon: BarChart3 },
	{ name: 'Settings', href: '/settings', icon: Cog },
]

export function Sidebar({ open, onClose }: SidebarProps) {
	const location = useLocation()

	return (
		<>
			{/* Mobile sidebar overlay */}
			{open && (
				<div className="fixed inset-0 z-50 lg:hidden">
					<div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
				</div>
			)}

			{/* Sidebar */}
			<div className={`w-[280px] sm:w-64 bg-card shadow-lg flex-shrink-0 lg:relative lg:translate-x-0 lg:z-auto ${open
				? 'fixed inset-y-0 left-0 z-50 translate-x-0'
				: 'fixed inset-y-0 left-0 z-50 -translate-x-full lg:translate-x-0'
				} transition-transform duration-300 ease-in-out`}>
				<div className="flex h-full flex-col">
					{/* Logo */}
					<div className="flex h-16 items-center justify-between px-4 border-b border-border">
						<div className="flex items-center">
							<img
								src="/taxidia-logo.png"
								alt="Taxidia Logo"
								className="h-8 sm:h-10 w-auto max-w-[180px] object-contain"
							/>
						</div>
						<button
							onClick={onClose}
							className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent min-h-[44px] min-w-[44px]"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
						{navigation.map((item) => {
							const isActive = location.pathname === item.href
							return (
								<Link
									key={item.name}
									to={item.href}
									className={`flex items-center px-3 py-3 min-h-[44px] rounded-md text-sm font-medium transition-colors ${isActive
										? 'bg-primary/10 text-primary'
										: 'text-muted-foreground hover:text-foreground'
										}`}
									onClick={onClose}
								>
									<item.icon className="mr-3 h-5 w-5" />
									{item.name}
								</Link>
							)
						})}
					</nav>

					{/* Footer */}
					<div className="p-4 border-t border-border">
						<div className="text-xs text-muted-foreground">
							Taxidia Back Office v1.0.0
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
