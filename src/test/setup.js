import '@testing-library/jest-dom';

// Mock canvas and WebGL for testing
HTMLCanvasElement.prototype.getContext = vi.fn((contextType) => {
  if (contextType === '2d') {
    return {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      scale: vi.fn(),
      createImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(4),
        width: 1,
        height: 1
      })),
      putImageData: vi.fn(),
      fillStyle: '',
    };
  }
  return null;
});

// Mock Element.animate for Web Animations API
Element.prototype.animate = vi.fn(() => ({
  onfinish: null,
  oncancel: null,
  cancel: vi.fn(),
  finish: vi.fn(),
}));

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 1024,
  height: 768,
  top: 0,
  left: 0,
  bottom: 768,
  right: 1024,
}));

// Mock window dimensions
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: 768,
});

// Mock navigator.deviceMemory for performance tests
Object.defineProperty(global.navigator, 'deviceMemory', {
  writable: true,
  configurable: true,
  value: 8, // Default to high-end device
});