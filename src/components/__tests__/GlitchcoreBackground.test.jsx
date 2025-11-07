import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GlitchcoreBackground from '../GlitchcoreBackground';

// Mock the useNoiseCanvas hook
vi.mock('../../hooks/useNoiseCanvas', () => ({
  useNoiseCanvas: vi.fn(() => ({ current: null }))
}));

describe('GlitchcoreBackground', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should render without crashing', () => {
    render(<GlitchcoreBackground />);
    
    const backgroundElement = screen.getByRole('presentation', { hidden: true });
    expect(backgroundElement).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const customClass = 'custom-opacity';
    render(<GlitchcoreBackground className={customClass} />);
    
    const backgroundElement = screen.getByRole('presentation', { hidden: true });
    expect(backgroundElement).toHaveClass(customClass);
  });

  it('should handle different intensity levels', () => {
    const { rerender } = render(<GlitchcoreBackground intensity="subtle" />);
    expect(screen.getByRole('presentation', { hidden: true })).toBeInTheDocument();
    
    rerender(<GlitchcoreBackground intensity="normal" />);
    expect(screen.getByRole('presentation', { hidden: true })).toBeInTheDocument();
    
    rerender(<GlitchcoreBackground intensity="intense" />);
    expect(screen.getByRole('presentation', { hidden: true })).toBeInTheDocument();
  });

  it('should accept custom colors configuration', () => {
    const customColors = {
      bgDark: '#000000',
      neon1: '#ff0000',
      neon2: '#00ff00',
      neon3: '#0000ff',
      opacities: {
        noise: 0.1,
        scanline: 0.1,
        silhouette: 0.1
      }
    };

    render(<GlitchcoreBackground colors={customColors} />);
    
    const backgroundElement = screen.getByRole('presentation', { hidden: true });
    expect(backgroundElement).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<GlitchcoreBackground />);
    
    const backgroundElement = screen.getByRole('presentation', { hidden: true });
    expect(backgroundElement).toHaveAttribute('aria-hidden', 'true');
    expect(backgroundElement).toHaveAttribute('aria-label');
  });

  it('should render gradient layers', () => {
    render(<GlitchcoreBackground />);
    
    const backgroundElement = screen.getByRole('presentation', { hidden: true });
    const gradientLayers = backgroundElement.querySelectorAll('.gradient-layer');
    
    expect(gradientLayers.length).toBeGreaterThan(0);
  });

  it('should render chromatic aberration silhouette', () => {
    render(<GlitchcoreBackground />);
    
    const backgroundElement = screen.getByRole('presentation', { hidden: true });
    const svgElements = backgroundElement.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('should render HUD text element', () => {
    render(<GlitchcoreBackground />);
    
    const backgroundElement = screen.getByRole('presentation', { hidden: true });
    const hudText = backgroundElement.querySelector('[style*="monospace"]');
    
    expect(hudText).toBeInTheDocument();
  });

  it('should cleanup effects on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    const { unmount } = render(<GlitchcoreBackground />);
    
    unmount();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});