import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useToast } from '../hooks/use-toast'
import { Plus, Settings as SettingsIcon, CheckCircle, XCircle, RefreshCw, Zap } from 'lucide-react'

interface Provider {
	id: number
	name: string
	logo: string
	isActive: boolean
	lastSync: string
	successRate: number
	avgResponseTime: number
	apiEndpoint: string
	apiKey: string
	priority: number
	markup: number
}

const mockProviders: Provider[] = [
	{
		id: 1,
		name: 'Booking.com',
		logo: 'B',
		isActive: true,
		lastSync: '2 minutes ago',
		successRate: 98.5,
		avgResponseTime: 245,
		apiEndpoint: 'https://api.booking.com/v1',
		apiKey: '***************',
		priority: 10,
		markup: 5
	},
	{
		id: 2,
		name: 'Expedia',
		logo: 'E',
		isActive: true,
		lastSync: '5 minutes ago',
		successRate: 96.2,
		avgResponseTime: 312,
		apiEndpoint: 'https://api.expedia.com/v2',
		apiKey: '***************',
		priority: 8,
		markup: 7
	},
	{
		id: 3,
		name: 'Hotels.com',
		logo: 'H',
		isActive: false,
		lastSync: '1 hour ago',
		successRate: 94.8,
		avgResponseTime: 289,
		apiEndpoint: 'https://api.hotels.com/v1',
		apiKey: '***************',
		priority: 6,
		markup: 6
	},
]

