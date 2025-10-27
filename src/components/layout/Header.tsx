import { useState } from 'react'
import { Menu, Bell, User, LogOut, Building2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { ThemeToggle } from '../ui/theme-toggle'

interface HeaderProps {
	user: { name: string; role: string } | null
	account: { name: string } | null
	onLogout: () => void
	onMenuClick: () => void
}

export function Header({ user, account, onLogout, onMenuClick }: HeaderProps) {
	const [notifications] = useState([
		{ id: 1, message: 'New booking received', time: '2 minutes ago' },
		{ id: 2, message: 'System maintenance scheduled', time: '1 hour ago' },
	])

	return (
		<header className="bg-card shadow-sm border-b border-border">
			<div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Left side */}
				<div className="flex items-center">
					<Button
						variant="ghost"
						size="sm"
						onClick={onMenuClick}
						className="lg:hidden mr-2"
					>
						<Menu className="h-5 w-5" />
					</Button>

					<div className="flex items-center gap-2">
						<Building2 className="h-5 w-5 text-muted-foreground" />
						<span className="text-sm font-medium text-foreground">
							{account?.name}
						</span>
					</div>
				</div>

				{/* Right side */}
				<div className="flex items-center gap-4">
					{/* Theme Toggle */}
					<ThemeToggle />

					{/* Notifications */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="relative hover:bg-transparent hover:text-primary">
								<Bell className="h-5 w-5" />
								{notifications.length > 0 && (
									<span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-80">
							<div className="p-2">
								<h4 className="font-medium text-sm">Notifications</h4>
							</div>
							<DropdownMenuSeparator />
							{notifications.map((notification) => (
								<DropdownMenuItem key={notification.id} className="p-3">
									<div>
										<p className="text-sm">{notification.message}</p>
										<p className="text-xs text-muted-foreground">{notification.time}</p>
									</div>
								</DropdownMenuItem>
							))}
							{notifications.length === 0 && (
								<DropdownMenuItem disabled>
									<p className="text-sm text-muted-foreground">No notifications</p>
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* User menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="flex items-center gap-2 border-none hover:bg-transparent hover:text-primary">
								<Avatar className="h-8 w-8">
									<AvatarFallback>
										{user?.name?.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="hidden sm:block text-left">
									<p className="text-sm font-medium">{user?.name}</p>
									<p className="text-xs text-muted-foreground">{user?.role}</p>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<User className="mr-2 h-4 w-4" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={onLogout}>
								<LogOut className="mr-2 h-4 w-4" />
								Sign out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	)
}
