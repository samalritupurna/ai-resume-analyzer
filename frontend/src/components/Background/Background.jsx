import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Background.css';

const Background = () => {
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    // Generate static/slow-moving starfield
    const generatedStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1, // 1px to 3px
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 100 + 100, // Very slow movement
    }));
    setStars(generatedStars);

    // Generate occasional shooting stars
    const generatedShootingStars = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 15, // Staggered start times
      duration: Math.random() * 2 + 2, // 2s to 4s swipe
      topOffset: Math.random() * 50, // Start somewhere in the top half
    }));
    setShootingStars(generatedShootingStars);
  }, []);

  return (
    <div className="premium-background">
      <div className="stars-container">
        {stars.map((star) => (
          <motion.div
            key={`star-${star.id}`}
            className="star"
            style={{
              width: star.size,
              height: star.size,
              left: `${star.x}vw`,
              top: `${star.y}vh`,
              opacity: star.opacity,
            }}
            animate={{
              y: ["0vh", "-100vh"],
              opacity: [star.opacity, star.opacity * 0.2, star.opacity],
            }}
            transition={{
              y: {
                duration: star.duration,
                repeat: Infinity,
                ease: "linear",
              },
              opacity: {
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            }}
          />
        ))}
      </div>

      <div className="shooting-stars-container">
        {shootingStars.map((ss) => (
          <motion.div
            key={`ss-${ss.id}`}
            className="shooting-star"
            style={{ top: `${ss.topOffset}vh`, right: '-10vw' }}
            animate={{
              x: ["0vw", "-120vw"],
              y: ["0vh", "120vh"],
            }}
            transition={{
              duration: ss.duration,
              repeat: Infinity,
              ease: "linear",
              delay: ss.delay,
              repeatDelay: Math.random() * 10 + 5, // Wait 5-15s before shooting again
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Background;
