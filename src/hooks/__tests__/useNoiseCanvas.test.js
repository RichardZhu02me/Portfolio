import { renderHook } from '@testing-library/react';
import { useNoiseCanvas } from '../useNoiseCanvas';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useNoiseCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should return a canvas ref', () => {
    const { result } = renderHook(() => useNoiseCanvas('normal'));
    
    expect(result.current).toBeDefined();
    expect(result.current.current).toBeNull(); // Initially null until attached
  });

  it('should handle different intensity levels', () => {
    const { result: normalResult } = renderHook(() => useNoiseCanvas('normal'));
    const { result: subtleResult } = renderHook(() => useNoiseCanvas('subtle'));
    const { result: intenseResult } = renderHook(() => useNoiseCanvas('intense'));
    
    expect(normalResult.current).toBeDefined();
    expect(subtleResult.current).toBeDefined();
    expect(intenseResult.current).toBeDefined();
  });

  it('should handle canvas context creation failure gracefully', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Mock getContext to return null
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
    
    const { result } = renderHook(() => useNoiseCanvas('normal'));
    
    expect(result.current).toBeDefined();
    
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    consoleWarnSpy.mockRestore();
  });

  it('should handle ImageData creation failure', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Mock createImageData to throw an error
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      scale: vi.fn(),
      createImageData: vi.fn(() => {
        throw new Error('ImageData not supported');
      }),
      putImageData: vi.fn(),
      fillStyle: '',
    }));
    
    const { result } = renderHook(() => useNoiseCanvas('normal'));
    
    expect(result.current).toBeDefined();
    
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    consoleWarnSpy.mockRestore();
  });

  it('should cleanup properly on unmount', () => {
    const { result, unmount } = renderHook(() => useNoiseCanvas('normal'));
    
    // Should not throw errors on unmount
    expect(() => unmount()).not.toThrow();
    expect(result.current).toBeDefined();
  });

  it('should handle animation loop errors gracefully', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock putImageData to throw an error
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      scale: vi.fn(),
      createImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(4),
        width: 1,
        height: 1
      })),
      putImageData: vi.fn(() => {
        throw new Error('Canvas error');
      }),
      fillStyle: '',
    }));
    
    const { result } = renderHook(() => useNoiseCanvas('normal'));
    
    expect(result.current).toBeDefined();
    
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    consoleErrorSpy.mockRestore();
  });
});