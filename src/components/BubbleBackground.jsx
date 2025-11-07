import { useState, useEffect } from 'react';

const PASTEL_COLORS = [
  'rgba(135, 206, 235, 0.6)', // Sky blue
  'rgba(221, 160, 221, 0.6)', // Plum/Lavender
  'rgba(152, 251, 152, 0.6)', // Mint green
  'rgba(255, 218, 185, 0.6)', // Peach
  'rgba(255, 182, 193, 0.6)', // Light pink
  'rgba(173, 216, 230, 0.6)'  // Light blue
];

const BubbleBackground = ({
  bubbleCount = 15,
  minSize = 20,
  maxSize = 80,
  animationDuration = { min: 15, max: 25 },
  className = ''
}) => {
  const [bubbles, setBubbles] = useState([]);

  // Generate random number within range
  const randomBetween = (min, max) => Math.random() * (max - min) + min;

  // Generate random color from pastel palette
  const getRandomColor = () => PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];

  // Generate initial bubbles
  useEffect(() => {
    // Generate bubble data
    const generateBubble = (id) => ({
      id,
      size: randomBetween(minSize, maxSize),
      x: randomBetween(0, 100), // Percentage for responsive positioning
      color: getRandomColor(),
      duration: randomBetween(animationDuration.min, animationDuration.max),
      delay: randomBetween(0, 5), // Stagger animation starts
      drift: randomBetween(-20, 20) // Horizontal drift amount
    });

    const initialBubbles = Array.from({ length: bubbleCount }, (_, i) => 
      generateBubble(`bubble-${i}`)
    );
    setBubbles(initialBubbles);
  }, [bubbleCount, minSize, maxSize, animationDuration]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`} style={{ zIndex: 5 }}>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.x}%`,
            backgroundColor: bubble.color,
            animation: `bubble-float ${bubble.duration}s ease-in-out infinite`,
            animationDelay: `${bubble.delay}s`,
            transform: 'translate3d(0, 100vh, 0)',
            '--drift': `${bubble.drift}px`
          }}
        />
      ))}
    </div>
  );
};

export default BubbleBackground;