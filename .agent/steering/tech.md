# Technology Stack

## Core Technologies
- **React 19.1.0** - Modern React with latest features
- **Vite 7.0.6** - Fast build tool and dev server
- **React Router DOM 7.7.1** - Client-side routing
- **JavaScript (ES Modules)** - No TypeScript, pure JS with modern syntax

## Styling & UI
- **Tailwind CSS 4.1.11** - Utility-first CSS framework with custom theme
- **Lucide React** - Icon library
- **Custom CSS animations** - Space-themed effects (meteors, stars, floating)
- **CSS custom properties** - Theme variables for dark/light mode

## State & Context
- **React Context** - Theme management (ThemeContext)
- **Local Storage** - Theme persistence
- **React Hooks** - useState, useEffect, useContext

## UI Libraries
- **Radix UI Toast** - Accessible toast notifications
- **React Toastify** - Additional toast functionality
- **Class Variance Authority** - Component variant management
- **clsx + tailwind-merge** - Conditional class utilities

## Development Tools
- **ESLint** - Code linting with React-specific rules
- **Vite Plugin React** - React support with Fast Refresh

## Common Commands
```bash
# Development
npm run dev          # Start dev server (usually http://localhost:5173)

# Building
npm run build        # Production build
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## Path Aliases
- `@/` maps to `./src/` for cleaner imports