import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginSchema, type LoginData } from '../lib/validation/auth'
import { apiClient, setToken } from '../lib/api/client'
import { loginSuccess, setLoading, setError } from '../lib/store/slices/authSlice'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Shield, Eye, EyeOff } from 'lucide-react'

export function LoginPage() {
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginData>({
		resolver: zodResolver(loginSchema),
	})

	const onSubmit = async (data: LoginData) => {
		setIsLoading(true)
		dispatch(setLoading(true))
		dispatch(setError(null))

		try {
			const response = await apiClient.post('/backoffice/auth/login', data)

			// Store the system JWT token
			setToken(response.token)

			// Update Redux state
			dispatch(loginSuccess({
				user: response.user,
				token: response.token,
			}))

			// Navigate to account selection
			navigate('/select-account')
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'Login failed'
			dispatch(setError(message))
		} finally {
			setIsLoading(false)
			dispatch(setLoading(false))
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
						<Shield className="h-6 w-6 text-indigo-600" />
					</div>
					<h2 className="mt-6 text-3xl font-bold text-gray-900">
						Taxidia Back Office
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Sign in to your admin account
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Sign In</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									{...register('email')}
									className={errors.email ? 'border-red-500' : ''}
								/>
								{errors.email && (
									<p className="text-sm text-red-500">{errors.email.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? 'text' : 'password'}
										placeholder="Enter your password"
										{...register('password')}
										className={errors.password ? 'border-red-500' : ''}
									/>
									<button
										type="button"
										className="absolute inset-y-0 right-0 pr-3 flex items-center"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4 text-gray-400" />
										) : (
											<Eye className="h-4 w-4 text-gray-400" />
										)}
									</button>
								</div>
								{errors.password && (
									<p className="text-sm text-red-500">{errors.password.message}</p>
								)}
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={isLoading}
							>
								{isLoading ? 'Signing in...' : 'Sign In'}
							</Button>
						</form>
					</CardContent>
				</Card>

				<div className="text-center">
					<p className="text-sm text-gray-600">
						Need help? Contact your system administrator
					</p>
				</div>
			</div>
		</div>
	)
}
