import { useDispatch } from 'react-redux'
import { endImpersonation } from '../../lib/store/slices/authSlice'
import { Button } from '../ui/button'
import { X, User } from 'lucide-react'

interface ImpersonationBannerProps {
	user: { name: string; email: string }
}

export function ImpersonationBanner({ user }: ImpersonationBannerProps) {
	const dispatch = useDispatch()

	const handleEndImpersonation = () => {
		dispatch(endImpersonation())
	}

	return (
		<div className="bg-yellow-50 border-b border-yellow-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between py-3">
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2">
							<User className="h-5 w-5 text-yellow-600" />
							<span className="text-sm font-medium text-yellow-800">
								Impersonating:
							</span>
							<span className="text-sm text-yellow-700">
								{user.name} ({user.email})
							</span>
						</div>
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={handleEndImpersonation}
						className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
					>
						<X className="h-4 w-4 mr-2" />
						End Impersonation
					</Button>
				</div>
			</div>
		</div>
	)
}
