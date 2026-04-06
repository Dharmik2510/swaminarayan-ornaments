'use client';

import { useState, useEffect } from 'react';

export function useTimeBasedTheme() {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('night');
  const [goldHue, setGoldHue] = useState(43); // Default gold hue
  const [glowIntensity, setGlowIntensity] = useState(0.3);

  useEffect(() => {
    const updateTimeTheme = () => {
      const hour = new Date().getHours();
      
      if (hour >= 6 && hour < 12) {
        setTimeOfDay('morning');
        setGoldHue(45); // Warmer, brighter gold
        setGlowIntensity(0.25);
      } else if (hour >= 12 && hour < 17) {
        setTimeOfDay('afternoon');
        setGoldHue(43); // Standard gold
        setGlowIntensity(0.3);
      } else if (hour >= 17 && hour < 21) {
        setTimeOfDay('evening');
        setGoldHue(40); // Warm sunset gold
        setGlowIntensity(0.35);
      } else {
        setTimeOfDay('night');
        setGoldHue(38); // Deep, warm gold
        setGlowIntensity(0.4);
      }
    };

    updateTimeTheme();
    const interval = setInterval(updateTimeTheme, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return { timeOfDay, goldHue, glowIntensity };
}
