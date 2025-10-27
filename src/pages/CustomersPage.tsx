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
import { Plus, Search, Filter, Edit, Trash2, Eye, DollarSign, MessageSquare, UserPlus } from 'lucide-react'

interface Customer {
	id: number
	name: string
	email: string
	phone: string
	accountType: 'basic' | 'premium' | 'vip' | 'corporate'
	totalBookings: number
	lifetimeValue: number
	status: 'active' | 'suspended' | 'inactive'
	registrationDate: string
	assignedAgent?: string
	lastBooking?: string
	preferredDestinations?: string[]
}

const mockCustomers: Customer[] = [
	{
		id: 1,
		name: 'John Doe',
		email: 'john.doe@example.com',
		phone: '+1234567890',
		accountType: 'vip',
		totalBookings: 25,
		lifetimeValue: 15000,
		status: 'active',
		registrationDate: '2023-01-15',
		assignedAgent: 'Sarah Agent',
		lastBooking: '2024-10-20',
		preferredDestinations: ['Paris', 'Tokyo']
	},
	{
		id: 2,
		name: 'Jane Smith',
		email: 'jane.smith@example.com',
		phone: '+1234567891',
		accountType: 'premium',
		totalBookings: 12,
		lifetimeValue: 6500,
		status: 'active',
		registrationDate: '2023-06-10',
		lastBooking: '2024-10-15'
	},
	{
		id: 3,
		name: 'Bob Johnson',
		email: 'bob.j@example.com',
		phone: '+1234567892',
		accountType: 'basic',
		totalBookings: 3,
		lifetimeValue: 1200,
		status: 'active',
		registrationDate: '2024-08-05'
	},
]

