import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Home } from '../Home';

// Mock all the child components
vi.mock('../../components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>
}));

vi.mock('../../components/Navbar', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>
}));

vi.mock('../../components/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section">Hero Section</div>
}));

vi.mock('../../components/AboutSection', () => ({
  AboutSection: () => <div data-testid="about-section">About Section</div>
}));

vi.mock('../../components/SkillsSection', () => ({
  SkillsSection: () => <div data-testid="skills-section">Skills Section</div>
}));

vi.mock('../../components/ProjectsSection', () => ({
  ProjectsSection: () => <div data-testid="projects-section">Projects Section</div>
}));

vi.mock('../../components/ContactSection', () => ({
  ContactSection: () => <div data-testid="contact-section">Contact Section</div>
}));

vi.mock('../../components/Footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>
}));

vi.mock('../../components/StarBackground', () => ({
  StarBackground: () => <div data-testid="star-background">Star Background</div>
}));

vi.mock('../../components/GlitchcoreBackground', () => ({
  default: ({ className }) => <div data-testid="glitchcore-background" role="presentation" aria-hidden="true" className={className}>Glitchcore Background</div>
}));

vi.mock('../../components/BubbleBackground', () => ({
  default: ({ className }) => <div data-testid="bubble-background" role="presentation" aria-hidden="true" className={className}>Bubble Background</div>
}));

// Mock the ThemeContext - we'll control this in individual tests
const mockTheme = {
  isDarkMode: false,
  toggleTheme: vi.fn()
};

vi.mock('../../components/ThemeContext', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: () => mockTheme
}));

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render without crashing', () => {
    render(<Home />);
    
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render all main sections', () => {
    render(<Home />);
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('about-section')).toBeInTheDocument();
    expect(screen.getByTestId('skills-section')).toBeInTheDocument();
    expect(screen.getByTestId('projects-section')).toBeInTheDocument();
    expect(screen.getByTestId('contact-section')).toBeInTheDocument();
  });

  it('should show BubbleBackground in light mode', () => {
    render(<Home />);
    
    // In light mode, should show BubbleBackground
    expect(screen.getByTestId('bubble-background')).toBeInTheDocument();
    expect(screen.queryByTestId('glitchcore-background')).not.toBeInTheDocument();
    expect(screen.queryByTestId('star-background')).not.toBeInTheDocument();
  });



  it('should show GlitchcoreBackground in dark mode', () => {
    // Set dark mode
    mockTheme.isDarkMode = true;
    
    render(<Home />);
    
    // In dark mode, should show GlitchcoreBackground and hide BubbleBackground
    expect(screen.getByTestId('glitchcore-background')).toBeInTheDocument();
    expect(screen.getByTestId('bubble-background')).toBeInTheDocument(); // Still rendered but with opacity-0
    
    // Check that BubbleBackground has opacity-0 class in dark mode
    const bubbleBackground = screen.getByTestId('bubble-background');
    expect(bubbleBackground).toHaveClass('opacity-0');
  });

  describe('Theme Integration Tests', () => {
    beforeEach(() => {
      // Reset theme to light mode before each test
      mockTheme.isDarkMode = false;
      vi.clearAllMocks();
    });

    it('should properly switch backgrounds when theme changes', () => {
      const { rerender } = render(<Home />);
      
      // Initially in light mode - should show BubbleBackground
      expect(screen.getByTestId('bubble-background')).toBeInTheDocument();
      expect(screen.getByTestId('bubble-background')).toHaveClass('opacity-75');
      expect(screen.queryByTestId('glitchcore-background')).not.toBeInTheDocument();
      
      // Switch to dark mode
      mockTheme.isDarkMode = true;
      rerender(<Home />);
      
      // Should now show GlitchcoreBackground and hide BubbleBackground
      expect(screen.getByTestId('glitchcore-background')).toBeInTheDocument();
      expect(screen.getByTestId('bubble-background')).toHaveClass('opacity-0');
    });

    it('should configure BubbleBackground with correct props in light mode', () => {
      render(<Home />);
      
      const bubbleBackground = screen.getByTestId('bubble-background');
      expect(bubbleBackground).toBeInTheDocument();
      expect(bubbleBackground).toHaveClass('opacity-75');
      expect(bubbleBackground).not.toHaveClass('opacity-0');
    });

    it('should configure GlitchcoreBackground with correct props in dark mode', () => {
      mockTheme.isDarkMode = true;
      
      render(<Home />);
      
      const glitchcoreBackground = screen.getByTestId('glitchcore-background');
      expect(glitchcoreBackground).toBeInTheDocument();
      expect(glitchcoreBackground).toHaveClass('opacity-80');
    });

    it('should maintain BubbleBackground instance across theme switches for performance', () => {
      const { rerender } = render(<Home />);
      
      // Get initial BubbleBackground element
      const initialBubbleBackground = screen.getByTestId('bubble-background');
      
      // Switch to dark mode
      mockTheme.isDarkMode = true;
      rerender(<Home />);
      
      // BubbleBackground should still be present (just hidden)
      const hiddenBubbleBackground = screen.getByTestId('bubble-background');
      expect(hiddenBubbleBackground).toBeInTheDocument();
      expect(hiddenBubbleBackground).toHaveClass('opacity-0');
      
      // Switch back to light mode
      mockTheme.isDarkMode = false;
      rerender(<Home />);
      
      // BubbleBackground should be visible again
      const visibleBubbleBackground = screen.getByTestId('bubble-background');
      expect(visibleBubbleBackground).toBeInTheDocument();
      expect(visibleBubbleBackground).toHaveClass('opacity-75');
    });

    it('should only render GlitchcoreBackground in dark mode for performance', () => {
      // Light mode - no GlitchcoreBackground
      render(<Home />);
      expect(screen.queryByTestId('glitchcore-background')).not.toBeInTheDocument();
      
      // Dark mode - GlitchcoreBackground present
      mockTheme.isDarkMode = true;
      const { rerender } = render(<Home />);
      rerender(<Home />);
      expect(screen.getByTestId('glitchcore-background')).toBeInTheDocument();
    });
  });
});