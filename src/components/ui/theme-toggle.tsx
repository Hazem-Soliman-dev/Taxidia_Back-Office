import { Moon, Sun } from "lucide-react"
import { useTheme } from "../../contexts/ThemeContext"
import { Button } from "./button"

export function ThemeToggle() {
	const { theme, setTheme } = useTheme()

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light")
	}

	// Show the icon for the theme that will be activated when clicked
	const isLight = theme === "light"
	const IconComponent = isLight ? Moon : Sun
	const iconLabel = isLight ? "Switch to dark mode" : "Switch to light mode"

	return (
		<Button
			variant="outline"
			size="sm"
			className="h-9 w-9 px-0 border-none hover:bg-transparent hover:text-primary"
			onClick={toggleTheme}
			title={iconLabel}
		>
			<IconComponent className="h-4 w-4 transition-all duration-200" />
			<span className="sr-only">{iconLabel}</span>
		</Button>
	)
}
