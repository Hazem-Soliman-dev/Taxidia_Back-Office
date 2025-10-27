import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useToast } from '../hooks/use-toast'
import { Download, RefreshCw, TrendingUp, TrendingDown, ArrowUp } from 'lucide-react'
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	ScatterChart,
	Scatter,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Area,
	AreaChart
} from 'recharts'

// Mock data for charts
const revenueData = [
	{ month: 'Jan', total: 45000, net: 38000, commission: 7000 },
	{ month: 'Feb', total: 52000, net: 44000, commission: 8000 },
	{ month: 'Mar', total: 48000, net: 41000, commission: 7000 },
	{ month: 'Apr', total: 61000, net: 52000, commission: 9000 },
	{ month: 'May', total: 55000, net: 47000, commission: 8000 },
	{ month: 'Jun', total: 67000, net: 57000, commission: 10000 },
]

const bookingsData = [
	{ month: 'Jan', confirmed: 120, pending: 15, cancelled: 8 },
	{ month: 'Feb', confirmed: 145, pending: 20, cancelled: 10 },
	{ month: 'Mar', confirmed: 132, pending: 18, cancelled: 12 },
	{ month: 'Apr', confirmed: 168, pending: 22, cancelled: 9 },
	{ month: 'May', confirmed: 155, pending: 19, cancelled: 11 },
	{ month: 'Jun', confirmed: 189, pending: 25, cancelled: 7 },
]

const providerData = [
	{ name: 'Booking.com', successRate: 98, responseTime: 245, bookings: 450 },
	{ name: 'Expedia', successRate: 96, responseTime: 312, bookings: 380 },
	{ name: 'Hotels.com', successRate: 94, responseTime: 289, bookings: 320 },
	{ name: 'Agoda', successRate: 92, responseTime: 356, bookings: 280 },
]

const destinationData = [
	{ name: 'Paris', value: 28, color: '#E90B35' },
	{ name: 'Tokyo', value: 22, color: '#11161F' },
	{ name: 'New York', value: 18, color: '#787878' },
	{ name: 'London', value: 15, color: '#161616' },
	{ name: 'Other', value: 17, color: '#F5F5F5' },
]

const agentPerformanceData = [
	{ name: 'Sarah', bookings: 45, revenue: 15000, satisfaction: 4.8, tier: 'Gold' },
	{ name: 'John', bookings: 38, revenue: 12500, satisfaction: 4.6, tier: 'Gold' },
	{ name: 'Mike', bookings: 28, revenue: 9200, satisfaction: 4.5, tier: 'Gold' },
	{ name: 'Emma', bookings: 22, revenue: 7500, satisfaction: 4.7, tier: 'Silver' },
	{ name: 'Alex', bookings: 18, revenue: 6100, satisfaction: 4.4, tier: 'Silver' },
]

const conversionData = [
	{ stage: 'Visits', value: 10000, rate: 100 },
	{ stage: 'Searches', value: 7500, rate: 75 },
	{ stage: 'Results', value: 5200, rate: 52 },
	{ stage: 'Bookings', value: 1560, rate: 15.6 },
	{ stage: 'Payments', value: 1234, rate: 12.3 },
]

