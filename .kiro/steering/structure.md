# Project Structure

## Root Level
- **Environment files**: `.env.development`, `.env.production`
- **Configuration**: `vite.config.js`, `eslint.config.js`, `package.json`
- **Entry point**: `index.html`

## Source Organization (`src/`)

### Core Application
- `main.jsx` - React app entry point with StrictMode
- `App.jsx` - Main app component with routing and global components
- `index.css` - Global styles, Tailwind imports, custom theme variables

### Component Architecture (`src/components/`)
Components follow a modular, section-based approach:
- **Layout**: `Navbar.jsx`, `Footer.jsx`
- **Sections**: `HeroSection.jsx`, `AboutSection.jsx`, `SkillsSection.jsx`, `ProjectsSection.jsx`, `ContactSection.jsx`
- **Interactive**: `ChatbotWidget.jsx`, `ThemeToggle.jsx`
- **Effects**: `StarBackground.jsx`, `BubbleBackground.jsx`
- **Context**: `ThemeContext.jsx`

### Pages (`src/pages/`)
- `Home.jsx` - Main portfolio page with all sections
- `NotFound.jsx` - 404 error page

### Utilities (`src/lib/`)
- `utils.js` - Helper functions (cn utility for class merging)

### Assets (`src/assets/`)
- Static assets like icons and images

## Public Assets (`public/`)
- `vite.svg`, `star.svg` - Icons
- `projects/` - Project images and media

## Naming Conventions
- **Components**: PascalCase with descriptive names (`HeroSection.jsx`)
- **Files**: camelCase for utilities, PascalCase for components
- **Exports**: Named exports for pages and most components
- **CSS Classes**: Tailwind utilities + custom utility classes

## Architecture Patterns
- **Single Page Application** with React Router
- **Component composition** over inheritance
- **Context for global state** (theme management)
- **Section-based layout** for portfolio content
- **Utility-first styling** with Tailwind CSS