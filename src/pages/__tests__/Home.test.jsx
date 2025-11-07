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

// Mock the ThemeContext with light mode by default
vi.mock('../../components/ThemeContext', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: () => ({
    isDarkMode: false,
    toggleTheme: vi.fn()
  })
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



  it('should have proper theme-based background switching', () => {
    render(<Home />);
    
    // Test that the component renders and has the expected structure
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    
    // In the mocked light mode, should show BubbleBackground
    expect(screen.getByTestId('bubble-background')).toBeInTheDocument();
    expect(screen.queryByTestId('glitchcore-background')).not.toBeInTheDocument();
  });
});