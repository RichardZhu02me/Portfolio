import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useNoiseCanvas } from '@/hooks/useNoiseCanvas';

/**
 * GlitchcoreBackground - An immersive animated background component with glitchcore anime aesthetic
 * 
 * Features:
 * - Layered gradients with neon color palette
 * - Chromatic aberration anime silhouette effects
 * - Procedural noise and scanline overlays
 * - Dynamic glitch strip animations
 * - Floating particle system
 * - Responsive design with performance optimizations
 */
const GlitchcoreBackground = ({ 
  intensity = 'normal', 
  colors = null,
  className = ''
}) => {
  // State for chromatic jitter animation
  const [chromaticOffset, setChromaticOffset] = useState(8);
  const [jitterActive, setJitterActive] = useState(false);
  const silhouetteRef = useRef(null);
  const jitterIntervalRef = useRef(null);
  
  // State and refs for glitch strip system
  const [glitchStrips, setGlitchStrips] = useState([]);
  const glitchContainerRef = useRef(null);
  const glitchIntervalRef = useRef(null);
  const stripIdCounter = useRef(0);
  const stripTimeoutsRef = useRef(new Set()); // Track all strip cleanup timeouts
  
  // State and refs for particle system
  const [particles, setParticles] = useState([]);
  const particleContainerRef = useRef(null);
  
  // Mobile and accessibility detection
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Media query refs for proper cleanup
  const mobileQueryRef = useRef(null);
  const motionQueryRef = useRef(null);
  const resizeHandlerRef = useRef(null);
  
  // Animation refs for proper cleanup
  const activeAnimationsRef = useRef(new Set());
  
  // Component mounted state to prevent state updates after unmount
  const isMountedRef = useRef(true);
  
  // Error handling and fallback states
  const [hasCanvasSupport, setHasCanvasSupport] = useState(true);
  const [performanceMode, setPerformanceMode] = useState('normal'); // 'normal', 'reduced', 'minimal'
  const [errorState, setErrorState] = useState(null);
  
  // Performance monitoring
  const frameCountRef = useRef(0);
  const lastPerformanceCheckRef = useRef(Date.now());
  const performanceCheckIntervalRef = useRef(null);
  
  // Noise canvas hook
  const noiseCanvasRef = useNoiseCanvas(intensity);

  // Default color configuration
  const defaultColors = {
    bgDark: '#0a0210',
    neon1: '#ff2d95', // pink
    neon2: '#6efff6', // aqua  
    neon3: '#8b5cff', // purple
    opacities: {
      noise: 0.06,
      scanline: 0.06,
      silhouette: 0.12
    }
  };

  const colorConfig = colors || defaultColors;

  // Canvas support detection and error handling
  useEffect(() => {
    try {
      // Test canvas support
      const testCanvas = document.createElement('canvas');
      const testContext = testCanvas.getContext('2d');
      
      if (!testCanvas || !testContext) {
        console.warn('GlitchcoreBackground: Canvas not supported, falling back to CSS-only mode');
        setHasCanvasSupport(false);
      } else {
        // Test ImageData support
        try {
          testContext.createImageData(1, 1);
        } catch {
          console.warn('GlitchcoreBackground: ImageData not supported, disabling noise effects');
          setHasCanvasSupport(false);
        }
      }
      
      // Test for WebGL support (optional enhancement)
      const webglSupported = !!testCanvas.getContext('webgl') || !!testCanvas.getContext('experimental-webgl');
      if (!webglSupported) {
        console.info('GlitchcoreBackground: WebGL not available, using 2D canvas fallback');
      }
      
    } catch (error) {
      console.error('GlitchcoreBackground: Error during capability detection:', error);
      setErrorState('Canvas detection failed');
      setHasCanvasSupport(false);
    }
  }, []);

  // Performance monitoring system
  useEffect(() => {
    if (prefersReducedMotion || !hasCanvasSupport) return;

    const checkPerformance = () => {
      if (!isMountedRef.current) return;
      
      const now = Date.now();
      const timeDelta = now - lastPerformanceCheckRef.current;
      
      if (timeDelta >= 5000) { // Check every 5 seconds
        const fps = (frameCountRef.current / timeDelta) * 1000;
        
        // Adjust performance mode based on FPS
        if (fps < 30 && performanceMode === 'normal') {
          console.warn('GlitchcoreBackground: Low FPS detected, reducing effects');
          setPerformanceMode('reduced');
        } else if (fps < 15 && performanceMode === 'reduced') {
          console.warn('GlitchcoreBackground: Very low FPS detected, switching to minimal mode');
          setPerformanceMode('minimal');
        } else if (fps > 45 && performanceMode !== 'normal') {
          console.info('GlitchcoreBackground: Performance improved, restoring effects');
          setPerformanceMode('normal');
        }
        
        frameCountRef.current = 0;
        lastPerformanceCheckRef.current = now;
      }
      
      frameCountRef.current++;
    };

    performanceCheckIntervalRef.current = setInterval(checkPerformance, 100);

    return () => {
      if (performanceCheckIntervalRef.current) {
        clearInterval(performanceCheckIntervalRef.current);
      }
    };
  }, [performanceMode, prefersReducedMotion, hasCanvasSupport]);

  // Media query detection for responsive optimizations with proper lifecycle management
  useEffect(() => {
    const checkMediaQueries = () => {
      if (!isMountedRef.current) return;
      
      const mobileQuery = window.matchMedia('(max-width: 768px)');
      setIsMobile(mobileQuery.matches);
      
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(motionQuery.matches);
    };

    checkMediaQueries();

    // Store media query objects in refs for cleanup
    mobileQueryRef.current = window.matchMedia('(max-width: 768px)');
    motionQueryRef.current = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleMobileChange = (e) => {
      if (isMountedRef.current) {
        setIsMobile(e.matches);
      }
    };
    
    const handleMotionChange = (e) => {
      if (isMountedRef.current) {
        setPrefersReducedMotion(e.matches);
      }
    };
    
    mobileQueryRef.current.addEventListener('change', handleMobileChange);
    motionQueryRef.current.addEventListener('change', handleMotionChange);

    return () => {
      if (mobileQueryRef.current) {
        mobileQueryRef.current.removeEventListener('change', handleMobileChange);
      }
      if (motionQueryRef.current) {
        motionQueryRef.current.removeEventListener('change', handleMotionChange);
      }
    };
  }, []);

  // Chromatic jitter animation system with proper lifecycle management
  useEffect(() => {
    if (prefersReducedMotion) return;

    // Capture ref values for cleanup
    const activeAnimations = activeAnimationsRef.current;

    const triggerJitter = () => {
      if (!isMountedRef.current) return;
      
      const baseOffset = isMobile ? 3 : 6;
      const newOffset = (Math.random() * baseOffset) + (isMobile ? 1 : 2);
      setChromaticOffset(newOffset);
      setJitterActive(true);

      if (silhouetteRef.current) {
        const animation = silhouetteRef.current.animate([
          { filter: 'blur(0.6px) hue-rotate(0deg)' },
          { filter: `blur(${isMobile ? '0.4px' : '0.8px'}) hue-rotate(${isMobile ? '5deg' : '10deg'})` }
        ], {
          duration: (isMobile ? 150 : 250) + Math.random() * (isMobile ? 200 : 400),
          direction: 'alternate',
          easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)'
        });

        // Track active animation for cleanup
        activeAnimationsRef.current.add(animation);

        animation.onfinish = () => {
          if (isMountedRef.current) {
            setJitterActive(false);
          }
          activeAnimationsRef.current.delete(animation);
        };

        animation.oncancel = () => {
          activeAnimationsRef.current.delete(animation);
        };
      }
    };

    const scheduleNextJitter = () => {
      if (!isMountedRef.current) return;
      
      const baseDelay = isMobile ? 2000 : 1200;
      const randomDelay = isMobile ? 3000 : 2200;
      const delay = baseDelay + Math.random() * randomDelay;
      
      jitterIntervalRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          triggerJitter();
          scheduleNextJitter();
        }
      }, delay);
    };

    scheduleNextJitter();

    return () => {
      if (jitterIntervalRef.current) {
        clearTimeout(jitterIntervalRef.current);
        jitterIntervalRef.current = null;
      }
      
      // Cancel any active animations
      activeAnimations.forEach(animation => {
        try {
          animation.cancel();
        } catch {
          // Animation might already be finished/cancelled
        }
      });
      activeAnimations.clear();
    };
  }, [isMobile, prefersReducedMotion]);

  // Glitch strip spawning mechanism with proper lifecycle management
  useEffect(() => {
    if (prefersReducedMotion) return;

    // Capture ref values for cleanup
    const stripTimeouts = stripTimeoutsRef.current;

    const createGlitchStrip = () => {
      if (!isMountedRef.current) return;
      
      const stripId = stripIdCounter.current++;
      const baseWidth = isMobile ? 100 : 200;
      const baseHeight = isMobile ? 4 : 8;
      
      const width = Math.random() * baseWidth + (isMobile ? 30 : 50);
      const height = Math.random() * baseHeight + 2;
      const top = Math.random() * 100;
      const left = Math.random() * 120 - 10;
      
      const opacity = (Math.random() * (isMobile ? 0.6 : 0.8)) + (isMobile ? 0.1 : 0.2);
      const blur = Math.random() * (isMobile ? 1 : 2);
      const hueRotate = Math.random() * 360;
      
      const newStrip = {
        id: stripId,
        width,
        height,
        top,
        left,
        opacity,
        blur,
        hueRotate,
        animationDuration: Math.random() * (isMobile ? 600 : 800) + (isMobile ? 300 : 400),
        createdAt: Date.now()
      };

      if (isMountedRef.current) {
        setGlitchStrips(prev => [...prev, newStrip]);
      }

      // Track cleanup timeout for proper disposal
      const cleanupTimeout = setTimeout(() => {
        if (isMountedRef.current) {
          setGlitchStrips(prev => prev.filter(strip => strip.id !== stripId));
        }
        stripTimeoutsRef.current.delete(cleanupTimeout);
      }, newStrip.animationDuration + 100);
      
      stripTimeoutsRef.current.add(cleanupTimeout);
    };

    const scheduleNextGlitch = () => {
      if (!isMountedRef.current) return;
      
      const baseDelay = isMobile ? 500 : 350;
      const randomDelay = isMobile ? 2000 : 1400;
      const delay = baseDelay + Math.random() * randomDelay;
      
      glitchIntervalRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          createGlitchStrip();
          scheduleNextGlitch();
        }
      }, delay);
    };

    scheduleNextGlitch();

    return () => {
      if (glitchIntervalRef.current) {
        clearTimeout(glitchIntervalRef.current);
        glitchIntervalRef.current = null;
      }
      
      // Clear all strip cleanup timeouts
      stripTimeouts.forEach(timeout => {
        clearTimeout(timeout);
      });
      stripTimeouts.clear();
    };
  }, [isMobile, prefersReducedMotion]);

  // Particle system generation with proper lifecycle management
  useEffect(() => {
    const generateParticles = () => {
      if (!isMountedRef.current) return;
      
      if (prefersReducedMotion || (isMobile && window.innerWidth < 480)) {
        setParticles([]);
        return;
      }

      const viewportArea = window.innerWidth * window.innerHeight;
      
      let baseParticleCount;
      if (isMobile) {
        baseParticleCount = Math.min(20, Math.floor(viewportArea / 30000));
      } else {
        baseParticleCount = Math.min(80, Math.floor(viewportArea / 15000));
      }
      
      const newParticles = [];
      
      for (let i = 0; i < baseParticleCount; i++) {
        const particle = {
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * (isMobile ? 2 : 3) + 1,
          color: Math.random() > 0.5 ? colorConfig.neon1 : colorConfig.neon2,
          opacity: Math.random() * (isMobile ? 0.6 : 0.8) + (isMobile ? 0.1 : 0.2),
          animationDelay: Math.random() * (isMobile ? 5 : 10),
          animationDuration: Math.random() * (isMobile ? 6 : 8) + (isMobile ? 8 : 12),
          floatDirection: Math.random() * 360,
          floatDistance: Math.random() * (isMobile ? 20 : 30) + (isMobile ? 5 : 10)
        };
        
        newParticles.push(particle);
      }
      
      if (isMountedRef.current) {
        setParticles(newParticles);
      }
    };

    generateParticles();

    const handleResize = () => {
      if (isMountedRef.current) {
        generateParticles();
      }
    };

    // Store resize handler ref for cleanup
    resizeHandlerRef.current = handleResize;
    window.addEventListener('resize', handleResize);

    return () => {
      if (resizeHandlerRef.current) {
        window.removeEventListener('resize', resizeHandlerRef.current);
        resizeHandlerRef.current = null;
      }
    };
  }, [colorConfig.neon1, colorConfig.neon2, isMobile, prefersReducedMotion]);

  // Component unmount cleanup effect
  useEffect(() => {
    // Capture ref values for cleanup
    const stripTimeouts = stripTimeoutsRef.current;
    const activeAnimations = activeAnimationsRef.current;

    return () => {
      // Mark component as unmounted to prevent state updates
      isMountedRef.current = false;
      
      // Clear all timeouts and intervals
      if (jitterIntervalRef.current) {
        clearTimeout(jitterIntervalRef.current);
      }
      
      if (glitchIntervalRef.current) {
        clearTimeout(glitchIntervalRef.current);
      }
      
      // Clear all strip cleanup timeouts
      stripTimeouts.forEach(timeout => {
        clearTimeout(timeout);
      });
      stripTimeouts.clear();
      
      // Cancel all active animations
      activeAnimations.forEach(animation => {
        try {
          animation.cancel();
        } catch {
          // Animation might already be finished/cancelled
        }
      });
      activeAnimations.clear();
      
      // Remove event listeners
      if (mobileQueryRef.current) {
        try {
          mobileQueryRef.current.removeEventListener('change', () => {});
        } catch {
          // Listener might already be removed
        }
      }
      
      if (motionQueryRef.current) {
        try {
          motionQueryRef.current.removeEventListener('change', () => {});
        } catch {
          // Listener might already be removed
        }
      }
      
      if (resizeHandlerRef.current) {
        window.removeEventListener('resize', resizeHandlerRef.current);
      }
    };
  }, []);

  // Error boundary fallback
  if (errorState) {
    return (
      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(10,2,16,0.8) 0%, rgba(20,5,30,0.6) 100%)'
        }}
        aria-hidden="true"
      />
    );
  }
  const shouldShowParticles = performanceMode !== 'minimal' && !prefersReducedMotion;
  const shouldShowGlitchStrips = performanceMode !== 'minimal' && !prefersReducedMotion;
  const shouldShowNoise = hasCanvasSupport && performanceMode !== 'minimal';

  // CSS custom properties with mobile and accessibility optimizations
  const cssVariables = {
    '--bg-dark': colorConfig.bgDark,
    '--neon-1': colorConfig.neon1,
    '--neon-2': colorConfig.neon2,
    '--neon-3': colorConfig.neon3,
    // Mobile-optimized opacity values
    '--noise-opacity': isMobile ? colorConfig.opacities.noise * 0.7 : colorConfig.opacities.noise,
    '--scanline-opacity': isMobile ? colorConfig.opacities.scanline * 0.8 : colorConfig.opacities.scanline,
    '--silhouette-opacity': isMobile ? colorConfig.opacities.silhouette * 0.7 : colorConfig.opacities.silhouette,
    '--chromatic-offset': `${chromaticOffset}px`,
    '--glitch-frequency': intensity === 'subtle' ? '5000ms' : intensity === 'intense' ? '2000ms' : '3500ms',
    // Mobile-optimized gradient opacity values
    '--gradient-opacity-1': (() => {
      const base = intensity === 'subtle' ? 0.06 : intensity === 'intense' ? 0.12 : 0.08;
      return isMobile ? base * 0.8 : base;
    })(),
    '--gradient-opacity-2': (() => {
      const base = intensity === 'subtle' ? 0.04 : intensity === 'intense' ? 0.08 : 0.06;
      return isMobile ? base * 0.8 : base;
    })(),
    '--gradient-opacity-3': (() => {
      const base = intensity === 'subtle' ? 0.25 : intensity === 'intense' ? 0.45 : 0.35;
      return isMobile ? base * 0.9 : base;
    })(),
    // Override z-index to make it visible
    zIndex: 0
  };

  return (
    <div 
      id="glitch-bg"
      className={cn(
        // Fixed positioning and z-index for background layer
        "fixed inset-0 -z-10 pointer-events-none block overflow-hidden",
        // Full viewport coverage with Tailwind classes
        "w-full h-full",
        className
      )}
      style={cssVariables}
      aria-hidden="true"
      role="presentation"
      aria-label="Decorative glitchcore anime background with animated effects"
    >
      {/* Static gradient background layers with neon color variables */}
      <div 
        className="absolute inset-0 mix-blend-normal"
        style={{
          background: `
            radial-gradient(1200px 600px at 10% 20%, rgba(139,92,255,var(--gradient-opacity-1)), transparent 8%),
            radial-gradient(900px 500px at 90% 80%, rgba(110,255,246,var(--gradient-opacity-2)), transparent 10%),
            radial-gradient(800px 400px at 50% 50%, rgba(255,45,149,var(--gradient-opacity-2)), transparent 12%),
            linear-gradient(180deg, rgba(0,0,0,var(--gradient-opacity-3)), var(--bg-dark))
          `
        }}
      />
      
      {/* Additional depth gradient overlay */}
      <div 
        className="absolute inset-0 mix-blend-multiply"
        style={{
          background: `
            linear-gradient(135deg, rgba(139,92,255,0.03) 0%, transparent 25%, rgba(110,255,246,0.02) 50%, transparent 75%, rgba(255,45,149,0.03) 100%),
            radial-gradient(ellipse at center, transparent 30%, rgba(10,2,16,0.4) 100%)
          `
        }}
      />

      {/* Animated gradient drift layers with different durations */}
      <div 
        className="gradient-layer g1 absolute opacity-90 blur-[60px] saturate-[1.2]"
        style={{
          inset: '-20%',
          background: `conic-gradient(from 200deg, 
            rgba(255,45,149,var(--gradient-opacity-1)), 
            rgba(139,92,255,var(--gradient-opacity-2)), 
            rgba(110,255,246,var(--gradient-opacity-2)))`,
          left: '-10%',
          top: '-30%',
          width: '140%',
          height: '160%',
          animation: 'gradientDrift1 18s ease-in-out infinite'
        }}
      />
      
      <div 
        className="gradient-layer g2 absolute opacity-80 blur-[80px] saturate-[1.1]"
        style={{
          inset: '-20%',
          background: `conic-gradient(from 10deg, 
            rgba(110,255,246,var(--gradient-opacity-2)), 
            rgba(255,45,149,var(--gradient-opacity-1)), 
            rgba(139,92,255,var(--gradient-opacity-2)))`,
          right: '-10%',
          bottom: '-30%',
          width: '130%',
          height: '140%',
          animation: 'gradientDrift2 26s ease-in-out infinite'
        }}
      />
      
      {/* Third animated layer for enhanced depth */}
      <div 
        className="gradient-layer g3 absolute opacity-70 blur-[100px] saturate-[1.3]"
        style={{
          inset: '-15%',
          background: `radial-gradient(ellipse 800px 400px at 30% 70%, 
            rgba(139,92,255,var(--gradient-opacity-1)), 
            transparent 60%)`,
          left: '20%',
          top: '10%',
          width: '120%',
          height: '120%',
          animation: 'gradientPulse 32s ease-in-out infinite'
        }}
      />

      {/* Chromatic aberration anime silhouette layer */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 'var(--silhouette-opacity)' }}>
        <div 
          ref={silhouetteRef}
          className={cn(
            "silhouette-mobile relative w-[80vmin] max-w-[1200px] blur-[0.6px] contrast-110 chromatic-jitter",
            jitterActive && "active"
          )}
        >
          {/* Red chromatic layer */}
          <div 
            className="absolute inset-0 mix-blend-screen opacity-90"
            style={{
              transform: 'translateX(calc(var(--chromatic-offset) * -1)) translateY(0)',
              color: 'var(--neon-1)'
            }}
          >
            <svg 
              viewBox="0 0 800 800" 
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full block"
            >
              <defs>
                <linearGradient id="g-red" x1="0" x2="1">
                  <stop offset="0%" stopColor="var(--neon-1)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="var(--neon-3)" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="none"/>
              <g transform="translate(400,420)">
                <path 
                  d="M-180,-140 C-140,-220 20,-260 120,-230 C160,-220 180,-180 160,-140 C140,-80 80,-20 80,40 C80,140 20,200 -60,220 C-120,235 -200,200 -240,140 C-280,80 -260,0 -220,-40 C-200,-70 -200,-90 -180,-140 Z" 
                  fill="url(#g-red)"
                />
              </g>
            </svg>
          </div>

          {/* Green chromatic layer */}
          <div 
            className="absolute inset-0 mix-blend-screen opacity-90"
            style={{
              transform: 'translateX(calc(var(--chromatic-offset) * 0.5)) translateY(0)',
              color: 'var(--neon-2)'
            }}
          >
            <svg 
              viewBox="0 0 800 800" 
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full block"
            >
              <defs>
                <linearGradient id="g-grn" x1="0" x2="1">
                  <stop offset="0%" stopColor="var(--neon-2)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="var(--neon-1)" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <g transform="translate(400,420)">
                <path 
                  d="M-180,-140 C-140,-220 20,-260 120,-230 C160,-220 180,-180 160,-140 C140,-80 80,-20 80,40 C80,140 20,200 -60,220 C-120,235 -200,200 -240,140 C-280,80 -260,0 -220,-40 C-200,-70 -200,-90 -180,-140 Z" 
                  fill="url(#g-grn)"
                />
              </g>
            </svg>
          </div>

          {/* Blue chromatic layer (center) */}
          <div 
            className="absolute inset-0 mix-blend-screen opacity-90"
            style={{
              transform: 'translateX(calc(var(--chromatic-offset) * 0.2)) translateY(0)',
              color: 'var(--neon-3)'
            }}
          >
            <svg 
              viewBox="0 0 800 800" 
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full block"
            >
              <defs>
                <linearGradient id="g-blu" x1="0" x2="1">
                  <stop offset="0%" stopColor="var(--neon-3)" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="var(--neon-2)" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <g transform="translate(400,420)">
                <path 
                  d="M-180,-140 C-140,-220 20,-260 120,-230 C160,-220 180,-180 160,-140 C140,-80 80,-20 80,40 C80,140 20,200 -60,220 C-120,235 -200,200 -240,140 C-280,80 -260,0 -220,-40 C-200,-70 -200,-90 -180,-140 Z" 
                  fill="url(#g-blu)"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Noise canvas layer - procedural noise texture with fallback */}
      {shouldShowNoise ? (
        <canvas
          ref={noiseCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay"
          style={{ 
            opacity: 'var(--noise-opacity)',
            filter: 'contrast(1.2) brightness(1.1)'
          }}
          aria-hidden="true"
        />
      ) : (
        // CSS-only noise fallback when canvas is not supported
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            opacity: 'var(--noise-opacity)',
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '4px 4px, 6px 6px',
            filter: 'contrast(1.2) brightness(1.1)'
          }}
          aria-hidden="true"
        />
      )}

      {/* Scanline overlay system - horizontal line pattern */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          opacity: 'var(--scanline-opacity)',
          backgroundImage: `linear-gradient(
            transparent 0px,
            transparent 1px,
            rgba(110, 255, 246, 0.1) 1px,
            rgba(110, 255, 246, 0.1) 2px,
            transparent 2px,
            transparent 3px
          )`,
          backgroundSize: '100% 3px',
          backgroundRepeat: 'repeat'
        }}
        aria-hidden="true"
      />

      {/* Dynamic glitch strip animation system with performance control */}
      {shouldShowGlitchStrips && (
        <div 
          ref={glitchContainerRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {glitchStrips.map(strip => (
          <div
            key={strip.id}
            className="glitch-strip absolute mix-blend-screen"
            style={{
              width: `${strip.width}px`,
              height: `${strip.height}px`,
              top: `${strip.top}%`,
              left: `${strip.left}%`,
              opacity: strip.opacity,
              filter: `blur(${strip.blur}px) hue-rotate(${strip.hueRotate}deg)`,
              background: `linear-gradient(90deg, 
                rgba(255,45,149,0.9) 0%, 
                rgba(110,255,246,0.7) 50%, 
                rgba(139,92,255,0.8) 100%)`,
              animation: `glitchStripMove ${strip.animationDuration}ms ease-out forwards`,
              transform: 'translateX(-100%)', // Start off-screen left
              zIndex: 10
            }}
          />
          ))}
        </div>
      )}

      {/* Floating particle system with performance control */}
      {shouldShowParticles && (
        <div 
          ref={particleContainerRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {particles.map(particle => (
          <div
            key={particle.id}
            className="particle absolute rounded-full mix-blend-screen"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              animation: `particleFloat ${particle.animationDuration}s ease-in-out infinite`,
              animationDelay: `${particle.animationDelay}s`,
              '--float-x': `${Math.cos(particle.floatDirection * Math.PI / 180) * particle.floatDistance}px`,
              '--float-y': `${Math.sin(particle.floatDirection * Math.PI / 180) * particle.floatDistance}px`,
              zIndex: 5
            }}
          />
          ))}
        </div>
      )}

      {/* Vignette overlay for depth perception */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          background: `radial-gradient(ellipse at center, 
            transparent 20%, 
            rgba(10,2,16,0.3) 60%, 
            rgba(10,2,16,0.7) 100%)`,
          zIndex: 15
        }}
        aria-hidden="true"
      />

      {/* HUD-style text element for aesthetic completeness */}
      <div
        className="absolute bottom-6 left-6 pointer-events-none select-none"
        style={{
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          color: 'var(--neon-2)',
          opacity: 0.4,
          textShadow: `0 0 8px var(--neon-2)`,
          letterSpacing: '0.1em',
          zIndex: 20
        }}
        aria-hidden="true"
      >
        <div className="flex flex-col items-end space-y-1">
          <div>GLITCH_CORE.EXE</div>
          <div className="text-xs opacity-60">v2.1.4</div>
          <div className="text-xs opacity-40">ACTIVE</div>
        </div>
      </div>

      {/* CSS keyframes for gradient drift animations and responsive design */}
      <style jsx>{`
        @keyframes gradientDrift1 {
          0% { 
            transform: translateX(0) translateY(0) scale(1.4) rotate(0deg); 
          }
          25% { 
            transform: translateX(-3%) translateY(-4%) scale(1.45) rotate(1deg); 
          }
          50% { 
            transform: translateX(-6%) translateY(-2%) scale(1.5) rotate(0deg); 
          }
          75% { 
            transform: translateX(-3%) translateY(2%) scale(1.45) rotate(-1deg); 
          }
          100% { 
            transform: translateX(0) translateY(0) scale(1.4) rotate(0deg); 
          }
        }
        
        @keyframes gradientDrift2 {
          0% { 
            transform: translateX(0) translateY(0) scale(1.3) rotate(0deg); 
          }
          33% { 
            transform: translateX(4%) translateY(-3%) scale(1.4) rotate(-1deg); 
          }
          66% { 
            transform: translateX(2%) translateY(4%) scale(1.35) rotate(1deg); 
          }
          100% { 
            transform: translateX(0) translateY(0) scale(1.3) rotate(0deg); 
          }
        }
        
        @keyframes gradientPulse {
          0% { 
            transform: translateX(0) translateY(0) scale(1.2); 
            opacity: 0.7; 
          }
          50% { 
            transform: translateX(-2%) translateY(-3%) scale(1.35); 
            opacity: 0.9; 
          }
          100% { 
            transform: translateX(0) translateY(0) scale(1.2); 
            opacity: 0.7; 
          }
        }

        /* Responsive design for mobile devices */
        @media (max-width: 600px) {
          #glitch-bg {
            --chromatic-offset: 4px;
            --silhouette-opacity: 0.08;
          }
          
          .silhouette-mobile {
            width: 100vmin !important;
          }
        }

        /* Chromatic jitter animation effects */
        .chromatic-jitter {
          transition: filter 0.1s ease-out;
        }

        .chromatic-jitter.active {
          filter: blur(0.8px) hue-rotate(10deg) !important;
        }

        /* Glitch strip animations - horizontal movement and fade-out */
        @keyframes glitchStripMove {
          0% {
            transform: translateX(-100%) scaleX(0.8);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateX(-50%) scaleX(1.2);
          }
          30% {
            transform: translateX(20%) scaleX(0.9);
            opacity: 0.9;
          }
          60% {
            transform: translateX(80%) scaleX(1.1);
            opacity: 0.6;
          }
          90% {
            transform: translateX(120%) scaleX(0.7);
            opacity: 0.2;
          }
          100% {
            transform: translateX(150%) scaleX(0.5);
            opacity: 0;
          }
        }

        /* Glitch strip base styling with random effects */
        .glitch-strip {
          box-shadow: 
            0 0 10px rgba(255,45,149,0.3),
            0 0 20px rgba(110,255,246,0.2),
            inset 0 0 10px rgba(139,92,255,0.1);
          border-radius: 1px;
          will-change: transform, opacity;
        }

        /* Enhanced glitch strip effects for different intensities */
        .glitch-strip::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255,255,255,0.1) 50%, 
            transparent 100%);
          animation: glitchStripShimmer 200ms ease-in-out;
        }

        @keyframes glitchStripShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Particle floating animation */
        @keyframes particleFloat {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: var(--particle-opacity, 0.8);
          }
          25% {
            transform: translate(calc(var(--float-x) * 0.3), calc(var(--float-y) * 0.5)) scale(1.1);
            opacity: 1;
          }
          50% {
            transform: translate(var(--float-x), var(--float-y)) scale(0.9);
            opacity: var(--particle-opacity, 0.8);
          }
          75% {
            transform: translate(calc(var(--float-x) * 0.7), calc(var(--float-y) * 0.3)) scale(1.05);
            opacity: 0.9;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: var(--particle-opacity, 0.8);
          }
        }

        /* Particle base styling */
        .particle {
          will-change: transform, opacity;
          filter: blur(0.5px);
        }

        /* Mobile optimizations for better performance and battery life */
        @media (max-width: 768px) {
          #glitch-bg {
            --chromatic-offset: 3px;
            --silhouette-opacity: 0.06;
            --noise-opacity: 0.04;
            --scanline-opacity: 0.05;
          }
          
          .silhouette-mobile {
            width: 90vmin !important;
          }
          
          /* Reduce gradient complexity on mobile */
          .gradient-layer {
            filter: blur(40px) !important;
          }
          
          /* Simplify glitch strips on mobile */
          .glitch-strip {
            box-shadow: 0 0 5px rgba(255,45,149,0.2) !important;
          }
          
          /* Adjust HUD positioning for mobile */
          #glitch-bg .absolute.bottom-6.right-6 {
            bottom: 1rem;
            right: 1rem;
            font-size: 0.625rem;
          }
        }

        /* Extra small screens - further optimizations */
        @media (max-width: 480px) {
          #glitch-bg {
            --silhouette-opacity: 0.04;
            --noise-opacity: 0.03;
          }
          
          .gradient-layer {
            filter: blur(30px) !important;
            opacity: 0.6 !important;
          }
          
          .silhouette-mobile {
            width: 95vmin !important;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          #glitch-bg * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .chromatic-jitter {
            transition: none !important;
          }
          
          .glitch-strip {
            display: none !important;
          }
          
          .particle {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GlitchcoreBackground;