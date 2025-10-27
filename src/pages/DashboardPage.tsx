import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import {
	Users,
	UserCheck,
	Briefcase,
	Shield,
	Calendar,
	DollarSign,
	Settings,
	MessageSquare,
	UserPlus,
	Tag,
	BarChart3,
	Download,
	ArrowUpRight,
	ArrowDownRight,
	Clock,
	CheckCircle,
	TrendingUp
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts'
// Mock Data
const mockStats = {
	customers: { total: 1247, active: 1089, changePercent: 12.5 },
	staff: { total: 24, support: 8, content: 6, analysts: 10 },
	agents: { total: 156, active: 142, topPerformer: 'Sarah Johnson' },
	admins: { total: 5, superAdmins: 2 },
	bookings: { total: 3842, thisMonth: 456, changePercent: 18.3 },
	revenue: { total: 284750, thisMonth: 45280, changePercent: 22.7 },
	providers: { total: 8, active: 6, mergeEnabled: true },
	support: { open: 23, urgent: 5, resolved: 187 }
}

const mockRecentActivity = [
	{ id: 1, type: 'customer', action: 'New customer registered', user: 'John Doe', timestamp: '2 minutes ago', icon: Users },
	{ id: 2, type: 'booking', action: 'New booking created', user: 'Jane Smith', timestamp: '15 minutes ago', icon: Calendar },
	{ id: 3, type: 'support', action: 'Support ticket opened', user: 'Mike Wilson', timestamp: '32 minutes ago', icon: MessageSquare },
	{ id: 4, type: 'staff', action: 'Staff member logged in', user: 'Emily Brown', timestamp: '1 hour ago', icon: UserCheck },
	{ id: 5, type: 'customer', action: 'Customer profile updated', user: 'David Lee', timestamp: '2 hours ago', icon: Users },
	{ id: 6, type: 'booking', action: 'Booking confirmed', user: 'Sarah Johnson', timestamp: '3 hours ago', icon: CheckCircle },
	{ id: 7, type: 'support', action: 'Ticket resolved', user: 'Tom Anderson', timestamp: '4 hours ago', icon: CheckCircle },
	{ id: 8, type: 'system', action: 'System backup completed', user: 'System', timestamp: '5 hours ago', icon: Download },
]

const mockBookingTrends = [
	{ date: 'Mon', bookings: 45 },
	{ date: 'Tue', bookings: 52 },
	{ date: 'Wed', bookings: 48 },
	{ date: 'Thu', bookings: 61 },
	{ date: 'Fri', bookings: 55 },
	{ date: 'Sat', bookings: 67 },
	{ date: 'Sun', bookings: 58 },
]

const mockRevenueByProvider = [
	{ provider: 'Amadeus', revenue: 45000 },
	{ provider: 'Sabre', revenue: 38000 },
	{ provider: 'Travelport', revenue: 32000 },
	{ provider: 'Expedia', revenue: 28000 },
	{ provider: 'Booking.com', revenue: 25000 },
]

const mockUserGrowth = [
	{ date: 'Week 1', customers: 980 },
	{ date: 'Week 2', customers: 1045 },
	{ date: 'Week 3', customers: 1120 },
	{ date: 'Week 4', customers: 1247 },
]

interface StatCardProps {
	title: string
	value: string | number
	change?: number
	icon: React.ElementType
	actionLabel: string
	actionPath: string
	subtitle?: string
}

function StatCard({ title, value, change, icon: Icon, actionLabel, actionPath, subtitle }: StatCardProps) {
	const navigate = useNavigate()

	return (
		<Card className="hover:shadow-lg transition-shadow min-w-[280px] flex-shrink-0 md:min-w-0">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				{subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
				{change !== undefined && (
					<div className="flex items-center gap-1 mt-1">
						{change >= 0 ? (
							<ArrowUpRight className="h-3 w-3 text-green-600" />
						) : (
							<ArrowDownRight className="h-3 w-3 text-red-600" />
						)}
						<p className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
							{change >= 0 ? '+' : ''}{change}% from last month
						</p>
					</div>
				)}
				<Button
					variant="link"
					size="sm"
					className="mt-2 p-0 h-auto text-primary hover:text-primary/80"
					onClick={() => navigate(actionPath)}
				>
					{actionLabel} →
				</Button>
			</CardContent>
		</Card>
	)
}

export function DashboardPage() {
	const navigate = useNavigate()
	const { user } = useSelector((state: RootState) => state.auth)
	const [currentTime] = useState(new Date().toLocaleString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}))

	const quickActions = [
		{ title: 'Add Customer', icon: UserPlus, path: '/customers', color: 'bg-blue-500' },
		{ title: 'Add Staff', icon: UserCheck, path: '/staff', color: 'bg-green-500' },
		{ title: 'Add Agent', icon: Briefcase, path: '/agents', color: 'bg-purple-500' },
		{ title: 'Create Offer', icon: Tag, path: '/content', color: 'bg-orange-500' },
		{ title: 'View Reports', icon: BarChart3, path: '/analytics', color: 'bg-indigo-500' },
		{ title: 'Export Backup', icon: Download, path: '/settings', color: 'bg-gray-500' },
		{ title: 'Manage Providers', icon: Settings, path: '/providers', color: 'bg-teal-500' },
		{ title: 'View Support', icon: MessageSquare, path: '/support', color: 'bg-red-500' },
	]

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Welcome back, {user?.name || 'Admin'}!
					</h1>
					<p className="text-muted-foreground mt-2 flex items-center gap-2">
						<Clock className="h-4 w-4" />
						{currentTime}
					</p>
				</div>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						{quickActions.map((action) => (
							<button
								key={action.title}
								onClick={() => navigate(action.path)}
								className="flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors group"
							>
								<div className={`${action.color} p-3 rounded-full group-hover:scale-110 transition-transform`}>
									<action.icon className="h-5 w-5 text-white" />
								</div>
								<span className="text-sm font-medium text-center">{action.title}</span>
							</button>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Stats Grid */}
			<div className="flex gap-4 overflow-x-auto pb-2 scroll-container md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-x-visible md:pb-0">
				<StatCard
					title="Total Customers"
					value={mockStats.customers.total.toLocaleString()}
					change={mockStats.customers.changePercent}
					icon={Users}
					actionLabel="View All Customers"
					actionPath="/customers"
					subtitle={`${mockStats.customers.active} active`}
				/>
				<StatCard
					title="Active Staff"
					value={mockStats.staff.total}
					icon={UserCheck}
					actionLabel="Manage Staff"
					actionPath="/staff"
					subtitle={`${mockStats.staff.support} support, ${mockStats.staff.content} content`}
				/>
				<StatCard
					title="Sales Agents"
					value={mockStats.agents.total}
					icon={Briefcase}
					actionLabel="View Agents"
					actionPath="/agents"
					subtitle={`Top: ${mockStats.agents.topPerformer}`}
				/>
				<StatCard
					title="Administrators"
					value={mockStats.admins.total}
					icon={Shield}
					actionLabel="Manage Admins"
					actionPath="/admins"
					subtitle={`${mockStats.admins.superAdmins} super admins`}
				/>
				<StatCard
					title="Total Bookings"
					value={mockStats.bookings.thisMonth.toLocaleString()}
					change={mockStats.bookings.changePercent}
					icon={Calendar}
					actionLabel="View Analytics"
					actionPath="/analytics"
					subtitle="This month"
				/>
				<StatCard
					title="Revenue"
					value={`$${mockStats.revenue.thisMonth.toLocaleString()}`}
					change={mockStats.revenue.changePercent}
					icon={DollarSign}
					actionLabel="View Reports"
					actionPath="/analytics"
					subtitle="This month"
				/>
				<StatCard
					title="Active Providers"
					value={`${mockStats.providers.active}/${mockStats.providers.total}`}
					icon={Settings}
					actionLabel="Manage Providers"
					actionPath="/providers"
					subtitle={mockStats.providers.mergeEnabled ? 'Merge enabled' : 'Merge disabled'}
				/>
				<StatCard
					title="Support Tickets"
					value={mockStats.support.open}
					icon={MessageSquare}
					actionLabel="View Support"
					actionPath="/support"
					subtitle={`${mockStats.support.urgent} urgent`}
				/>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Recent Activity - 2 columns */}
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex gap-4 overflow-x-auto pb-2 scroll-container lg:flex-col lg:space-y-4 lg:space-x-0 lg:overflow-x-visible lg:pb-0">
								{mockRecentActivity.map((activity) => (
									<div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg transition-colors min-w-[280px] flex-shrink-0 lg:min-w-0 lg:w-full">
										<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
											<activity.icon className="h-4 w-4 text-primary" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium">{activity.action}</p>
											<p className="text-sm text-muted-foreground">{activity.user}</p>
										</div>
										<span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Quick Stats - 1 column */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>System Status</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<CheckCircle className="h-4 w-4 text-green-600" />
									<span className="text-sm">All Systems Operational</span>
								</div>
							</div>
							<div className="space-y-2 pt-2 border-t">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">API Status</span>
									<span className="text-green-600 font-medium">Online</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Database</span>
									<span className="text-green-600 font-medium">Healthy</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Providers</span>
									<span className="text-green-600 font-medium">{mockStats.providers.active}/{mockStats.providers.total} Active</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Today's Summary</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">New Bookings</span>
								<span className="text-lg font-bold">24</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Revenue</span>
								<span className="text-lg font-bold">$12,450</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">New Customers</span>
								<span className="text-lg font-bold">8</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Tickets Resolved</span>
								<span className="text-lg font-bold">15</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Bookings Trend */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-md md:text-base">
							<TrendingUp className="h-5 w-5" />
							Bookings Trend (Last 7 Days)
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={mockBookingTrends}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip />
									<Line type="monotone" dataKey="bookings" stroke="#E90B35" strokeWidth={2} />
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				{/* Revenue by Provider */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-md md:text-base">
							<DollarSign className="h-5 w-5" />
							Revenue by Provider (Top 5)
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={mockRevenueByProvider}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="provider" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="revenue" fill="#E90B35" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				{/* User Growth */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-md md:text-base">
							<Users className="h-5 w-5" />
							Customer Growth (Last 30 Days)
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={mockUserGrowth}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip />
									<Area type="monotone" dataKey="customers" stroke="#E90B35" fill="#E90B35" fillOpacity={0.2} />
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
