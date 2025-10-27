import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useToast } from '../hooks/use-toast'
import { Plus, Search, Filter, Edit, Trash2, TrendingUp, DollarSign, Eye, Clock } from 'lucide-react'

interface Agent {
	id: number
	name: string
	email: string
	phone: string
	commissionTier: 'bronze' | 'silver' | 'gold' | 'platinum'
	commissionRate: number
	totalBookings: number
	totalRevenue: number
	territory: string
	status: 'active' | 'on_leave' | 'inactive'
	last_active: string
}

const mockAgents: Agent[] = [
	{
		id: 1,
		name: 'Sarah Agent',
		email: 'sarah@taxidia.com',
		phone: '+1234567890',
		commissionTier: 'gold',
		commissionRate: 10,
		totalBookings: 45,
		totalRevenue: 15000,
		territory: 'North America',
		status: 'active',
		last_active: '5 minutes ago'
	},
	{
		id: 2,
		name: 'John Sales',
		email: 'john.sales@taxidia.com',
		phone: '+1234567891',
		commissionTier: 'gold',
		commissionRate: 10,
		totalBookings: 38,
		totalRevenue: 12500,
		territory: 'Europe',
		status: 'active',
		last_active: '1 hour ago'
	},
	{
		id: 3,
		name: 'Mike Rep',
		email: 'mike@taxidia.com',
		phone: '+1234567892',
		commissionTier: 'silver',
		commissionRate: 7,
		totalBookings: 22,
		totalRevenue: 7500,
		territory: 'Asia',
		status: 'active',
		last_active: '30 minutes ago'
	},
]

