import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Badge } from "./badge"

export function ThemeDemo() {
	return (
		<div className="space-y-6 p-6">
			<div className="text-center">
				<h1 className="text-3xl font-bold text-foreground mb-2">Theme Demo</h1>
				<p className="text-muted-foreground">Testing the custom color scheme</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* Primary Colors */}
				<Card>
					<CardHeader>
						<CardTitle className="text-primary">Primary Colors</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 bg-primary rounded"></div>
							<span className="text-sm">Primary (#E90B35)</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 bg-primary/20 rounded"></div>
							<span className="text-sm">Primary 20%</span>
						</div>
						<Button className="w-full">Primary Button</Button>
					</CardContent>
				</Card>

				{/* Secondary Colors */}
				<Card>
					<CardHeader>
						<CardTitle className="text-secondary-foreground">Secondary Colors</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 bg-secondary rounded"></div>
							<span className="text-sm">Secondary</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 bg-accent rounded"></div>
							<span className="text-sm">Accent (#161616)</span>
						</div>
						<Button variant="secondary" className="w-full">Secondary Button</Button>
					</CardContent>
				</Card>

				{/* Text Colors */}
				<Card>
					<CardHeader>
						<CardTitle>Text Colors</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<p className="text-foreground">Foreground Text</p>
							<p className="text-muted-foreground">Muted Text (#787878)</p>
							<p className="text-primary">Primary Text</p>
						</div>
						<div className="flex gap-2">
							<Badge>Default</Badge>
							<Badge variant="secondary">Secondary</Badge>
						</div>
					</CardContent>
				</Card>

				{/* Background Colors */}
				<Card>
					<CardHeader>
						<CardTitle>Background Colors</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<div className="p-2 bg-background border rounded">
								<span className="text-sm">Background</span>
							</div>
							<div className="p-2 bg-card border rounded">
								<span className="text-sm">Card Background</span>
							</div>
							<div className="p-2 bg-muted border rounded">
								<span className="text-sm">Muted Background</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Custom Global Colors */}
				<Card>
					<CardHeader>
						<CardTitle>Custom Global Colors</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-global-primary rounded"></div>
								<span className="text-sm">Global Primary</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-global-secondary rounded"></div>
								<span className="text-sm">Global Secondary</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-global-light-bg rounded"></div>
								<span className="text-sm">Light Background</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Typography */}
				<Card>
					<CardHeader>
						<CardTitle className="font-roboto-slab">Typography</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<h1 className="text-2xl font-roboto font-semibold">Roboto Bold</h1>
							<h2 className="text-xl font-roboto-slab">Roboto Slab</h2>
							<p className="font-noto-kufi">Noto Kufi Arabic</p>
							<p className="text-sm text-muted-foreground">Regular text</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
