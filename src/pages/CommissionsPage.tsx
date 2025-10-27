import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useToast } from '../hooks/use-toast'
import { Plus, Edit, Calculator, TrendingUp } from 'lucide-react'

interface CommissionTier {
	name: string
	minBookings: number
	maxBookings: number | null
	rate: number
	color: string
}

interface Package {
	id: number
	name: string
	discount: number
	perks: string[]
	commissionOverride?: number
	eligibility: string
	customersCount: number
}

const commissionTiers: CommissionTier[] = [
	{ name: 'Bronze', minBookings: 0, maxBookings: 10, rate: 5, color: 'bg-orange-100 text-orange-800' },
	{ name: 'Silver', minBookings: 11, maxBookings: 25, rate: 7, color: 'bg-gray-100 text-gray-800' },
	{ name: 'Gold', minBookings: 26, maxBookings: 50, rate: 10, color: 'bg-yellow-100 text-yellow-800' },
	{ name: 'Platinum', minBookings: 51, maxBookings: null, rate: 12, color: 'bg-purple-100 text-purple-800' },
]

const mockPackages: Package[] = [
	{
		id: 1,
		name: 'Basic',
		discount: 0,
		perks: ['Standard support', 'Email notifications'],
		eligibility: 'All customers',
		customersCount: 1234
	},
	{
		id: 2,
		name: 'Premium',
		discount: 5,
		perks: ['Priority support', 'SMS notifications', 'Early access to deals'],
		commissionOverride: 8,
		eligibility: '10+ bookings',
		customersCount: 456
	},
	{
		id: 3,
		name: 'VIP',
		discount: 10,
		perks: ['24/7 dedicated support', 'All notifications', 'Exclusive deals', 'Free cancellation'],
		commissionOverride: 6,
		eligibility: '25+ bookings or $10k+ spent',
		customersCount: 89
	},
]