export function CustomersPage() {
	const { toast } = useToast()
	const [customers] = useState<Customer[]>(mockCustomers)
	const [searchTerm, setSearchTerm] = useState('')
	const [accountTypeFilter, setAccountTypeFilter] = useState<string>('all')
	const [statusFilter, setStatusFilter] = useState<string>('all')
	const [addDialogOpen, setAddDialogOpen] = useState(false)
	const [filterDialogOpen, setFilterDialogOpen] = useState(false)

	const [newCustomer, setNewCustomer] = useState({
		name: '',
		email: '',
		phone: '',
		accountType: 'basic',
		status: 'active',
		assignedAgent: ''
	})

	const filteredCustomers = customers.filter(customer => {
		const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			customer.phone.includes(searchTerm)
		const matchesAccountType = accountTypeFilter === 'all' || customer.accountType === accountTypeFilter
		const matchesStatus = statusFilter === 'all' || customer.status === statusFilter

		return matchesSearch && matchesAccountType && matchesStatus
	})

	const handleAddCustomer = (e: React.FormEvent) => {
		e.preventDefault()
		toast({
			title: "Customer Added",
			description: `${newCustomer.name} has been added successfully.`,
		})
		setAddDialogOpen(false)
		setNewCustomer({ name: '', email: '', phone: '', accountType: 'basic', status: 'active', assignedAgent: '' })
	}

	const handleApplyFilters = () => {
		setFilterDialogOpen(false)
		toast({
			title: "Filters Applied",
			description: `Showing ${filteredCustomers.length} customer(s)`,
		})
	}

	const handleClearFilters = () => {
		setAccountTypeFilter('all')
		setStatusFilter('all')
		toast({
			title: "Filters Cleared",
			description: "All filters have been reset",
		})
	}

	const getCustomersByType = (type: string) => {
		if (type === 'all') return filteredCustomers
		return filteredCustomers.filter(customer => customer.accountType === type)
	}

	const getAccountTypeBadge = (type: string) => {
		switch (type) {
			case 'vip': return 'bg-purple-100 text-purple-800'
			case 'premium': return 'bg-blue-100 text-blue-800'
			case 'corporate': return 'bg-green-100 text-green-800'
			default: return 'bg-gray-100 text-gray-800'
		}
	}

	const CustomerTable = ({ customers }: { customers: Customer[] }) => (
		<div className="space-y-4 overflow-x-auto">
			{customers.map((customer) => (
				<div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg min-w-[600px]">
					<div className="flex items-center gap-4 flex-1">
						<div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
							<span className="text-sm font-medium text-indigo-600">
								{customer.name.charAt(0)}
							</span>
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<h3 className="font-medium text-gray-900">{customer.name}</h3>
								<Badge className={getAccountTypeBadge(customer.accountType)}>
									{customer.accountType.toUpperCase()}
								</Badge>
								<Badge variant={customer.status === 'active' ? 'default' : customer.status === 'suspended' ? 'destructive' : 'secondary'}>
									{customer.status}
								</Badge>
							</div>
							<p className="text-sm text-gray-500">{customer.email}</p>
							<div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
								<span>{customer.totalBookings} bookings</span>
								<span>${customer.lifetimeValue.toLocaleString()} lifetime value</span>
								{customer.assignedAgent && <span>Agent: {customer.assignedAgent}</span>}
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm" title="View Details">
							<Eye className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm" title="Send Message">
							<MessageSquare className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm" title="Apply Discount">
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

			{customers.length === 0 && (
				<div className="text-center py-8">
					<p className="text-gray-500">No customers found</p>
				</div>
			)}
		</div>
	)

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Customers</h1>
					<p className="text-gray-600 mt-2">
						Manage customer accounts and bookings
					</p>
				</div>

				<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
					<DialogTrigger asChild>
						<Button className="w-full sm:w-auto">
							<Plus className="h-4 w-4 mr-2" />
							Add Customer
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>Add New Customer</DialogTitle>
							<DialogDescription>
								Create a new customer account
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleAddCustomer}>
							<div className="space-y-4 py-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="name">Name</Label>
										<Input
											id="name"
											value={newCustomer.name}
											onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
											placeholder="John Doe"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											value={newCustomer.email}
											onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
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
											value={newCustomer.phone}
											onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
											placeholder="+1234567890"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="accountType">Account Type</Label>
										<Select value={newCustomer.accountType} onValueChange={(value) => setNewCustomer({ ...newCustomer, accountType: value })}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="basic">Basic</SelectItem>
												<SelectItem value="premium">Premium</SelectItem>
												<SelectItem value="vip">VIP</SelectItem>
												<SelectItem value="corporate">Corporate</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="status">Status</Label>
										<Select value={newCustomer.status} onValueChange={(value) => setNewCustomer({ ...newCustomer, status: value })}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="active">Active</SelectItem>
												<SelectItem value="suspended">Suspended</SelectItem>
												<SelectItem value="inactive">Inactive</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label htmlFor="assignedAgent">Assigned Agent (Optional)</Label>
										<Input
											id="assignedAgent"
											value={newCustomer.assignedAgent}
											onChange={(e) => setNewCustomer({ ...newCustomer, assignedAgent: e.target.value })}
											placeholder="Agent name"
										/>
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
									Cancel
								</Button>
								<Button type="submit">Add Customer</Button>
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
									placeholder="Search customers..."
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
									{(accountTypeFilter !== 'all' || statusFilter !== 'all') && (
										<Badge variant="default" className="ml-2">Active</Badge>
									)}
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Filter Customers</DialogTitle>
									<DialogDescription>
										Apply filters to narrow down the customer list
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4 py-4">
									<div className="space-y-2">
										<Label htmlFor="accountType-filter">Account Type</Label>
										<Select value={accountTypeFilter} onValueChange={setAccountTypeFilter}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Types</SelectItem>
												<SelectItem value="basic">Basic</SelectItem>
												<SelectItem value="premium">Premium</SelectItem>
												<SelectItem value="vip">VIP</SelectItem>
												<SelectItem value="corporate">Corporate</SelectItem>
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
												<SelectItem value="suspended">Suspended</SelectItem>
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

			{/* Customers Tabs */}
			<Tabs defaultValue="all" className="space-y-4">
				<TabsList>
					<TabsTrigger value="all">All Customers ({filteredCustomers.length})</TabsTrigger>
					<TabsTrigger value="vip">VIP ({getCustomersByType('vip').length})</TabsTrigger>
					<TabsTrigger value="premium">Premium ({getCustomersByType('premium').length})</TabsTrigger>
					<TabsTrigger value="basic">Basic ({getCustomersByType('basic').length})</TabsTrigger>
					<TabsTrigger value="corporate">Corporate ({getCustomersByType('corporate').length})</TabsTrigger>
				</TabsList>

				<TabsContent value="all">
					<Card>
						<CardHeader>
							<CardTitle>All Customers</CardTitle>
						</CardHeader>
						<CardContent>
							<CustomerTable customers={filteredCustomers} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="vip">
					<Card>
						<CardHeader>
							<CardTitle>VIP Customers</CardTitle>
						</CardHeader>
						<CardContent>
							<CustomerTable customers={getCustomersByType('vip')} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="premium">
					<Card>
						<CardHeader>
							<CardTitle>Premium Customers</CardTitle>
						</CardHeader>
						<CardContent>
							<CustomerTable customers={getCustomersByType('premium')} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="basic">
					<Card>
						<CardHeader>
							<CardTitle>Basic Customers</CardTitle>
						</CardHeader>
						<CardContent>
							<CustomerTable customers={getCustomersByType('basic')} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="corporate">
					<Card>
						<CardHeader>
							<CardTitle>Corporate Customers</CardTitle>
						</CardHeader>
						<CardContent>
							<CustomerTable customers={getCustomersByType('corporate')} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}

