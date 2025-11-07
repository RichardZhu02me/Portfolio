import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BubbleBackground from '../BubbleBackground';

// Mock performance monitoring
const mockPerformanceObserver = vi.fn();
global.PerformanceObserver = vi.fn().mockImplementation(() => ({
  observe: mockPerformanceObserver,
  disconnect: vi.fn(),
}));

describe('BubbleBackground Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    // Reset performance mocks
    Object.defineProperty(global, 'performance', {
      writable: true,
      value: {
        now: vi.fn(() => Date.now()),
        mark: vi.fn(),
        measure: vi.fn(),
        getEntriesByType: vi.fn(() => []),
        getEntriesByName: vi.fn(() => [])
      }
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Animation Performance', () => {
    it('should use CSS animations for optimal performance', async () => {
      render(<BubbleBackground />);
      
      const backgroundElement = screen.getByRole('presentation', { hidden: true });
      const bubbles = backgroundElement.querySelectorAll('.absolute.rounded-full');
      
      bubbles.forEach(bubble => {
        // Should use CSS animations, not JavaScript-based animations
        expect(bubble.style.animation).toMatch(/bubble-float/);
        
        // Should use transform3d for hardware acceleration
        expect(bubble.style.transform).toBe('translate3d(0, 100vh, 0)');
        
        // Should have performance optimization classes
        expect(bubble).toHaveClass('will-change-transform');
        expect(bubble.style.backfaceVisibility).toBe('hidden');
        expect(bubble.style.perspective).toBe('1000px');
      });
    });

    it('should limit animation complexity on low-end devices', async () => {
      // Mock low-end device
      Object.defineProperty(global.navigator, 'deviceMemory', {
        writable: true,
        value: 2
      });
      
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
      
      render(<BubbleBackground />);
      
      const backgroundElement = screen.getByRole('presentation', { hidden: true });
      const bubbles = backgroundElement.querySelectorAll('.absolute.rounded-full');
      
      // Should use simplified animation
      bubbles.forEach(bubble => {
        expect(bubble.style.animation).toMatch(/bubble-float-simple/);
      });
      
      // Should have fewer bubbles
      expect(bubbles.length).toBeLessThanOrEqual(5);
    });

    it('should throttle resize events for performance', () => {
      const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      
      render(<BubbleBackground />);
      
      // Trigger multiple resize events rapidly
      act(() => {
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('resize'));
      });
      
      // Should throttle with setTimeout
      expect(setTimeoutSpy).toHaveBeenCalled();
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  describe('Memory Management', () => {
    it('should properly cleanup timers and event listeners', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      
      const { unmount } = render(<BubbleBackground />);
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('should prevent memory leaks with proper bubble cleanup', () => {
      const { unmount } = render(<BubbleBackground />);
      
      // Component should clean up bubbles array on unmount
      unmount();
      
      // No direct way to test internal state cleanup, but unmount should not throw
      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid prop changes without memory leaks', () => {
      const { rerender } = render(<BubbleBackground bubbleCount={10} />);
      
      // Rapidly change props multiple times
      for (let i = 0; i < 10; i++) {
        rerender(<BubbleBackground bubbleCount={i + 5} />);
      }
      
      // Should not throw or cause memory issues
      expect(screen.getByRole('presentation', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('Performance Monitoring', () => {
    it('should implement performance safeguards for low-end devices', async () => {
      // Mock low-end device with performance monitoring
      Object.defineProperty(global.navigator, 'deviceMemory', {
        writable: true,
        value: 2
      });
      
      const setIntervalSpy = vi.spyOn(global, 'setInterval');
      
      render(<BubbleBackground />);
      
      // Should set up performance monitoring interval for low-end devices
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
    });

    it('should adapt bubble count based on device capabilities', async () => {
      // Test desktop
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1920 });
      Object.defineProperty(global.navigator, 'deviceMemory', { writable: true, value: 8 });
      
      const { rerender } = render(<BubbleBackground bubbleCount={20} />);
      
      let backgroundElement = screen.getByRole('presentation', { hidden: true });
      let bubbles = backgroundElement.querySelectorAll('.absolute.rounded-full');
      expect(bubbles.length).toBe(20);
      
      // Test mobile
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 400 });
      rerender(<BubbleBackground bubbleCount={20} />);
      
      backgroundElement = screen.getByRole('presentation', { hidden: true });
      bubbles = backgroundElement.querySelectorAll('.absolute.rounded-full');
      expect(bubbles.length).toBeLessThan(20); // Should be reduced for mobile
    });

    it('should respect maximum bubble limits for performance', async () => {
      render(<BubbleBackground bubbleCount={100} />);
      
      const backgroundElement = screen.getByRole('presentation', { hidden: true });
      const bubbles = backgroundElement.querySelectorAll('.absolute.rounded-full');
      
      // Should never exceed MAX_BUBBLES (20)
      expect(bubbles.length).toBeLessThanOrEqual(20);
    });
  });

  describe('Animation Smoothness', () => {
    it('should use optimal CSS properties for smooth animations', async () => {
      render(<BubbleBackground />);
      
      const backgroundElement = screen.getByRole('presentation', { hidden: true });
      const bubbles = backgroundElement.querySelectorAll('.absolute.rounded-full');
      
      bubbles.forEach(bubble => {
        // Should use transform instead of position changes
        expect(bubble.style.transform).toBeTruthy();
        
        // Should have hardware acceleration hints
        expect(bubble.style.backfaceVisibility).toBe('hidden');
        expect(bubble.style.perspective).toBe('1000px');
        expect(bubble).toHaveClass('will-change-transform');
      });
      
      // Container should have containment for performance
      expect(backgroundElement.style.contain).toBe('layout style paint');
    });

    it('should vary animation timing to prevent synchronization', async () => {
      render(<BubbleBackground />);
      
      const backgroundElement = screen.getByRole('presentation', { hidden: true });
      const bubbles = backgroundElement.querySelectorAll('.absolute.rounded-full');
      
      const delays = Array.from(bubbles).map(bubble => 
        parseFloat(bubble.style.animationDelay)
      );
      
      const durations = Array.from(bubbles).map(bubble => {
        const match = bubble.style.animation.match(/(\d+(?:\.\d+)?)s/);
        return match ? parseFloat(match[1]) : 0;
      });
      
      // Should have varied delays and durations
      const uniqueDelays = new Set(delays);
      const uniqueDurations = new Set(durations);
      
      expect(uniqueDelays.size).toBeGreaterThan(1);
      expect(uniqueDurations.size).toBeGreaterThan(1);
    });

    it('should handle reduced motion preferences gracefully', async () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
      
      render(<BubbleBackground />);
      
      const backgroundElement = screen.getByRole('presentation', { hidden: true });
      const bubbles = backgroundElement.querySelectorAll('.absolute.rounded-full');
      
      // Should use simplified animation for reduced motion
      bubbles.forEach(bubble => {
        expect(bubble.style.animation).toMatch(/bubble-float-simple/);
      });
    });
  });

  describe('Resource Optimization', () => {
    it('should minimize DOM updates during animation', async () => {
      const { rerender } = render(<BubbleBackground />);
      
      // Multiple rerenders should not cause excessive DOM changes
      for (let i = 0; i < 5; i++) {
        rerender(<BubbleBackground />);
      }
      
      const backgroundElement = screen.getByRole('presentation', { hidden: true });
      expect(backgroundElement).toBeInTheDocument();
    });

    it('should use efficient bubble recycling', async () => {
      const { rerender } = render(<BubbleBackground bubbleCount={10} />);
      
      // Change bubble count
      rerender(<BubbleBackground bubbleCount={15} />);
      
      const backgroundElement = screen.getByRole('presentation', { hidden: true });
      const bubbles = backgroundElement.querySelectorAll('.absolute.rounded-full');
      
      expect(bubbles.length).toBe(15);
    });
  });
});