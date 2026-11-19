import { useEffect, useRef } from 'react';

/**
 * Custom hook for managing HTML5 canvas noise generation
 * Optimized for performance with frame rate throttling and efficient algorithms
 */
export const useNoiseCanvas = (intensity = 'normal') => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastFrameTimeRef = useRef(0);
  const imageDataRef = useRef(null);
  const errorStateRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx;
    try {
      ctx = canvas.getContext('2d');
      if (!ctx) {
        console.warn('useNoiseCanvas: Unable to get 2D context');
        return;
      }
    } catch (error) {
      console.error('useNoiseCanvas: Error getting canvas context:', error);
      errorStateRef.current = true;
      return;
    }

    // Performance optimization: reduce canvas resolution on mobile
    const isMobile = window.innerWidth < 768;
    const scaleFactor = isMobile ? 0.5 : intensity === 'subtle' ? 0.7 : 1;

    // Set up canvas sizing with proper pixel ratio handling and performance scaling
    const setupCanvas = () => {
      try {
        const rect = canvas.getBoundingClientRect();
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2); // Cap pixel ratio for performance
        
        // Apply performance scaling
        const effectiveWidth = rect.width * scaleFactor;
        const effectiveHeight = rect.height * scaleFactor;
        
        // Set actual size in memory (scaled for pixel ratio and performance)
        canvas.width = effectiveWidth * pixelRatio;
        canvas.height = effectiveHeight * pixelRatio;
        
        // Scale the drawing context
        ctx.scale(pixelRatio, pixelRatio);
        
        // Set CSS size to maintain proper display size
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        // Pre-allocate ImageData for performance with error handling
        try {
          imageDataRef.current = ctx.createImageData(canvas.width, canvas.height);
        } catch {
          console.warn('useNoiseCanvas: ImageData creation failed, falling back to simple drawing');
          imageDataRef.current = null;
        }
      } catch (error) {
        console.error('useNoiseCanvas: Canvas setup failed:', error);
        errorStateRef.current = true;
      }
    };

    // Optimized procedural noise generation algorithm with error handling
    const generateNoise = () => {
      if (errorStateRef.current) return;
      
      try {
        if (imageDataRef.current) {
          // Use ImageData for better performance
          const imageData = imageDataRef.current;
          const data = imageData.data;
          const length = data.length;
          
          // Performance optimization: use faster random generation
          // and reduce computation per pixel
          for (let i = 0; i < length; i += 4) {
            // Use bit operations for faster random generation
            const noise = (Math.random() * 256) | 0; // Bitwise OR for faster floor
            
            // Set RGB channels to same value for grayscale noise
            data[i] = noise;     // Red
            data[i + 1] = noise; // Green
            data[i + 2] = noise; // Blue
            
            // Optimized alpha calculation with intensity-based variation
            const alpha = intensity === 'intense' ? 
              ((Math.random() * 40) | 0) + 15 : 
              ((Math.random() * 25) | 0) + 8;
            data[i + 3] = alpha;
          }
          
          ctx.putImageData(imageData, 0, 0);
        } else {
          // Fallback to direct canvas drawing when ImageData is not available
          const width = canvas.width;
          const height = canvas.height;
          
          ctx.clearRect(0, 0, width, height);
          
          // Draw random pixels directly
          for (let i = 0; i < width * height * 0.1; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const alpha = intensity === 'intense' ? 
              Math.random() * 0.15 + 0.05 : 
              Math.random() * 0.1 + 0.03;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      } catch (error) {
        console.error('useNoiseCanvas: Noise generation failed:', error);
        errorStateRef.current = true;
      }
    };

    // Frame rate throttling optimized for performance (~12fps)
    const targetFPS = intensity === 'intense' ? 15 : 12;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime) => {
      if (errorStateRef.current) return;
      
      try {
        // Check if enough time has passed for next frame
        if (currentTime - lastFrameTimeRef.current >= frameInterval) {
          generateNoise();
          lastFrameTimeRef.current = currentTime;
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error('useNoiseCanvas: Animation loop error:', error);
        errorStateRef.current = true;
      }
    };

    // Debounced resize handler for performance
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setupCanvas();
      }, 100);
    };

    // Initialize canvas
    setupCanvas();
    
    // Start animation loop with requestAnimationFrame for smooth 60fps timing control
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup function with proper resource disposal
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      
      // Clear canvas context and dispose of ImageData
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      imageDataRef.current = null;
    };
  }, [intensity]);

  return canvasRef;
};