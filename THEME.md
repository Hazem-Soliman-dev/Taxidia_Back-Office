# Theme System Documentation

## Overview

The Taxidia Back Office now includes a comprehensive dark/light mode theme system with custom colors based on your brand guidelines.

## Color Palette

### Primary Colors
- **Primary**: `#E90B35` (Red)
- **Secondary**: `#11161F` (Dark Blue)
- **Text**: `#787878` (Gray)
- **Accent**: `#161616` (Dark Gray)

### Light Mode
- **Background**: White (`#FFFFFF`)
- **Card**: White (`#FFFFFF`)
- **Border**: Light Gray (`#E2DFEB`)
- **Muted**: Light Gray (`#F5F5F5`)

### Dark Mode
- **Background**: Dark Blue (`#11161F`)
- **Card**: Dark Blue (`#11161F`)
- **Border**: Dark Gray (`#161616`)
- **Muted**: Dark Gray (`#161616`)

## Typography

### Font Families
- **Primary**: Roboto (400, 500, 600)
- **Secondary**: Roboto Slab (400)
- **Arabic**: Noto Kufi Arabic (400, 500, 600)

### Usage
```css
font-roboto        /* Roboto font family */
font-roboto-slab   /* Roboto Slab font family */
font-noto-kufi     /* Noto Kufi Arabic font family */
```

## Theme Toggle

The theme toggle is located in the header and provides a simple toggle between:
- **Light**: Default light mode
- **Dark**: Dark mode

Click the toggle button to switch between light and dark themes. The theme preference is automatically saved and restored on page reload.

## Implementation

### Theme Context
```tsx
import { useTheme } from './contexts/ThemeContext'

const { theme, setTheme, actualTheme } = useTheme()

// Toggle between light and dark
const toggleTheme = () => {
  setTheme(theme === "light" ? "dark" : "light")
}
```

### CSS Variables
All colors are available as CSS custom properties:
```css
--e-global-color-primary: #E90B35;
--e-global-color-secondary: #11161F;
--e-global-color-text: #787878;
--e-global-color-accent: #161616;
```

### Tailwind Classes
```css
bg-primary          /* Primary background */
text-primary        /* Primary text */
bg-global-primary   /* Direct global color */
text-global-text    /* Direct global text color */
```

## Components

### Theme Toggle Component
```tsx
import { ThemeToggle } from './components/ui/theme-toggle'

<ThemeToggle />
```

The toggle button automatically switches between light and dark modes with animated sun/moon icons.

### Theme Demo Component
```tsx
import { ThemeDemo } from './components/ui/theme-demo'

<ThemeDemo />
```

## Usage Examples

### Using Theme Colors in Components
```tsx
<div className="bg-card text-card-foreground border border-border">
  <h1 className="text-primary">Primary Heading</h1>
  <p className="text-muted-foreground">Muted text</p>
</div>
```

### Custom Global Colors
```tsx
<div className="bg-global-primary text-white">
  Custom primary color
</div>
```

## Browser Support

- **Class-based dark mode**: Uses Tailwind's `dark:` prefix
- **System preference**: Automatically detects and follows system theme
- **Persistence**: Theme preference is saved in localStorage
- **Smooth transitions**: All theme changes are animated

## Development

### Adding New Colors
1. Add CSS variables to `src/index.css`
2. Add Tailwind classes to `tailwind.config.js`
3. Update both light and dark mode variants

### Testing Themes
1. Use the theme toggle in the header
2. Check the Theme Demo component on the dashboard
3. Test with system theme changes
4. Verify localStorage persistence

## Accessibility

- **High contrast**: All color combinations meet WCAG guidelines
- **Reduced motion**: Respects user's motion preferences
- **Screen readers**: Proper ARIA labels on theme toggle
- **Keyboard navigation**: Full keyboard support for theme switching