export function CommissionsPage() {
	const { toast } = useToast()
	const [globalRate, setGlobalRate] = useState(5)
	const [platformFeeFixed, setPlatformFeeFixed] = useState(2)
	const [platformFeePercent, setPlatformFeePercent] = useState(1)
	const [paymentSchedule, setPaymentSchedule] = useState('monthly')

	const [packages] = useState<Package[]>(mockPackages)
	const [addPackageDialogOpen, setAddPackageDialogOpen] = useState(false)
	const [calcBookings, setCalcBookings] = useState(15)
	const [calcRevenue, setCalcRevenue] = useState(5000)

	const [newPackage, setNewPackage] = useState({
		name: '',
		discount: 0,
		perks: '',
		commissionOverride: '',
		eligibility: ''
	})

	const calculateCommission = (bookings: number, revenue: number) => {
		const tier = commissionTiers.find(t =>
			bookings >= t.minBookings && (t.maxBookings === null || bookings <= t.maxBookings)
		)
		if (!tier) return 0
		return (revenue * tier.rate) / 100
	}

	const handleSaveGlobal = () => {
		toast({
			title: "Global Rules Saved",
			description: "Commission settings have been updated",
		})
	}

	const handleAddPackage = (e: React.FormEvent) => {
		e.preventDefault()
		toast({
			title: "Package Created",
			description: `${newPackage.name} package has been created`,
		})
		setAddPackageDialogOpen(false)
		setNewPackage({ name: '', discount: 0, perks: '', commissionOverride: '', eligibility: '' })
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Commissions</h1>
					<p className="text-gray-600 mt-2">
						Manage commission rules, tiers, and customer packages
					</p>
				</div>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="global" className="space-y-4">
				<TabsList>
					<TabsTrigger value="global">Global Rules</TabsTrigger>
					<TabsTrigger value="agents">Agent Commissions</TabsTrigger>
					<TabsTrigger value="packages">Customer Packages</TabsTrigger>
				</TabsList>

				{/* Global Rules Tab */}
				<TabsContent value="global">
					<Card>
						<CardHeader>
							<CardTitle>Global Commission Rules</CardTitle>
							<CardDescription>
								Default commission rates and platform fees for all bookings
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label htmlFor="global-rate">Default Commission Rate (%)</Label>
									<Input
										id="global-rate"
										type="number"
										min="0"
										max="100"
										step="0.1"
										value={globalRate}
										onChange={(e) => setGlobalRate(parseFloat(e.target.value))}
									/>
									<p className="text-xs text-gray-500">Applied to all bookings unless overridden</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor="payment-schedule">Payment Schedule</Label>
									<Select value={paymentSchedule} onValueChange={setPaymentSchedule}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="weekly">Weekly</SelectItem>
											<SelectItem value="monthly">Monthly</SelectItem>
											<SelectItem value="quarterly">Quarterly</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-xs text-gray-500">How often commissions are paid out</p>
								</div>
							</div>

							<div className="space-y-4">
								<h3 className="font-semibold">Platform Fee Structure</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="fee-fixed">Fixed Fee ($)</Label>
										<Input
											id="fee-fixed"
											type="number"
											min="0"
											step="0.01"
											value={platformFeeFixed}
											onChange={(e) => setPlatformFeeFixed(parseFloat(e.target.value))}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="fee-percent">Percentage Fee (%)</Label>
										<Input
											id="fee-percent"
											type="number"
											min="0"
											max="100"
											step="0.1"
											value={platformFeePercent}
											onChange={(e) => setPlatformFeePercent(parseFloat(e.target.value))}
										/>
									</div>
								</div>
								<p className="text-sm text-gray-600">
									Total platform fee: ${platformFeeFixed} + {platformFeePercent}% of booking value
								</p>
							</div>

							<div className="space-y-2">
								<h3 className="font-semibold">Currency Conversion Rules</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label>Base Currency</Label>
										<Select defaultValue="usd">
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="usd">USD - US Dollar</SelectItem>
												<SelectItem value="eur">EUR - Euro</SelectItem>
												<SelectItem value="gbp">GBP - British Pound</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label>Exchange Rate Source</Label>
										<Select defaultValue="live">
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="live">Live Rates</SelectItem>
												<SelectItem value="daily">Daily Average</SelectItem>
												<SelectItem value="fixed">Fixed Rates</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>

							<div className="flex justify-end pt-4 border-t">
								<Button onClick={handleSaveGlobal}>
									Save Global Settings
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Agent Commissions Tab */}
				<TabsContent value="agents">
					<div className="space-y-6">
						{/* Tiered Structure */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>Commission Tiers</CardTitle>
										<CardDescription>
											Automatic commission rates based on monthly bookings
										</CardDescription>
									</div>
									<Button variant="outline" size="sm">
										<Edit className="h-4 w-4 mr-2" />
										Edit Tiers
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
									{commissionTiers.map((tier) => (
										<Card key={tier.name} className="border-2">
											<CardHeader className="pb-3">
												<Badge className={tier.color}>{tier.name}</Badge>
											</CardHeader>
											<CardContent className="space-y-2">
												<div>
													<div className="text-2xl font-bold text-primary">{tier.rate}%</div>
													<div className="text-xs text-gray-500">Commission Rate</div>
												</div>
												<div className="text-sm text-gray-600">
													{tier.minBookings} - {tier.maxBookings || '∞'} bookings/month
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Commission Calculator */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calculator className="h-5 w-5" />
									Commission Calculator
								</CardTitle>
								<CardDescription>
									Calculate commission based on bookings and revenue
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="space-y-2">
										<Label htmlFor="calc-bookings">Number of Bookings</Label>
										<Input
											id="calc-bookings"
											type="number"
											min="0"
											value={calcBookings}
											onChange={(e) => setCalcBookings(parseInt(e.target.value) || 0)}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="calc-revenue">Total Revenue ($)</Label>
										<Input
											id="calc-revenue"
											type="number"
											min="0"
											step="0.01"
											value={calcRevenue}
											onChange={(e) => setCalcRevenue(parseFloat(e.target.value) || 0)}
										/>
									</div>
									<div className="space-y-2">
										<Label>Commission Amount</Label>
										<div className="h-10 px-3 py-2 bg-primary/10 border border-primary/20 rounded-md flex items-center">
											<span className="text-lg font-bold text-primary">
												${calculateCommission(calcBookings, calcRevenue).toFixed(2)}
											</span>
										</div>
									</div>
								</div>
								<div className="text-sm text-gray-600">
									{calcBookings} bookings qualifies for{' '}
									<span className="font-semibold">
										{commissionTiers.find(t =>
											calcBookings >= t.minBookings && (t.maxBookings === null || calcBookings <= t.maxBookings)
										)?.name}
									</span>{' '}
									tier
								</div>
							</CardContent>
						</Card>

						{/* Performance Tracking */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<TrendingUp className="h-5 w-5" />
									Agent Performance
								</CardTitle>
								<CardDescription>
									Top performing agents this month
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{[
										{ name: 'Sarah Agent', bookings: 45, revenue: 15000, tier: 'Gold' },
										{ name: 'John Sales', bookings: 32, revenue: 10500, tier: 'Gold' },
										{ name: 'Mike Rep', bookings: 18, revenue: 6200, tier: 'Silver' },
									].map((agent, idx) => (
										<div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
													<span className="text-sm font-medium text-indigo-600">
														{agent.name.charAt(0)}
													</span>
												</div>
												<div>
													<div className="font-medium">{agent.name}</div>
													<div className="text-sm text-gray-500">
														{agent.bookings} bookings • ${agent.revenue.toLocaleString()} revenue
													</div>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Badge className={
													commissionTiers.find(t => t.name === agent.tier)?.color || ''
												}>
													{agent.tier}
												</Badge>
												<div className="text-right">
													<div className="font-semibold text-primary">
														${calculateCommission(agent.bookings, agent.revenue).toFixed(2)}
													</div>
													<div className="text-xs text-gray-500">Commission</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Customer Packages Tab */}
				<TabsContent value="packages">
					<div className="space-y-6">
						<div className="flex justify-end">
							<Dialog open={addPackageDialogOpen} onOpenChange={setAddPackageDialogOpen}>
								<DialogTrigger asChild>
									<Button>
										<Plus className="h-4 w-4 mr-2" />
										Create Package
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Create Customer Package</DialogTitle>
										<DialogDescription>
											Define a new customer package with benefits
										</DialogDescription>
									</DialogHeader>
									<form onSubmit={handleAddPackage}>
										<div className="space-y-4 py-4">
											<div className="space-y-2">
												<Label htmlFor="pkg-name">Package Name</Label>
												<Input
													id="pkg-name"
													value={newPackage.name}
													onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
													placeholder="Premium"
													required
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="pkg-discount">Discount (%)</Label>
												<Input
													id="pkg-discount"
													type="number"
													min="0"
													max="100"
													value={newPackage.discount}
													onChange={(e) => setNewPackage({ ...newPackage, discount: parseInt(e.target.value) })}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="pkg-perks">Perks (comma separated)</Label>
												<Input
													id="pkg-perks"
													value={newPackage.perks}
													onChange={(e) => setNewPackage({ ...newPackage, perks: e.target.value })}
													placeholder="Priority support, SMS notifications"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="pkg-commission">Commission Override (%)</Label>
												<Input
													id="pkg-commission"
													type="number"
													min="0"
													max="100"
													value={newPackage.commissionOverride}
													onChange={(e) => setNewPackage({ ...newPackage, commissionOverride: e.target.value })}
													placeholder="Leave empty for default"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="pkg-eligibility">Eligibility Criteria</Label>
												<Input
													id="pkg-eligibility"
													value={newPackage.eligibility}
													onChange={(e) => setNewPackage({ ...newPackage, eligibility: e.target.value })}
													placeholder="10+ bookings"
												/>
											</div>
										</div>
										<DialogFooter>
											<Button type="button" variant="outline" onClick={() => setAddPackageDialogOpen(false)}>
												Cancel
											</Button>
											<Button type="submit">Create Package</Button>
										</DialogFooter>
									</form>
								</DialogContent>
							</Dialog>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{packages.map((pkg) => (
								<Card key={pkg.id} className="relative">
									<CardHeader>
										<div className="flex items-start justify-between">
											<div>
												<CardTitle>{pkg.name}</CardTitle>
												<CardDescription>{pkg.customersCount} customers</CardDescription>
											</div>
											{pkg.discount > 0 && (
												<Badge variant="default" className="bg-green-100 text-green-800">
													{pkg.discount}% OFF
												</Badge>
											)}
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										<div>
											<h4 className="text-sm font-semibold mb-2">Perks</h4>
											<ul className="space-y-1">
												{pkg.perks.map((perk, idx) => (
													<li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
														<span className="text-primary mt-0.5">✓</span>
														<span>{perk}</span>
													</li>
												))}
											</ul>
										</div>

										{pkg.commissionOverride && (
											<div className="p-2 bg-primary/10 rounded">
												<div className="text-xs text-gray-600">Commission Override</div>
												<div className="font-semibold text-primary">{pkg.commissionOverride}%</div>
											</div>
										)}

										<div className="text-xs text-gray-500">
											<span className="font-semibold">Eligibility:</span> {pkg.eligibility}
										</div>

										<div className="flex gap-2 pt-2 border-t">
											<Button variant="outline" size="sm" className="flex-1">
												<Edit className="h-4 w-4 mr-1" />
												Edit
											</Button>
											<Button variant="outline" size="sm">
												Assign
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
