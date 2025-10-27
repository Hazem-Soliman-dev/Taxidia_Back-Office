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
import { Plus, Search, Filter, Edit, Trash2, Clock, TrendingUp } from 'lucide-react'

interface StaffMember {
	id: number
	name: string
	email: string
	phone: string
	role: 'support' | 'content_manager' | 'analyst'
	department: string
	permissions: string[]
	status: 'active' | 'on_leave' | 'inactive'
	last_active: string
}

const mockStaff: StaffMember[] = [
	{
		id: 1,
		name: 'Mike Support',
		email: 'mike@taxidia.com',
		phone: '+1234567890',
		role: 'support',
		department: 'Support',
		permissions: ['view_users', 'manage_content'],
		status: 'active',
		last_active: '10 minutes ago'
	},
	{
		id: 2,
		name: 'Emma Content',
		email: 'emma@taxidia.com',
		phone: '+1234567891',
		role: 'content_manager',
		department: 'Content',
		permissions: ['manage_content', 'view_analytics'],
		status: 'active',
		last_active: '1 hour ago'
	},
	{
		id: 3,
		name: 'Alex Analyst',
		email: 'alex@taxidia.com',
		phone: '+1234567892',
		role: 'analyst',
		department: 'Analytics',
		permissions: ['view_analytics', 'view_reports'],
		status: 'active',
		last_active: '30 minutes ago'
	},
]

