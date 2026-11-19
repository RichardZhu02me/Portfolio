import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Home } from '../Home';

// Mock all the child components
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


describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render without crashing', () => {
    render(<Home />);

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

});