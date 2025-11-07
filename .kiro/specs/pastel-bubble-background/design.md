# Design Document

## Overview

The pastel bubble background feature will replace the current GlitchcoreBackground component in light mode with a new BubbleBackground component that renders animated floating bubbles in soft pastel colors. Additionally, the light theme color scheme will be updated to use pastel sky blue as the primary color, creating a cohesive and harmonious visual experience.

## Architecture

### Component Structure
```
BubbleBackground (React Component)
├── Bubble Generation Logic
├── Animation System (CSS-based)
├── Theme Integration
└── Performance Optimization
```

### Theme Integration
The component will integrate with the existing ThemeContext system, replacing the GlitchcoreBackground in light mode with the new BubbleBackground, while using the GlitchcoreBackground for dark mode instead of the current StarBackground.

## Components and Interfaces

### BubbleBackground Component

**Props Interface:**
```javascript
{
  bubbleCount?: number,        // Default: 15
  minSize?: number,           // Default: 20 (px)
  maxSize?: number,           // Default: 80 (px)
  animationDuration?: number, // Default: 15-25 (seconds)
  className?: string
}
```

**Key Features:**
- Generates random bubbles with varying sizes and positions
- Uses CSS animations for smooth floating motion
- Implements pastel color palette (sky blue, lavender, mint green, peach)
- Responsive design that adapts to viewport changes
- Hardware-accelerated animations using transform3d

### Bubble Generation Algorithm

**Bubble Properties:**
- **Size**: Random between minSize and maxSize
- **Position**: Random X coordinate, starts below viewport
- **Color**: Randomly selected from pastel palette
- **Animation Duration**: Random between 15-25 seconds
- **Opacity**: Semi-transparent (0.3-0.7) for layered effect

**Animation Pattern:**
- Bubbles start from bottom of screen
- Float upward with slight horizontal drift
- Fade in/out at start/end of animation cycle
- Continuous regeneration for infinite effect

## Data Models

### Bubble Object
```javascript
{
  id: string,           // Unique identifier
  size: number,         // Diameter in pixels
  x: number,           // X position (percentage)
  y: number,           // Y position (percentage)
  color: string,       // CSS color value
  duration: number,    // Animation duration in seconds
  delay: number        // Animation delay in seconds
}
```

### Pastel Color Palette
```javascript
const PASTEL_COLORS = [
  'rgba(135, 206, 235, 0.6)', // Sky blue
  'rgba(221, 160, 221, 0.6)', // Plum/Lavender
  'rgba(152, 251, 152, 0.6)', // Mint green
  'rgba(255, 218, 185, 0.6)', // Peach
  'rgba(255, 182, 193, 0.6)', // Light pink
  'rgba(173, 216, 230, 0.6)'  // Light blue
];
```

## Theme Updates

### Light Theme Color Scheme Changes

**Current Light Theme:**
```css
:root {
  --background: 210 40% 98%;
  --primary: 250 48% 60%;
  --card: 0 0% 100%;
}
```

**Updated Light Theme:**
```css
:root {
  --background: 210 40% 98%;
  --primary: 200 60% 80%;      /* Pastel sky blue */
  --primary-foreground: 210 40% 20%; /* Darker text for contrast */
  --card: 200 30% 96%;         /* Subtle blue tint */
  --accent: 220 40% 85%;       /* Complementary accent */
}
```

### CSS Custom Properties for Bubbles
```css
--animate-bubble-float: bubble-float var(--duration) ease-in-out infinite;
--animate-bubble-fade: bubble-fade var(--duration) ease-in-out infinite;
```

## Error Handling

### Performance Safeguards
- Maximum bubble count limit (20 bubbles)
- Animation frame throttling for mobile devices
- Automatic cleanup of completed animations
- Memory leak prevention through proper component unmounting

### Fallback Behavior
- Graceful degradation on older browsers
- Reduced animation complexity on low-performance devices
- CSS-only fallback if JavaScript fails

## Testing Strategy

### Unit Tests
- Bubble generation algorithm correctness
- Color palette randomization
- Animation timing calculations
- Component prop validation

### Integration Tests
- Theme context integration
- Background switching between light/dark modes
- Performance impact measurement
- Cross-browser compatibility

### Visual Tests
- Animation smoothness verification
- Color contrast accessibility checks
- Responsive behavior across screen sizes
- Theme transition smoothness

## Performance Considerations

### Optimization Techniques
- CSS transforms instead of position changes
- Hardware acceleration with `transform3d`
- Efficient bubble recycling system
- Intersection Observer for visibility optimization

### Mobile Optimizations
- Reduced bubble count on smaller screens
- Simplified animations on touch devices
- Battery-conscious animation timing
- Responsive bubble sizing

## Implementation Notes

### CSS Animation Strategy
Using CSS keyframes for optimal performance:
```css
@keyframes bubble-float {
  0% {
    transform: translate3d(0, 100vh, 0) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
    transform: translate3d(0, 90vh, 0) scale(1);
  }
  90% {
    opacity: 0.7;
    transform: translate3d(var(--drift), 10vh, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate3d(var(--drift), -10vh, 0) scale(0);
  }
}
```

### Integration Points
- Replace current light mode GlitchcoreBackground with new BubbleBackground in Home.jsx
- Replace current dark mode StarBackground with GlitchcoreBackground in Home.jsx
- Update theme variables in index.css for pastel light theme
- Maintain existing theme toggle functionality
- Configure GlitchcoreBackground with appropriate dark theme colors