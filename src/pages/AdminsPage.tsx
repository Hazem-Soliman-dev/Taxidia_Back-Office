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
import { Plus, Search, Filter, Edit, Trash2, Shield, Key, Activity, Clock } from 'lucide-react'

interface Admin {
	id: number
	name: string
	email: string
	phone: string
	adminLevel: 'super' | 'regular'
	permissions: string[]
	status: 'active' | 'inactive'
	lastLogin: string
	createdDate: string
	twoFactorEnabled: boolean
}

const mockAdmins: Admin[] = [
	{
		id: 1,
		name: 'Super Admin',
		email: 'super@taxidia.com',
		phone: '+1234567890',
		adminLevel: 'super',
		permissions: ['all_users', 'staff_management', 'system_settings', 'analytics', 'billing'],
		status: 'active',
		lastLogin: '2 minutes ago',
		createdDate: '2023-01-01',
		twoFactorEnabled: true
	},
	{
		id: 2,
		name: 'John Admin',
		email: 'john.admin@taxidia.com',
		phone: '+1234567891',
		adminLevel: 'regular',
		permissions: ['all_users', 'analytics'],
		status: 'active',
		lastLogin: '1 hour ago',
		createdDate: '2023-06-15',
		twoFactorEnabled: false
	},
]

export function AdminsPage() {
	const { toast } = useToast()
	const [admins] = useState<Admin[]>(mockAdmins)
	const [searchTerm, setSearchTerm] = useState('')
	const [adminLevelFilter, setAdminLevelFilter] = useState<string>('all')
	const [statusFilter, setStatusFilter] = useState<string>('all')
	const [addDialogOpen, setAddDialogOpen] = useState(false)
	const [filterDialogOpen, setFilterDialogOpen] = useState(false)

	const [newAdmin, setNewAdmin] = useState({
		name: '',
		email: '',
		phone: '',
		adminLevel: 'regular',
		permissions: [] as string[],
		status: 'active',
		twoFactorEnabled: false
	})

	const filteredAdmins = admins.filter(admin => {
		const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			admin.email.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesLevel = adminLevelFilter === 'all' || admin.adminLevel === adminLevelFilter
		const matchesStatus = statusFilter === 'all' || admin.status === statusFilter

		return matchesSearch && matchesLevel && matchesStatus
	})

	const handleAddAdmin = (e: React.FormEvent) => {
		e.preventDefault()
		toast({
			title: "Admin Added",
			description: `${newAdmin.name} has been added successfully.`,
		})
		setAddDialogOpen(false)
		setNewAdmin({ name: '', email: '', phone: '', adminLevel: 'regular', permissions: [], status: 'active', twoFactorEnabled: false })
	}

	const handleApplyFilters = () => {
		setFilterDialogOpen(false)
		toast({
			title: "Filters Applied",
			description: `Showing ${filteredAdmins.length} admin(s)`,
		})
	}

	const handleClearFilters = () => {
		setAdminLevelFilter('all')
		setStatusFilter('all')
		toast({
			title: "Filters Cleared",
			description: "All filters have been reset",
		})
	}

	const togglePermission = (permission: string) => {
		setNewAdmin(prev => ({
			...prev,
			permissions: prev.permissions.includes(permission)
				? prev.permissions.filter(p => p !== permission)
				: [...prev.permissions, permission]
		}))
	}

	const getAdminsByLevel = (level: string) => {
		if (level === 'all') return filteredAdmins
		return filteredAdmins.filter(admin => admin.adminLevel === level)
	}

	const AdminTable = ({ admins }: { admins: Admin[] }) => (
		<div className="space-y-4 overflow-x-auto">
			{admins.map((admin) => (
				<div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg min-w-[600px]">
					<div className="flex items-center gap-4 flex-1">
						<div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
							<Shield className="h-5 w-5 text-red-600" />
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<h3 className="font-medium text-gray-900">{admin.name}</h3>
								<Badge className={admin.adminLevel === 'super' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}>
									{admin.adminLevel === 'super' ? 'SUPER ADMIN' : 'ADMIN'}
								</Badge>
								<Badge variant={admin.status === 'active' ? 'default' : 'secondary'}>
									{admin.status}
								</Badge>
								{admin.twoFactorEnabled && (
									<Badge variant="outline" className="bg-green-50 text-green-700">
										2FA
									</Badge>
								)}
							</div>
							<p className="text-sm text-gray-500">{admin.email}</p>
							<div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
								<span className="flex items-center gap-1">
									<Clock className="h-3 w-3" />
									Last login: {admin.lastLogin}
								</span>
								<span>{admin.permissions.length} permissions</span>
								<span>Created: {admin.createdDate}</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm" title="View Activity Log">
							<Activity className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm" title="Reset Password">
							<Key className="h-4 w-4" />
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

			{admins.length === 0 && (
				<div className="text-center py-8">
					<p className="text-gray-500">No admins found</p>
				</div>
			)}
		</div>
	)

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Administrators</h1>
					<p className="text-gray-600 mt-2">
						Manage administrator accounts and permissions
					</p>
				</div>

				<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
					<DialogTrigger asChild>
						<Button className="w-full sm:w-auto">
							<Plus className="h-4 w-4 mr-2" />
							Add Admin
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Add New Administrator</DialogTitle>
							<DialogDescription>
								Create a new admin account with specific permissions
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleAddAdmin}>
							<div className="space-y-4 py-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="name">Name</Label>
										<Input
											id="name"
											value={newAdmin.name}
											onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
											placeholder="John Admin"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											value={newAdmin.email}
											onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
											placeholder="admin@example.com"
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
											value={newAdmin.phone}
											onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
											placeholder="+1234567890"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="adminLevel">Admin Level</Label>
										<Select value={newAdmin.adminLevel} onValueChange={(value) => setNewAdmin({ ...newAdmin, adminLevel: value })}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="regular">Regular Admin</SelectItem>
												<SelectItem value="super">Super Admin</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="status">Status</Label>
									<Select value={newAdmin.status} onValueChange={(value) => setNewAdmin({ ...newAdmin, status: value })}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="active">Active</SelectItem>
											<SelectItem value="inactive">Inactive</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label>Permissions</Label>
									<div className="grid grid-cols-2 gap-2">
										{['all_users', 'staff_management', 'system_settings', 'analytics', 'billing'].map((permission) => (
											<div key={permission} className="flex items-center space-x-2">
												<input
													type="checkbox"
													id={permission}
													checked={newAdmin.permissions.includes(permission)}
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

								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="twoFactor"
										checked={newAdmin.twoFactorEnabled}
										onChange={(e) => setNewAdmin({ ...newAdmin, twoFactorEnabled: e.target.checked })}
										className="rounded border-gray-300"
									/>
									<label htmlFor="twoFactor" className="text-sm">
										Require Two-Factor Authentication
									</label>
								</div>
							</div>
							<DialogFooter>
								<Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
									Cancel
								</Button>
								<Button type="submit">Add Administrator</Button>
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
									placeholder="Search admins..."
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
									{(adminLevelFilter !== 'all' || statusFilter !== 'all') && (
										<Badge variant="default" className="ml-2">Active</Badge>
									)}
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Filter Administrators</DialogTitle>
									<DialogDescription>
										Apply filters to narrow down the admin list
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4 py-4">
									<div className="space-y-2">
										<Label htmlFor="level-filter">Admin Level</Label>
										<Select value={adminLevelFilter} onValueChange={setAdminLevelFilter}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Levels</SelectItem>
												<SelectItem value="super">Super Admin</SelectItem>
												<SelectItem value="regular">Regular Admin</SelectItem>
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

			{/* Admins Tabs */}
			<Tabs defaultValue="all" className="space-y-4">
				<TabsList>
					<TabsTrigger value="all">All Admins ({filteredAdmins.length})</TabsTrigger>
					<TabsTrigger value="super">Super Admins ({getAdminsByLevel('super').length})</TabsTrigger>
					<TabsTrigger value="regular">Regular Admins ({getAdminsByLevel('regular').length})</TabsTrigger>
					<TabsTrigger value="inactive">Inactive ({filteredAdmins.filter(a => a.status === 'inactive').length})</TabsTrigger>
				</TabsList>

				<TabsContent value="all">
					<Card>
						<CardHeader>
							<CardTitle>All Administrators</CardTitle>
						</CardHeader>
						<CardContent>
							<AdminTable admins={filteredAdmins} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="super">
					<Card>
						<CardHeader>
							<CardTitle>Super Administrators</CardTitle>
						</CardHeader>
						<CardContent>
							<AdminTable admins={getAdminsByLevel('super')} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="regular">
					<Card>
						<CardHeader>
							<CardTitle>Regular Administrators</CardTitle>
						</CardHeader>
						<CardContent>
							<AdminTable admins={getAdminsByLevel('regular')} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="inactive">
					<Card>
						<CardHeader>
							<CardTitle>Inactive Administrators</CardTitle>
						</CardHeader>
						<CardContent>
							<AdminTable admins={filteredAdmins.filter(a => a.status === 'inactive')} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}