export function AnalyticsPage() {
	const { toast } = useToast()
	const [dateRange, setDateRange] = useState('month')

	const handleExport = (format: string) => {
		toast({
			title: "Exporting Report",
			description: `Analytics report is being exported as ${format.toUpperCase()}`,
		})
	}

	const handleRefresh = () => {
		toast({
			title: "Refreshing Data",
			description: "Analytics data is being updated",
		})
	}

	const MetricCard = ({ title, value, change, icon: Icon }: { title: string, value: string, change: number, icon: React.ElementType }) => (
		<Card>
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-600">{title}</p>
						<p className="text-2xl font-bold mt-1">{value}</p>
						<div className={`flex items-center gap-1 mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
							{change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
							<span>{Math.abs(change)}%</span>
							<span className="text-gray-500">vs last period</span>
						</div>
					</div>
					<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
						<Icon className="h-6 w-6 text-primary" />
					</div>
				</div>
			</CardContent>
		</Card>
	)

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Analytics</h1>
					<p className="text-gray-600 mt-2">
						Comprehensive business insights and performance metrics
					</p>
				</div>

				<div className="flex gap-2 mt-4 sm:mt-0">
					<Select value={dateRange} onValueChange={setDateRange}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="today">Today</SelectItem>
							<SelectItem value="week">This Week</SelectItem>
							<SelectItem value="month">This Month</SelectItem>
							<SelectItem value="quarter">This Quarter</SelectItem>
							<SelectItem value="year">This Year</SelectItem>
							<SelectItem value="custom">Custom Range</SelectItem>
						</SelectContent>
					</Select>

					<Button variant="outline" onClick={handleRefresh}>
						<RefreshCw className="h-4 w-4 mr-2" />
						Refresh
					</Button>

					<Select onValueChange={handleExport}>
						<SelectTrigger className="w-32">
							<Download className="h-4 w-4 mr-2" />
							<SelectValue placeholder="Export" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="pdf">Export PDF</SelectItem>
							<SelectItem value="excel">Export Excel</SelectItem>
							<SelectItem value="csv">Export CSV</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
				<MetricCard title="Total Revenue" value="$125,430" change={12} icon={TrendingUp} />
				<MetricCard title="Total Bookings" value="1,234" change={8} icon={ArrowUp} />
				<MetricCard title="Avg Booking Value" value="$101.65" change={3} icon={TrendingUp} />
				<MetricCard title="Conversion Rate" value="3.2%" change={-0.5} icon={TrendingDown} />
				<MetricCard title="Active Users" value="5,678" change={15} icon={ArrowUp} />
				<MetricCard title="Satisfaction" value="4.5/5" change={0.2} icon={TrendingUp} />
			</div>

			{/* Revenue Chart */}
			<Card>
				<CardHeader>
					<CardTitle>Revenue Overview</CardTitle>
					<CardDescription>Total revenue, net revenue, and commissions over time</CardDescription>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={revenueData}>
							<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
							<XAxis dataKey="month" stroke="#888" />
							<YAxis stroke="#888" />
							<Tooltip
								contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
								formatter={(value) => `$${value.toLocaleString()}`}
							/>
							<Legend />
							<Line type="monotone" dataKey="total" stroke="#E90B35" strokeWidth={2} name="Total Revenue" />
							<Line type="monotone" dataKey="net" stroke="#11161F" strokeWidth={2} name="Net Revenue" />
							<Line type="monotone" dataKey="commission" stroke="#787878" strokeWidth={2} name="Commissions" />
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Bookings Chart */}
				<Card>
					<CardHeader>
						<CardTitle>Bookings Status</CardTitle>
						<CardDescription>Confirmed, pending, and cancelled bookings</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={bookingsData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
								<XAxis dataKey="month" stroke="#888" />
								<YAxis stroke="#888" />
								<Tooltip
									contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
								/>
								<Legend />
								<Bar dataKey="confirmed" stackId="a" fill="#10b981" name="Confirmed" />
								<Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
								<Bar dataKey="cancelled" stackId="a" fill="#ef4444" name="Cancelled" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Top Destinations Pie Chart */}
				<Card>
					<CardHeader>
						<CardTitle>Top Destinations</CardTitle>
						<CardDescription>Booking distribution by destination</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={destinationData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label
									outerRadius={100}
									fill="#8884d8"
									dataKey="value"
								>
									{destinationData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Provider Performance */}
			<Card>
				<CardHeader>
					<CardTitle>Provider Performance</CardTitle>
					<CardDescription>Success rate, response time, and booking volume by provider</CardDescription>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={providerData} layout="vertical">
							<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
							<XAxis type="number" stroke="#888" />
							<YAxis dataKey="name" type="category" stroke="#888" width={100} />
							<Tooltip
								contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
							/>
							<Legend />
							<Bar dataKey="successRate" fill="#10b981" name="Success Rate %" />
							<Bar dataKey="bookings" fill="#E90B35" name="Bookings" />
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Agent Performance Scatter */}
			<Card>
				<CardHeader>
					<CardTitle>Agent Performance</CardTitle>
					<CardDescription>Bookings vs Revenue by agent (bubble size = satisfaction score)</CardDescription>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<ScatterChart>
							<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
							<XAxis dataKey="bookings" name="Bookings" stroke="#888" />
							<YAxis dataKey="revenue" name="Revenue" stroke="#888" />
							<Tooltip
								cursor={{ strokeDasharray: '3 3' }}
								contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
								formatter={(value, name) => {
									if (name === 'revenue') return `$${value.toLocaleString()}`
									return value
								}}
							/>
							<Legend />
							<Scatter name="Agents" data={agentPerformanceData} fill="#E90B35">
								{agentPerformanceData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={
										entry.tier === 'Gold' ? '#f59e0b' :
											entry.tier === 'Silver' ? '#94a3b8' :
												'#cd7f32'
									} />
								))}
							</Scatter>
						</ScatterChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Conversion Funnel */}
			<Card>
				<CardHeader>
					<CardTitle>Conversion Funnel</CardTitle>
					<CardDescription>User journey from visits to completed payments</CardDescription>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<AreaChart data={conversionData}>
							<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
							<XAxis dataKey="stage" stroke="#888" />
							<YAxis stroke="#888" />
							<Tooltip
								contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
								formatter={(value, name) => {
									if (name === 'value') return value.toLocaleString()
									return `${value}%`
								}}
							/>
							<Legend />
							<Area type="monotone" dataKey="value" stroke="#E90B35" fill="#E90B35" fillOpacity={0.6} name="Users" />
						</AreaChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Data Tables */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Top Performing Agents */}
				<Card>
					<CardHeader>
						<CardTitle>Top Performing Agents</CardTitle>
						<CardDescription>Agents ranked by revenue this month</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{agentPerformanceData.map((agent, idx) => (
								<div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
											<span className="text-sm font-medium text-indigo-600">
												{agent.name.charAt(0)}
											</span>
										</div>
										<div>
											<div className="font-medium">{agent.name}</div>
											<div className="text-sm text-gray-500">
												{agent.bookings} bookings • {agent.satisfaction}★
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="font-semibold text-primary">
											${agent.revenue.toLocaleString()}
										</div>
										<div className="text-xs text-gray-500">{agent.tier} Tier</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Best Selling Destinations */}
				<Card>
					<CardHeader>
						<CardTitle>Best Selling Destinations</CardTitle>
						<CardDescription>Top destinations by booking volume</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{[
								{ name: 'Paris, France', bookings: 345, revenue: 42000, avgPrice: 122 },
								{ name: 'Tokyo, Japan', bookings: 272, revenue: 38000, avgPrice: 140 },
								{ name: 'New York, USA', bookings: 221, revenue: 31000, avgPrice: 140 },
								{ name: 'London, UK', bookings: 185, revenue: 26000, avgPrice: 141 },
							].map((dest, idx) => (
								<div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
									<div>
										<div className="font-medium">{dest.name}</div>
										<div className="text-sm text-gray-500">
											{dest.bookings} bookings • ${dest.avgPrice} avg
										</div>
									</div>
									<div className="text-right">
										<div className="font-semibold text-primary">
											${dest.revenue.toLocaleString()}
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
