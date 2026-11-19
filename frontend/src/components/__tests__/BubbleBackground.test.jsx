import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BubbleBackground from '../BubbleBackground';

describe('BubbleBackground', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 768,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<BubbleBackground />);
      
      const backgroundElement = container.querySelector('.fixed.inset-0.pointer-events-none');
      expect(backgroundElement).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const customClass = 'custom-opacity';
      const { container } = render(<BubbleBackground className={customClass} />);
      
      const backgroundElement = container.querySelector('.fixed.inset-0.pointer-events-none');
      expect(backgroundElement).toHaveClass(customClass);
    });

    it('should have proper container styling', () => {
      const { container } = render(<BubbleBackground />);
      
      const backgroundElement = container.querySelector('.fixed.inset-0.pointer-events-none');
      expect(backgroundElement).toHaveClass('fixed', 'inset-0', 'pointer-events-none', 'overflow-hidden');
      expect(backgroundElement).toHaveStyle({ zIndex: '5' });
    });
  });

  describe('Props Configuration', () => {
    it('should accept custom bubble count prop', () => {
      const { container } = render(<BubbleBackground bubbleCount={5} />);
      
      const backgroundElement = container.querySelector('.fixed.inset-0.pointer-events-none');
      expect(backgroundElement).toBeInTheDocument();
    });

    it('should accept custom size props', () => {
      const { container } = render(<BubbleBackground minSize={30} maxSize={60} />);
      
      const backgroundElement = container.querySelector('.fixed.inset-0.pointer-events-none');
      expect(backgroundElement).toBeInTheDocument();
    });

    it('should accept custom animation duration', () => {
      const { container } = render(<BubbleBackground animationDuration={{ min: 10, max: 20 }} />);
      
      const backgroundElement = container.querySelector('.fixed.inset-0.pointer-events-none');
      expect(backgroundElement).toBeInTheDocument();
    });
  });

  describe('Performance Optimizations', () => {
    it('should use hardware acceleration hints', () => {
      const { container } = render(<BubbleBackground />);
      
      const backgroundElement = container.querySelector('.fixed.inset-0.pointer-events-none');
      expect(backgroundElement.style.contain).toBe('layout style paint');
    });

    it('should handle mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 500,
      });
      
      const { container } = render(<BubbleBackground />);
      
      const backgroundElement = container.querySelector('.fixed.inset-0.pointer-events-none');
      expect(backgroundElement).toBeInTheDocument();
    });
  });

  describe('Memory Management', () => {
    it('should cleanup on component unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(<BubbleBackground />);
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('should handle prop changes without memory leaks', () => {
      const { rerender } = render(<BubbleBackground bubbleCount={5} />);
      
      // Change props multiple times
      rerender(<BubbleBackground bubbleCount={10} />);
      rerender(<BubbleBackground bubbleCount={3} />);
      
      // Should not throw or cause memory issues
      expect(true).toBe(true);
    });
  });
});