export function AgentsPage() {
	const { toast } = useToast()
	const [agents] = useState<Agent[]>(mockAgents)
	const [searchTerm, setSearchTerm] = useState('')
	const [tierFilter, setTierFilter] = useState<string>('all')
	const [statusFilter, setStatusFilter] = useState<string>('all')
	const [addDialogOpen, setAddDialogOpen] = useState(false)
	const [filterDialogOpen, setFilterDialogOpen] = useState(false)

	const [newAgent, setNewAgent] = useState({
		name: '',
		email: '',
		phone: '',
		commissionRate: '7',
		commissionTier: 'silver',
		territory: '',
		status: 'active'
	})

	const filteredAgents = agents.filter(agent => {
		const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			agent.territory.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesTier = tierFilter === 'all' || agent.commissionTier === tierFilter
		const matchesStatus = statusFilter === 'all' || agent.status === statusFilter

		return matchesSearch && matchesTier && matchesStatus
	})

	const handleAddAgent = (e: React.FormEvent) => {
		e.preventDefault()
		toast({
			title: "Agent Added",
			description: `${newAgent.name} has been added successfully.`,
		})
		setAddDialogOpen(false)
		setNewAgent({ name: '', email: '', phone: '', commissionRate: '7', commissionTier: 'silver', territory: '', status: 'active' })
	}

	const handleApplyFilters = () => {
		setFilterDialogOpen(false)
		toast({
			title: "Filters Applied",
			description: `Showing ${filteredAgents.length} agent(s)`,
		})
	}

	const handleClearFilters = () => {
		setTierFilter('all')
		setStatusFilter('all')
		toast({
			title: "Filters Cleared",
			description: "All filters have been reset",
		})
	}

	const getAgentsByTier = (tier: string) => {
		if (tier === 'all') return filteredAgents
		return filteredAgents.filter(agent => agent.commissionTier === tier)
	}

	const getTierBadgeColor = (tier: string) => {
		switch (tier) {
			case 'platinum': return 'bg-purple-100 text-purple-800'
			case 'gold': return 'bg-yellow-100 text-yellow-800'
			case 'silver': return 'bg-gray-100 text-gray-800'
			case 'bronze': return 'bg-orange-100 text-orange-800'
			default: return 'bg-gray-100 text-gray-800'
		}
	}

	const AgentTable = ({ agents }: { agents: Agent[] }) => (
		<div className="space-y-4 overflow-x-auto">
			{agents.map((agent) => (
				<div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg min-w-[700px]">
					<div className="flex items-center gap-4 flex-1">
						<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
							<span className="text-sm font-medium text-blue-600">
								{agent.name.charAt(0)}
							</span>
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<h3 className="font-medium text-gray-900">{agent.name}</h3>
								<Badge className={getTierBadgeColor(agent.commissionTier)}>
									{agent.commissionTier.toUpperCase()}
								</Badge>
								<Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
									{agent.status.replace('_', ' ')}
								</Badge>
							</div>
							<p className="text-sm text-gray-500">{agent.email}</p>
							<div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
								<span>{agent.territory}</span>
								<span>{agent.totalBookings} bookings</span>
								<span>${agent.totalRevenue.toLocaleString()} revenue</span>
								<span className="flex items-center gap-1">
									<Clock className="h-3 w-3" />
									{agent.last_active}
								</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<div className="text-right mr-4">
							<div className="font-semibold text-primary">{agent.commissionRate}%</div>
							<div className="text-xs text-gray-500">Commission</div>
						</div>
						<Button variant="outline" size="sm" title="View Performance">
							<TrendingUp className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm" title="View Bookings">
							<Eye className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm" title="Adjust Commission">
							<DollarSign className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm">
							<Edit className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</div>
			))}

			{agents.length === 0 && (
				<div className="text-center py-8">
					<p className="text-gray-500">No agents found</p>
				</div>
			)}
		</div>
	)

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Sales Agents</h1>
					<p className="text-gray-600 mt-2">
						Manage sales agents and commission tracking
					</p>
				</div>

				<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
					<DialogTrigger asChild>
						<Button className="w-full sm:w-auto">
							<Plus className="h-4 w-4 mr-2" />
							Add Agent
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>Add New Agent</DialogTitle>
							<DialogDescription>
								Create a new sales agent account
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleAddAgent}>
							<div className="space-y-4 py-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="name">Name</Label>
										<Input
											id="name"
											value={newAgent.name}
											onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
											placeholder="John Doe"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											value={newAgent.email}
											onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
											placeholder="john@example.com"
											required
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="phone">Phone</Label>
										<Input
											id="phone"
											type="tel"
											value={newAgent.phone}
											onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
											placeholder="+1234567890"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="territory">Territory/Region</Label>
										<Input
											id="territory"
											value={newAgent.territory}
											onChange={(e) => setNewAgent({ ...newAgent, territory: e.target.value })}
											placeholder="North America"
											required
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="commissionRate">Commission Rate (%)</Label>
										<Input
											id="commissionRate"
											type="number"
											min="0"
											max="100"
											step="0.1"
											value={newAgent.commissionRate}
											onChange={(e) => setNewAgent({ ...newAgent, commissionRate: e.target.value })}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="commissionTier">Commission Tier</Label>
										<Select value={newAgent.commissionTier} onValueChange={(value) => setNewAgent({ ...newAgent, commissionTier: value })}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="bronze">Bronze</SelectItem>
												<SelectItem value="silver">Silver</SelectItem>
												<SelectItem value="gold">Gold</SelectItem>
												<SelectItem value="platinum">Platinum</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="status">Status</Label>
									<Select value={newAgent.status} onValueChange={(value) => setNewAgent({ ...newAgent, status: value })}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="active">Active</SelectItem>
											<SelectItem value="on_leave">On Leave</SelectItem>
											<SelectItem value="inactive">Inactive</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<DialogFooter>
								<Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
									Cancel
								</Button>
								<Button type="submit">Add Agent</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="p-6">
					<div className="flex gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									placeholder="Search agents..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						<Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
							<DialogTrigger asChild>
								<Button variant="outline">
									<Filter className="h-4 w-4 mr-2" />
									Filters
									{(tierFilter !== 'all' || statusFilter !== 'all') && (
										<Badge variant="default" className="ml-2">Active</Badge>
									)}
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Filter Agents</DialogTitle>
									<DialogDescription>
										Apply filters to narrow down the agent list
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4 py-4">
									<div className="space-y-2">
										<Label htmlFor="tier-filter">Commission Tier</Label>
										<Select value={tierFilter} onValueChange={setTierFilter}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Tiers</SelectItem>
												<SelectItem value="platinum">Platinum</SelectItem>
												<SelectItem value="gold">Gold</SelectItem>
												<SelectItem value="silver">Silver</SelectItem>
												<SelectItem value="bronze">Bronze</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label htmlFor="status-filter">Status</Label>
										<Select value={statusFilter} onValueChange={setStatusFilter}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Statuses</SelectItem>
												<SelectItem value="active">Active</SelectItem>
												<SelectItem value="on_leave">On Leave</SelectItem>
												<SelectItem value="inactive">Inactive</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<DialogFooter>
									<Button type="button" variant="outline" onClick={handleClearFilters}>
										Clear Filters
									</Button>
									<Button type="button" onClick={handleApplyFilters}>
										Apply Filters
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</CardContent>
			</Card>

			{/* Agents Tabs */}
			<Tabs defaultValue="all" className="space-y-4">
				<TabsList>
					<TabsTrigger value="all">All Agents ({filteredAgents.length})</TabsTrigger>
					<TabsTrigger value="active">Active ({filteredAgents.filter(a => a.status === 'active').length})</TabsTrigger>
					<TabsTrigger value="top">Top Performers ({getAgentsByTier('gold').length + getAgentsByTier('platinum').length})</TabsTrigger>
					<TabsTrigger value="inactive">Inactive ({filteredAgents.filter(a => a.status === 'inactive').length})</TabsTrigger>
				</TabsList>

				<TabsContent value="all">
					<Card>
						<CardHeader>
							<CardTitle>All Agents</CardTitle>
						</CardHeader>
						<CardContent>
							<AgentTable agents={filteredAgents} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="active">
					<Card>
						<CardHeader>
							<CardTitle>Active Agents</CardTitle>
						</CardHeader>
						<CardContent>
							<AgentTable agents={filteredAgents.filter(a => a.status === 'active')} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="top">
					<Card>
						<CardHeader>
							<CardTitle>Top Performers</CardTitle>
						</CardHeader>
						<CardContent>
							<AgentTable agents={[...getAgentsByTier('platinum'), ...getAgentsByTier('gold')]} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="inactive">
					<Card>
						<CardHeader>
							<CardTitle>Inactive Agents</CardTitle>
						</CardHeader>
						<CardContent>
							<AgentTable agents={filteredAgents.filter(a => a.status === 'inactive')} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}

