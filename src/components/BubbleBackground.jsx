import { useState, useEffect, useCallback, useMemo } from 'react';

const PASTEL_COLORS = [
  'rgba(135, 206, 235, 0.6)', // Sky blue
  'rgba(221, 160, 221, 0.6)', // Plum/Lavender
  'rgba(152, 251, 152, 0.6)', // Mint green
  'rgba(255, 218, 185, 0.6)', // Peach
  'rgba(255, 182, 193, 0.6)', // Light pink
  'rgba(173, 216, 230, 0.6)'  // Light blue
];

// Performance constants
const MAX_BUBBLES = 20;
const MIN_BUBBLES = 5;
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

// Device detection utilities
const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;
const isTablet = () => window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT;
const isLowEndDevice = () => {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  
  // Check for low-end device indicators
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) return true;
  
  // Check device memory (if available)
  if (navigator.deviceMemory && navigator.deviceMemory < 4) return true;
  
  return false;
};

const BubbleBackground = ({
  bubbleCount = 15,
  minSize = 20,
  maxSize = 80,
  animationDuration = { min: 15, max: 25 },
  className = ''
}) => {
  const [bubbles, setBubbles] = useState([]);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate random number within range
  const randomBetween = useCallback((min, max) => Math.random() * (max - min) + min, []);

  // Generate random color from pastel palette
  const getRandomColor = useCallback(() => PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)], []);

  // Responsive configuration based on device type and screen size
  const config = useMemo(() => {
    const mobile = isMobile();
    const tablet = isTablet();
    const lowEnd = isLowEndDevice();
    
    // Adjust bubble count based on device capabilities
    let adjustedBubbleCount = bubbleCount;
    if (lowEnd) {
      adjustedBubbleCount = Math.min(MIN_BUBBLES, bubbleCount);
    } else if (mobile) {
      adjustedBubbleCount = Math.min(Math.floor(bubbleCount * 0.6), bubbleCount);
    } else if (tablet) {
      adjustedBubbleCount = Math.min(Math.floor(bubbleCount * 0.8), bubbleCount);
    }
    
    // Enforce maximum bubble limit
    adjustedBubbleCount = Math.min(adjustedBubbleCount, MAX_BUBBLES);
    
    // Adjust bubble sizes for different screen sizes
    let adjustedMinSize = minSize;
    let adjustedMaxSize = maxSize;
    
    if (mobile) {
      adjustedMinSize = Math.max(minSize * 0.7, 15);
      adjustedMaxSize = Math.min(maxSize * 0.7, 60);
    } else if (tablet) {
      adjustedMinSize = Math.max(minSize * 0.85, 18);
      adjustedMaxSize = Math.min(maxSize * 0.85, 70);
    }
    
    // Adjust animation duration for performance
    let adjustedDuration = { ...animationDuration };
    if (lowEnd) {
      adjustedDuration = { min: animationDuration.min * 1.5, max: animationDuration.max * 1.5 };
    } else if (mobile) {
      adjustedDuration = { min: animationDuration.min * 1.2, max: animationDuration.max * 1.2 };
    }
    
    return {
      bubbleCount: adjustedBubbleCount,
      minSize: adjustedMinSize,
      maxSize: adjustedMaxSize,
      animationDuration: adjustedDuration,
      reducedMotion: lowEnd
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bubbleCount, minSize, maxSize, animationDuration, windowSize]);

  // Handle window resize with throttling
  useEffect(() => {
    let timeoutId;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }, 150); // Throttle resize events
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Generate bubble with responsive configuration
  const generateBubble = useCallback((id) => {
    const mobile = isMobile();
    const maxDrift = mobile ? 10 : 20; // Reduce drift on mobile for better performance
    
    return {
      id,
      size: randomBetween(config.minSize, config.maxSize),
      x: randomBetween(5, 95), // Keep bubbles away from edges
      color: getRandomColor(),
      duration: randomBetween(config.animationDuration.min, config.animationDuration.max),
      delay: randomBetween(0, config.reducedMotion ? 5 : 10), // Reduce stagger on low-end devices
      drift: randomBetween(-maxDrift, maxDrift)
    };
  }, [config, randomBetween, getRandomColor]);

  // Generate initial bubbles and update when bubble count changes
  useEffect(() => {
    // Initialize or update bubbles when count changes
    if (!isInitialized || bubbles.length !== config.bubbleCount) {
      const newBubbles = Array.from({ length: config.bubbleCount }, (_, i) => 
        generateBubble(`bubble-${Date.now()}-${i}`)
      );
      console.log('BubbleBackground: Initializing bubbles', newBubbles.length);
      setBubbles(newBubbles);
      if (!isInitialized) {
        setIsInitialized(true);
      }
    }

    // Only cleanup on component unmount, not on config changes
    return () => {
      // Only clear bubbles if component is actually unmounting
      // This prevents clearing bubbles on theme changes
    };
  }, [config.bubbleCount, generateBubble, isInitialized, bubbles.length]);

  // Performance monitoring and cleanup - but don't kill bubbles during theme changes
  useEffect(() => {
    let animationFrameId;
    let performanceCheckInterval;

    // Monitor performance on low-end devices, but only reduce bubbles if really necessary
    // and not during theme transitions
    if (config.reducedMotion && isInitialized) {
      performanceCheckInterval = setInterval(() => {
        // Only reduce bubbles if performance is really bad and we have more than minimum
        const currentTime = performance.now();
        if (currentTime % 1000 < 16) { // Rough FPS check
          setBubbles(prev => {
            if (prev.length > MIN_BUBBLES) {
              return prev.slice(0, Math.max(MIN_BUBBLES, prev.length - 1));
            }
            return prev; // Don't reduce further
          });
        }
      }, 5000); // Performance monitoring interval
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (performanceCheckInterval) {
        clearInterval(performanceCheckInterval);
      }
    };
  }, [config.reducedMotion, isInitialized]);

  // Memoize bubble rendering for performance
  const bubbleElements = useMemo(() => {
    return bubbles.map((bubble) => {
      const animationName = config.reducedMotion ? 'bubble-float-simple' : 'bubble-float';
      
      return (
        <div
          key={bubble.id}
          className="absolute rounded-full will-change-transform"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.x}%`,
            backgroundColor: bubble.color,
            animation: `${animationName} ${bubble.duration}s ease-in-out infinite`,
            animationDelay: `${bubble.delay}s`,
            transform: 'translate3d(0, 100vh, 0)',
            '--drift': `${bubble.drift}px`,
            // Performance optimizations
            backfaceVisibility: 'hidden',
            perspective: '1000px'
          }}
        />
      );
    });
  }, [bubbles, config.reducedMotion]);

  return (
    <div 
      role="presentation"
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`} 
      style={{ 
        zIndex: 5,
        // Performance hint for the browser
        contain: 'layout style paint',
        // Ensure bubbles are always rendered, just hidden with opacity
        visibility: 'visible'
      }}
    >
      {bubbleElements}
    </div>
  );
};

export default BubbleBackground;