import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useToast } from '../hooks/use-toast'
import { Download, Upload, Save, Key, Shield, Bell } from 'lucide-react'

export function SettingsPage() {
	const { toast } = useToast()

	// General Settings
	const [companyName, setCompanyName] = useState('Taxidia')
	const [companyEmail, setCompanyEmail] = useState('contact@taxidia.com')
	const [companyPhone, setCompanyPhone] = useState('+1 234 567 8900')
	const [currency, setCurrency] = useState('usd')
	const [timezone, setTimezone] = useState('utc')
	const [language, setLanguage] = useState('en')

	// Load settings from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem('taxidia_general_settings')
		if (saved) {
			try {
				const settings = JSON.parse(saved)
				setCompanyName(settings.companyName || 'Taxidia')
				setCompanyEmail(settings.companyEmail || 'contact@taxidia.com')
				setCompanyPhone(settings.companyPhone || '+1 234 567 8900')
				setCurrency(settings.currency || 'usd')
				setTimezone(settings.timezone || 'utc')
				setLanguage(settings.language || 'en')
			} catch (e) {
				console.error('Failed to load settings:', e)
			}
		}
	}, [])

	// Account Settings
	const [userName, setUserName] = useState('Admin User')
	const [userEmail, setUserEmail] = useState('admin@taxidia.com')
	const [userPhone, setUserPhone] = useState('+1 234 567 8901')
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

	// Notification Settings
	const [emailNotifications, setEmailNotifications] = useState({
		bookings: true,
		cancellations: true,
		support: true,
		updates: false
	})
	const [pushEnabled, setPushEnabled] = useState(true)
	const [notificationFrequency, setNotificationFrequency] = useState('realtime')

	// API Keys
	const [apiKeys] = useState([
		{ id: 1, name: 'Production API', key: 'sk_live_***************', created: '2024-01-15' },
		{ id: 2, name: 'Development API', key: 'sk_test_***************', created: '2024-02-20' },
	])

	// Active Sessions
	const [sessions] = useState([
		{ id: 1, device: 'Chrome on Windows', location: 'New York, USA', lastActive: '2 minutes ago', current: true },
		{ id: 2, device: 'Safari on MacOS', location: 'San Francisco, USA', lastActive: '2 hours ago', current: false },
	])

	const handleSaveGeneral = () => {
		// Save to localStorage
		const settings = {
			companyName,
			companyEmail,
			companyPhone,
			currency,
			timezone,
			language
		}
		localStorage.setItem('taxidia_general_settings', JSON.stringify(settings))

		toast({
			title: "Settings Saved",
			description: "General settings have been updated successfully",
		})
	}

	const handleSaveAccount = () => {
		toast({
			title: "Account Updated",
			description: "Your account information has been saved",
		})
	}

	const handleChangePassword = () => {
		if (newPassword !== confirmPassword) {
			toast({
				title: "Error",
				description: "Passwords do not match",
				variant: "destructive",
			})
			return
		}
		toast({
			title: "Password Changed",
			description: "Your password has been updated successfully",
		})
		setCurrentPassword('')
		setNewPassword('')
		setConfirmPassword('')
	}

	const handleSaveNotifications = () => {
		toast({
			title: "Notifications Updated",
			description: "Your notification preferences have been saved",
		})
	}

	const handleGenerateApiKey = () => {
		toast({
			title: "API Key Generated",
			description: "A new API key has been created",
		})
	}

	const handleRevokeApiKey = (keyName: string) => {
		toast({
			title: "API Key Revoked",
			description: `${keyName} has been revoked`,
			variant: "destructive",
		})
	}

	const handleLogoutSession = (device: string) => {
		toast({
			title: "Session Terminated",
			description: `Logged out from ${device}`,
		})
	}

	const handleExportBackup = () => {
		const backupData = {
			version: '1.0',
			timestamp: new Date().toISOString(),
			settings: {
				general: {
					companyName,
					companyEmail,
					companyPhone,
					currency,
					timezone,
					language
				},
				account: {
					userName,
					userEmail,
					userPhone,
					twoFactorEnabled
				},
				notifications: {
					emailNotifications,
					pushEnabled,
					notificationFrequency
				}
			}
		}

		const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
		const url = window.URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `taxidia-backup-${new Date().toISOString().split('T')[0]}.json`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		window.URL.revokeObjectURL(url)

		toast({
			title: "Backup Exported",
			description: "Your settings have been exported successfully",
		})
	}

	const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = (e) => {
			try {
				const backupData = JSON.parse(e.target?.result as string)

				// Validate backup structure
				if (!backupData.settings) {
					throw new Error('Invalid backup file')
				}

				// Restore general settings
				if (backupData.settings.general) {
					const { general } = backupData.settings
					setCompanyName(general.companyName || 'Taxidia')
					setCompanyEmail(general.companyEmail || '')
					setCompanyPhone(general.companyPhone || '')
					setCurrency(general.currency || 'usd')
					setTimezone(general.timezone || 'utc')
					setLanguage(general.language || 'en')
					localStorage.setItem('taxidia_general_settings', JSON.stringify(general))
				}

				// Restore account settings
				if (backupData.settings.account) {
					const { account } = backupData.settings
					setUserName(account.userName || '')
					setUserEmail(account.userEmail || '')
					setUserPhone(account.userPhone || '')
					setTwoFactorEnabled(account.twoFactorEnabled || false)
				}

				// Restore notification settings
				if (backupData.settings.notifications) {
					const { notifications } = backupData.settings
					setEmailNotifications(notifications.emailNotifications || {})
					setPushEnabled(notifications.pushEnabled || false)
					setNotificationFrequency(notifications.notificationFrequency || 'realtime')
				}

				toast({
					title: "Backup Imported",
					description: "Your settings have been restored successfully",
				})
			} catch (error) {
				toast({
					title: "Import Failed",
					description: "Failed to import backup file. Please check the file format.",
					variant: "destructive",
				})
			}
		}
		reader.readAsText(file)

		// Reset file input
		event.target.value = ''
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-foreground">Settings</h1>
				<p className="text-gray-600 mt-2">
					Manage your application settings and preferences
				</p>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="general" className="space-y-4">
				<div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
					<TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-6">
						<TabsTrigger value="general" className="whitespace-nowrap">General</TabsTrigger>
						<TabsTrigger value="backup" className="whitespace-nowrap">Backup</TabsTrigger>
						<TabsTrigger value="account" className="whitespace-nowrap">Account</TabsTrigger>
						<TabsTrigger value="notifications" className="whitespace-nowrap">Notifications</TabsTrigger>
						<TabsTrigger value="security" className="whitespace-nowrap">Security</TabsTrigger>
					</TabsList>
				</div>

				{/* General Tab */}
				<TabsContent value="general" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Company Information</CardTitle>
							<CardDescription>Update your company details and branding</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="company-name">Company Name</Label>
									<Input
										id="company-name"
										value={companyName}
										onChange={(e) => setCompanyName(e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="company-email">Contact Email</Label>
									<Input
										id="company-email"
										type="email"
										value={companyEmail}
										onChange={(e) => setCompanyEmail(e.target.value)}
									/>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="company-phone">Phone Number</Label>
									<Input
										id="company-phone"
										type="tel"
										value={companyPhone}
										onChange={(e) => setCompanyPhone(e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="company-logo">Company Logo</Label>
									<div className="flex gap-2">
										<Input id="company-logo" type="file" accept="image/*" />
										<Button variant="outline" size="sm">
											<Upload className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Business Settings</CardTitle>
							<CardDescription>Configure regional and operational preferences</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label htmlFor="currency">Default Currency</Label>
									<Select value={currency} onValueChange={setCurrency}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="usd">USD - US Dollar</SelectItem>
											<SelectItem value="eur">EUR - Euro</SelectItem>
											<SelectItem value="gbp">GBP - British Pound</SelectItem>
											<SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="timezone">Timezone</Label>
									<Select value={timezone} onValueChange={setTimezone}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="utc">UTC</SelectItem>
											<SelectItem value="est">EST - Eastern Time</SelectItem>
											<SelectItem value="pst">PST - Pacific Time</SelectItem>
											<SelectItem value="gmt">GMT - Greenwich Mean Time</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="language">Language</Label>
									<Select value={language} onValueChange={setLanguage}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="en">English</SelectItem>
											<SelectItem value="es">Spanish</SelectItem>
											<SelectItem value="fr">French</SelectItem>
											<SelectItem value="de">German</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="flex justify-end pt-4 border-t">
								<Button onClick={handleSaveGeneral}>
									<Save className="h-4 w-4 mr-2" />
									Save Changes
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Backup Tab */}
				<TabsContent value="backup" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Backup & Restore</CardTitle>
							<CardDescription>Export or import your settings and data</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<div>
									<h3 className="font-medium mb-2">Export Backup</h3>
									<p className="text-sm text-gray-600 mb-4">
										Download a backup file containing all your settings, configurations, and preferences.
									</p>
									<Button onClick={handleExportBackup} variant="outline" className="w-full sm:w-auto">
										<Download className="h-4 w-4 mr-2" />
										Export Backup
									</Button>
								</div>

								<div className="pt-4 border-t">
									<h3 className="font-medium mb-2">Import Backup</h3>
									<p className="text-sm text-gray-600 mb-4">
										Restore your settings from a previously exported backup file. This will overwrite your current settings.
									</p>
									<input
										type="file"
										id="import-backup"
										accept=".json"
										onChange={handleImportBackup}
										className="hidden"
									/>
									<Button
										onClick={() => document.getElementById('import-backup')?.click()}
										variant="outline"
										className="w-full sm:w-auto"
									>
										<Upload className="h-4 w-4 mr-2" />
										Import Backup
									</Button>
								</div>
							</div>

							<div className="pt-4 border-t">
								<h3 className="font-medium mb-2">What's Included</h3>
								<ul className="text-sm text-gray-600 space-y-1">
									<li>• General settings (company info, currency, timezone, language)</li>
									<li>• Account preferences (user info, 2FA status)</li>
									<li>• Notification settings (email, push, frequency)</li>
									<li>• Theme preferences</li>
								</ul>
							</div>

							<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
								<div className="flex gap-2">
									<Shield className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
									<div>
										<h4 className="font-medium text-yellow-900 mb-1">Important Note</h4>
										<p className="text-sm text-yellow-800">
											Backup files are stored locally on your device. Make sure to keep them in a safe place.
											Importing a backup will immediately overwrite your current settings.
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Account Tab */}
				<TabsContent value="account" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>User Profile</CardTitle>
							<CardDescription>Manage your personal information</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center gap-4">
								<div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
									<span className="text-2xl font-medium text-indigo-600">A</span>
								</div>
								<Button variant="outline" size="sm">
									<Upload className="h-4 w-4 mr-2" />
									Upload Avatar
								</Button>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="user-name">Full Name</Label>
									<Input
										id="user-name"
										value={userName}
										onChange={(e) => setUserName(e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="user-email">Email Address</Label>
									<Input
										id="user-email"
										type="email"
										value={userEmail}
										onChange={(e) => setUserEmail(e.target.value)}
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="user-phone">Phone Number</Label>
								<Input
									id="user-phone"
									type="tel"
									value={userPhone}
									onChange={(e) => setUserPhone(e.target.value)}
								/>
							</div>
							<div className="flex justify-end pt-4 border-t">
								<Button onClick={handleSaveAccount}>
									<Save className="h-4 w-4 mr-2" />
									Save Profile
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Security</CardTitle>
							<CardDescription>Manage your password and authentication</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="current-password">Current Password</Label>
								<Input
									id="current-password"
									type="password"
									value={currentPassword}
									onChange={(e) => setCurrentPassword(e.target.value)}
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="new-password">New Password</Label>
									<Input
										id="new-password"
										type="password"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="confirm-password">Confirm Password</Label>
									<Input
										id="confirm-password"
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
									/>
								</div>
							</div>
							<div className="flex items-center justify-between p-4 border rounded-lg">
								<div>
									<h4 className="font-semibold">Two-Factor Authentication</h4>
									<p className="text-sm text-gray-600">Add an extra layer of security</p>
								</div>
								<button
									onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
									className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactorEnabled ? 'bg-primary' : 'bg-gray-300'
										}`}
								>
									<span
										className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
											}`}
									/>
								</button>
							</div>
							<div className="flex justify-end pt-4 border-t">
								<Button onClick={handleChangePassword}>
									<Key className="h-4 w-4 mr-2" />
									Change Password
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Active Sessions</CardTitle>
							<CardDescription>Manage your active login sessions</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{sessions.map((session) => (
								<div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
									<div>
										<div className="flex items-center gap-2">
											<h4 className="font-semibold">{session.device}</h4>
											{session.current && (
												<Badge variant="default" className="bg-green-100 text-green-800">Current</Badge>
											)}
										</div>
										<p className="text-sm text-gray-600">
											{session.location} • {session.lastActive}
										</p>
									</div>
									{!session.current && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleLogoutSession(session.device)}
										>
											Logout
										</Button>
									)}
								</div>
							))}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Notifications Tab */}
				<TabsContent value="notifications" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Email Notifications</CardTitle>
							<CardDescription>Choose which emails you want to receive</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{[
								{ key: 'bookings', label: 'New Bookings', description: 'Get notified when a new booking is made' },
								{ key: 'cancellations', label: 'Cancellations', description: 'Receive alerts for booking cancellations' },
								{ key: 'support', label: 'Support Messages', description: 'Get notified of new support tickets' },
								{ key: 'updates', label: 'System Updates', description: 'Receive news about platform updates' },
							].map((item) => (
								<div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
									<div>
										<h4 className="font-semibold">{item.label}</h4>
										<p className="text-sm text-gray-600">{item.description}</p>
									</div>
									<input
										type="checkbox"
										checked={emailNotifications[item.key as keyof typeof emailNotifications]}
										onChange={(e) => setEmailNotifications({
											...emailNotifications,
											[item.key]: e.target.checked
										})}
										className="w-4 h-4 rounded border-gray-300"
									/>
								</div>
							))}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Notification Preferences</CardTitle>
							<CardDescription>Configure how and when you receive notifications</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between p-3 border rounded-lg">
								<div>
									<h4 className="font-semibold">Push Notifications</h4>
									<p className="text-sm text-gray-600">Receive push notifications in your browser</p>
								</div>
								<button
									onClick={() => setPushEnabled(!pushEnabled)}
									className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pushEnabled ? 'bg-primary' : 'bg-gray-300'
										}`}
								>
									<span
										className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushEnabled ? 'translate-x-6' : 'translate-x-1'
											}`}
									/>
								</button>
							</div>
							<div className="space-y-2">
								<Label htmlFor="frequency">Notification Frequency</Label>
								<Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="realtime">Real-time</SelectItem>
										<SelectItem value="hourly">Hourly Digest</SelectItem>
										<SelectItem value="daily">Daily Digest</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex justify-end pt-4 border-t">
								<Button onClick={handleSaveNotifications}>
									<Bell className="h-4 w-4 mr-2" />
									Save Preferences
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Security Tab */}
				<TabsContent value="security" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Security Settings</CardTitle>
							<CardDescription>Configure advanced security options</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
								<Input
									id="session-timeout"
									type="number"
									defaultValue={30}
									min={5}
									max={120}
								/>
								<p className="text-xs text-gray-500">Automatically log out after inactivity</p>
							</div>
							<div className="space-y-2">
								<Label htmlFor="max-attempts">Maximum Login Attempts</Label>
								<Input
									id="max-attempts"
									type="number"
									defaultValue={5}
									min={3}
									max={10}
								/>
								<p className="text-xs text-gray-500">Lock account after failed attempts</p>
							</div>
							<div className="flex justify-end pt-4 border-t">
								<Button>
									<Shield className="h-4 w-4 mr-2" />
									Save Security Settings
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

			</Tabs>
		</div>
	)
}
