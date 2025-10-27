import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectAccountSchema, type SelectAccountData } from '../lib/validation/auth'
import { apiClient, setToken } from '../lib/api/client'
import { selectAccount, setLoading, setError } from '../lib/store/slices/authSlice'
import type { RootState } from '../lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Building2 } from 'lucide-react'

interface Account {
	id: number
	name: string
	type: string
	is_active: boolean
}

export function SelectAccountPage() {
	const [accounts, setAccounts] = useState<Account[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { user } = useSelector((state: RootState) => state.auth)

	const {
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<SelectAccountData>({
		resolver: zodResolver(selectAccountSchema),
	})

	const selectedAccountId = watch('account_id')

	useEffect(() => {
		const fetchAccounts = async () => {
			try {
				const response = await apiClient.get('/backoffice/auth/accounts')
				setAccounts(response.accounts)
			} catch (error: unknown) {
				const message = error instanceof Error ? error.message : 'Failed to fetch accounts'
				dispatch(setError(message))
			} finally {
				setIsLoading(false)
			}
		}

		fetchAccounts()
	}, [dispatch])

	const onSubmit = async (data: SelectAccountData) => {
		dispatch(setLoading(true))
		dispatch(setError(null))

		try {
			const response = await apiClient.post('/backoffice/auth/select-account', data)

			// Store the account-context JWT token
			setToken(response.token)

			// Update Redux state
			dispatch(selectAccount({
				account: response.account,
				token: response.token,
			}))

			// Navigate to dashboard
			navigate('/dashboard')
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'Account selection failed'
			dispatch(setError(message))
		} finally {
			dispatch(setLoading(false))
		}
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
					<div className="h-32 bg-gray-200 rounded"></div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
						<Building2 className="h-6 w-6 text-indigo-600" />
					</div>
					<h2 className="mt-6 text-3xl font-bold text-gray-900">
						Select Account
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Choose the account you want to manage
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Available Accounts</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="account_id">Account</Label>
								<Select
									value={selectedAccountId?.toString()}
									onValueChange={(value) => setValue('account_id', parseInt(value))}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select an account" />
									</SelectTrigger>
									<SelectContent>
										{accounts.map((account) => (
											<SelectItem key={account.id} value={account.id.toString()}>
												<div className="flex items-center gap-2">
													<Building2 className="h-4 w-4" />
													<span>{account.name}</span>
													<span className="text-sm text-gray-500">({account.type})</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.account_id && (
									<p className="text-sm text-red-500">{errors.account_id.message}</p>
								)}
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={!selectedAccountId}
							>
								Continue to Dashboard
							</Button>
						</form>
					</CardContent>
				</Card>

				<div className="text-center">
					<p className="text-sm text-gray-600">
						Welcome, {user?.name}
					</p>
				</div>
			</div>
		</div>
	)
}