export function StaffPage() {
	const { toast } = useToast()
	const [staff] = useState<StaffMember[]>(mockStaff)
	const [searchTerm, setSearchTerm] = useState('')
	const [roleFilter, setRoleFilter] = useState<string>('all')
	const [statusFilter, setStatusFilter] = useState<string>('all')
	const [addDialogOpen, setAddDialogOpen] = useState(false)
	const [filterDialogOpen, setFilterDialogOpen] = useState(false)

	const [newStaff, setNewStaff] = useState({
		name: '',
		email: '',
		phone: '',
		role: 'support',
		department: 'Support',
		permissions: [] as string[],
		status: 'active'
	})

	const filteredStaff = staff.filter(member => {
		const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.email.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesRole = roleFilter === 'all' || member.role === roleFilter
		const matchesStatus = statusFilter === 'all' || member.status === statusFilter

		return matchesSearch && matchesRole && matchesStatus
	})

	const handleAddStaff = (e: React.FormEvent) => {
		e.preventDefault()
		toast({
			title: "Staff Member Added",
			description: `${newStaff.name} has been added successfully.`,
		})
		setAddDialogOpen(false)
		setNewStaff({ name: '', email: '', phone: '', role: 'support', department: 'Support', permissions: [], status: 'active' })
	}

	const handleApplyFilters = () => {
		setFilterDialogOpen(false)
		toast({
			title: "Filters Applied",
			description: `Showing ${filteredStaff.length} staff member(s)`,
		})
	}

	const handleClearFilters = () => {
		setRoleFilter('all')
		setStatusFilter('all')
		toast({
			title: "Filters Cleared",
			description: "All filters have been reset",
		})
	}

	const togglePermission = (permission: string) => {
		setNewStaff(prev => ({
			...prev,
			permissions: prev.permissions.includes(permission)
				? prev.permissions.filter(p => p !== permission)
				: [...prev.permissions, permission]
		}))
	}

	const getStaffByRole = (role: string) => {
		if (role === 'all') return filteredStaff
		return filteredStaff.filter(member => member.role === role)
	}

	const getRoleBadgeColor = (role: string) => {
		switch (role) {
			case 'support': return 'bg-green-100 text-green-800'
			case 'content_manager': return 'bg-purple-100 text-purple-800'
			case 'analyst': return 'bg-yellow-100 text-yellow-800'
			default: return 'bg-gray-100 text-gray-800'
		}
	}

	const StaffTable = ({ members }: { members: StaffMember[] }) => (
		<div className="space-y-4 overflow-x-auto">
			{members.map((member) => (
				<div key={member.id} className="flex items-center justify-between p-4 border rounded-lg min-w-[600px]">
					<div className="flex items-center gap-4 flex-1">
						<div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
							<span className="text-sm font-medium text-indigo-600">
								{member.name.charAt(0)}
							</span>
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<h3 className="font-medium text-gray-900">{member.name}</h3>
								<Badge className={getRoleBadgeColor(member.role)}>
									{member.role.replace('_', ' ')}
								</Badge>
								<Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
									{member.status.replace('_', ' ')}
								</Badge>
							</div>
							<p className="text-sm text-gray-500">{member.email}</p>
							<div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
								<span>{member.department}</span>
								<span className="flex items-center gap-1">
									<Clock className="h-3 w-3" />
									{member.last_active}
								</span>
								<span>{member.permissions.length} permissions</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm" title="View Performance">
							<TrendingUp className="h-4 w-4" />
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

			{members.length === 0 && (
				<div className="text-center py-8">
					<p className="text-gray-500">No staff members found</p>
				</div>
			)}
		</div>
	)

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Staff</h1>
					<p className="text-gray-600 mt-2">
						Manage internal staff members (support, content, analytics)
					</p>
				</div>

				<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
					<DialogTrigger asChild>
						<Button className="w-full sm:w-auto">
							<Plus className="h-4 w-4 mr-2" />
							Add Staff Member
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Add New Staff Member</DialogTitle>
							<DialogDescription>
								Create a new staff account
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleAddStaff}>
							<div className="space-y-4 py-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="name">Name</Label>
										<Input
											id="name"
											value={newStaff.name}
											onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
											placeholder="John Doe"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											value={newStaff.email}
											onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
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
											value={newStaff.phone}
											onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
											placeholder="+1234567890"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="department">Department</Label>
										<Select value={newStaff.department} onValueChange={(value) => setNewStaff({ ...newStaff, department: value })}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Support">Support</SelectItem>
												<SelectItem value="Content">Content</SelectItem>
												<SelectItem value="Analytics">Analytics</SelectItem>
												<SelectItem value="Operations">Operations</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="role">Role</Label>
										<Select value={newStaff.role} onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="support">Support Agent</SelectItem>
												<SelectItem value="content_manager">Content Manager</SelectItem>
												<SelectItem value="analyst">Analyst</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label htmlFor="status">Status</Label>
										<Select value={newStaff.status} onValueChange={(value) => setNewStaff({ ...newStaff, status: value })}>
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

								<div className="space-y-2">
									<Label>Permissions</Label>
									<div className="grid grid-cols-2 gap-2">
										{['view_users', 'manage_content', 'view_analytics', 'view_reports'].map((permission) => (
											<div key={permission} className="flex items-center space-x-2">
												<input
													type="checkbox"
													id={permission}
													checked={newStaff.permissions.includes(permission)}
													onChange={() => togglePermission(permission)}
													className="rounded border-gray-300"
												/>
												<label htmlFor={permission} className="text-sm capitalize">
													{permission.replace('_', ' ')}
												</label>
											</div>
										))}
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
									Cancel
								</Button>
								<Button type="submit">Add Staff Member</Button>
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
									placeholder="Search staff..."
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
									{(roleFilter !== 'all' || statusFilter !== 'all') && (
										<Badge variant="default" className="ml-2">Active</Badge>
									)}
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Filter Staff</DialogTitle>
									<DialogDescription>
										Apply filters to narrow down the staff list
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4 py-4">
									<div className="space-y-2">
										<Label htmlFor="role-filter">Role</Label>
										<Select value={roleFilter} onValueChange={setRoleFilter}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Roles</SelectItem>
												<SelectItem value="support">Support Agent</SelectItem>
												<SelectItem value="content_manager">Content Manager</SelectItem>
												<SelectItem value="analyst">Analyst</SelectItem>
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

			{/* Staff Tabs */}
			<Tabs defaultValue="all" className="space-y-4">
				<TabsList>
					<TabsTrigger value="all">All Staff ({filteredStaff.length})</TabsTrigger>
					<TabsTrigger value="support">Support ({getStaffByRole('support').length})</TabsTrigger>
					<TabsTrigger value="content_manager">Content Managers ({getStaffByRole('content_manager').length})</TabsTrigger>
					<TabsTrigger value="analyst">Analysts ({getStaffByRole('analyst').length})</TabsTrigger>
					<TabsTrigger value="inactive">Inactive ({filteredStaff.filter(s => s.status === 'inactive').length})</TabsTrigger>
				</TabsList>

				<TabsContent value="all">
					<Card>
						<CardHeader>
							<CardTitle>All Staff Members</CardTitle>
						</CardHeader>
						<CardContent>
							<StaffTable members={filteredStaff} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="support">
					<Card>
						<CardHeader>
							<CardTitle>Support Team</CardTitle>
						</CardHeader>
						<CardContent>
							<StaffTable members={getStaffByRole('support')} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="content_manager">
					<Card>
						<CardHeader>
							<CardTitle>Content Managers</CardTitle>
						</CardHeader>
						<CardContent>
							<StaffTable members={getStaffByRole('content_manager')} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="analyst">
					<Card>
						<CardHeader>
							<CardTitle>Analysts</CardTitle>
						</CardHeader>
						<CardContent>
							<StaffTable members={getStaffByRole('analyst')} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="inactive">
					<Card>
						<CardHeader>
							<CardTitle>Inactive Staff</CardTitle>
						</CardHeader>
						<CardContent>
							<StaffTable members={filteredStaff.filter(s => s.status === 'inactive')} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