export function ProvidersPage() {
	const { toast } = useToast()
	const [providers, setProviders] = useState<Provider[]>(mockProviders)
	const [mergeEnabled, setMergeEnabled] = useState(true)
	const [mergeStrategy, setMergeStrategy] = useState('best_price')
	const [priceTolerance, setPriceTolerance] = useState(5)
	const [timeout, setTimeout] = useState(30)
	const [cacheDuration, setCacheDuration] = useState(15)

	const [addDialogOpen, setAddDialogOpen] = useState(false)
	const [configDialogOpen, setConfigDialogOpen] = useState(false)
	const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)

	const [newProvider, setNewProvider] = useState({
		name: '',
		apiEndpoint: '',
		apiKey: '',
		apiSecret: '',
		priority: 5,
		markup: 5
	})

	const activeProviders = providers.filter(p => p.isActive)

	const toggleProvider = (id: number) => {
		setProviders(prev => prev.map(p =>
			p.id === id ? { ...p, isActive: !p.isActive } : p
		))
		const provider = providers.find(p => p.id === id)
		toast({
			title: provider?.isActive ? "Provider Disabled" : "Provider Enabled",
			description: `${provider?.name} has been ${provider?.isActive ? 'disabled' : 'enabled'}`,
		})
	}

	const handleAddProvider = (e: React.FormEvent) => {
		e.preventDefault()
		toast({
			title: "Provider Added",
			description: `${newProvider.name} has been added successfully.`,
		})
		setAddDialogOpen(false)
		setNewProvider({ name: '', apiEndpoint: '', apiKey: '', apiSecret: '', priority: 5, markup: 5 })
	}

	const handleTestConnection = (provider: Provider) => {
		toast({
			title: "Testing Connection",
			description: `Testing connection to ${provider.name}...`,
		})
		// Simulate test
		window.setTimeout(() => {
			toast({
				title: "Connection Successful",
				description: `${provider.name} is responding correctly`,
			})
		}, 1500)
	}

	const handleBulkAction = (action: 'enable' | 'disable' | 'refresh') => {
		if (action === 'enable') {
			setProviders(prev => prev.map(p => ({ ...p, isActive: true })))
			toast({ title: "All Providers Enabled", description: "All providers have been activated" })
		} else if (action === 'disable') {
			setProviders(prev => prev.map(p => ({ ...p, isActive: false })))
			toast({ title: "All Providers Disabled", description: "All providers have been deactivated" })
		} else {
			toast({ title: "Refreshing Status", description: "Updating provider status..." })
		}
	}

	const openConfigDialog = (provider: Provider) => {
		setSelectedProvider(provider)
		setConfigDialogOpen(true)
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Providers</h1>
					<p className="text-gray-600 mt-2">
						Manage hotel providers and merge settings
					</p>
				</div>

				<div className="flex gap-2 mt-4 sm:mt-0">
					<Button variant="outline" onClick={() => handleBulkAction('refresh')}>
						<RefreshCw className="h-4 w-4 mr-2" />
						Refresh All
					</Button>
					<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
						<DialogTrigger asChild>
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								Add Provider
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add New Provider</DialogTitle>
								<DialogDescription>
									Configure a new hotel provider integration
								</DialogDescription>
							</DialogHeader>
							<form onSubmit={handleAddProvider}>
								<div className="space-y-4 py-4">
									<div className="space-y-2">
										<Label htmlFor="name">Provider Name</Label>
										<Input
											id="name"
											value={newProvider.name}
											onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
											placeholder="Booking.com"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="apiEndpoint">API Endpoint</Label>
										<Input
											id="apiEndpoint"
											type="url"
											value={newProvider.apiEndpoint}
											onChange={(e) => setNewProvider({ ...newProvider, apiEndpoint: e.target.value })}
											placeholder="https://api.provider.com/v1"
											required
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="apiKey">API Key</Label>
											<Input
												id="apiKey"
												type="password"
												value={newProvider.apiKey}
												onChange={(e) => setNewProvider({ ...newProvider, apiKey: e.target.value })}
												placeholder="Enter API key"
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="apiSecret">API Secret</Label>
											<Input
												id="apiSecret"
												type="password"
												value={newProvider.apiSecret}
												onChange={(e) => setNewProvider({ ...newProvider, apiSecret: e.target.value })}
												placeholder="Enter API secret"
											/>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="priority">Priority (1-10)</Label>
											<Input
												id="priority"
												type="number"
												min="1"
												max="10"
												value={newProvider.priority}
												onChange={(e) => setNewProvider({ ...newProvider, priority: parseInt(e.target.value) })}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="markup">Markup (%)</Label>
											<Input
												id="markup"
												type="number"
												min="0"
												max="100"
												step="0.1"
												value={newProvider.markup}
												onChange={(e) => setNewProvider({ ...newProvider, markup: parseFloat(e.target.value) })}
											/>
										</div>
									</div>
								</div>
								<DialogFooter>
									<Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
										Cancel
									</Button>
									<Button type="submit">Add Provider</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Global Settings Card */}
			<Card className="border-2 border-primary/20">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<Zap className="h-5 w-5 text-primary" />
								Global Merge Settings
							</CardTitle>
							<CardDescription className="mt-1">
								Configure how results are merged when multiple providers are active
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-sm text-gray-600">Merge Results</span>
							<button
								onClick={() => setMergeEnabled(!mergeEnabled)}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${mergeEnabled ? 'bg-primary' : 'bg-gray-300'
									}`}
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mergeEnabled ? 'translate-x-6' : 'translate-x-1'
										}`}
								/>
							</button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="space-y-2">
							<Label htmlFor="strategy">Merge Strategy</Label>
							<Select value={mergeStrategy} onValueChange={setMergeStrategy} disabled={!mergeEnabled}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="best_price">Best Price</SelectItem>
									<SelectItem value="best_availability">Best Availability</SelectItem>
									<SelectItem value="balanced">Balanced</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="tolerance">Price Tolerance (%)</Label>
							<Input
								id="tolerance"
								type="number"
								min="0"
								max="100"
								value={priceTolerance}
								onChange={(e) => setPriceTolerance(parseInt(e.target.value))}
								disabled={!mergeEnabled}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="timeout">Timeout (seconds)</Label>
							<Input
								id="timeout"
								type="number"
								min="5"
								max="120"
								value={timeout}
								onChange={(e) => setTimeout(parseInt(e.target.value))}
								disabled={!mergeEnabled}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="cache">Cache Duration (minutes)</Label>
							<Input
								id="cache"
								type="number"
								min="1"
								max="60"
								value={cacheDuration}
								onChange={(e) => setCacheDuration(parseInt(e.target.value))}
								disabled={!mergeEnabled}
							/>
						</div>
					</div>

					<div className="flex items-center justify-between pt-2 border-t">
						<div className="text-sm text-gray-600">
							Active Providers: <span className="font-semibold text-primary">{activeProviders.length}</span> / {providers.length}
						</div>
						<div className="flex gap-2">
							<Button variant="outline" size="sm" onClick={() => handleBulkAction('enable')}>
								Enable All
							</Button>
							<Button variant="outline" size="sm" onClick={() => handleBulkAction('disable')}>
								Disable All
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Provider Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{providers.map((provider) => (
					<Card key={provider.id} className={`relative ${provider.isActive ? 'border-primary/50' : 'border-gray-200'}`}>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold ${provider.isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
										}`}>
										{provider.logo}
									</div>
									<div>
										<CardTitle className="text-lg">{provider.name}</CardTitle>
										<div className="flex items-center gap-2 mt-1">
											{provider.isActive ? (
												<CheckCircle className="h-4 w-4 text-green-500" />
											) : (
												<XCircle className="h-4 w-4 text-gray-400" />
											)}
											<span className="text-xs text-gray-500">
												{provider.isActive ? 'Active' : 'Inactive'}
											</span>
										</div>
									</div>
								</div>

								<button
									onClick={() => toggleProvider(provider.id)}
									className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${provider.isActive ? 'bg-primary' : 'bg-gray-300'
										}`}
								>
									<span
										className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${provider.isActive ? 'translate-x-6' : 'translate-x-1'
											}`}
									/>
								</button>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="grid grid-cols-2 gap-3 text-sm">
								<div>
									<span className="text-gray-500">Success Rate</span>
									<div className="font-semibold text-green-600">{provider.successRate}%</div>
								</div>
								<div>
									<span className="text-gray-500">Avg Response</span>
									<div className="font-semibold">{provider.avgResponseTime}ms</div>
								</div>
								<div className="col-span-2">
									<span className="text-gray-500">Last Sync</span>
									<div className="font-semibold text-gray-700">{provider.lastSync}</div>
								</div>
							</div>

							<div className="flex gap-2 pt-2 border-t">
								<Button
									variant="outline"
									size="sm"
									className="flex-1"
									onClick={() => openConfigDialog(provider)}
								>
									<SettingsIcon className="h-4 w-4 mr-1" />
									Settings
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleTestConnection(provider)}
								>
									<RefreshCw className="h-4 w-4" />
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Provider Configuration Dialog */}
			<Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Configure {selectedProvider?.name}</DialogTitle>
						<DialogDescription>
							Update provider settings and credentials
						</DialogDescription>
					</DialogHeader>
					{selectedProvider && (
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label>API Endpoint</Label>
								<Input value={selectedProvider.apiEndpoint} readOnly />
							</div>
							<div className="space-y-2">
								<Label>API Key</Label>
								<Input type="password" value={selectedProvider.apiKey} readOnly />
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Priority Level (1-10)</Label>
									<Input type="number" min="1" max="10" defaultValue={selectedProvider.priority} />
									<p className="text-xs text-gray-500">Higher priority providers are queried first</p>
								</div>
								<div className="space-y-2">
									<Label>Markup Percentage</Label>
									<Input type="number" min="0" max="100" step="0.1" defaultValue={selectedProvider.markup} />
									<p className="text-xs text-gray-500">Additional markup on prices from this provider</p>
								</div>
							</div>
							<div className="space-y-2">
								<Label>Hotel Filters</Label>
								<div className="grid grid-cols-2 gap-2">
									<div>
										<Label className="text-xs">Min Star Rating</Label>
										<Select defaultValue="0">
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="0">Any</SelectItem>
												<SelectItem value="3">3+ Stars</SelectItem>
												<SelectItem value="4">4+ Stars</SelectItem>
												<SelectItem value="5">5 Stars</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label className="text-xs">Location Filter</Label>
										<Input placeholder="City, Country" />
									</div>
								</div>
							</div>
							<div className="pt-4 border-t">
								<Button
									variant="outline"
									className="w-full"
									onClick={() => handleTestConnection(selectedProvider)}
								>
									<RefreshCw className="h-4 w-4 mr-2" />
									Test Connection
								</Button>
							</div>
						</div>
					)}
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setConfigDialogOpen(false)}>
							Cancel
						</Button>
						<Button type="button" onClick={() => {
							toast({
								title: "Settings Saved",
								description: `${selectedProvider?.name} configuration updated`,
							})
							setConfigDialogOpen(false)
						}}>
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
