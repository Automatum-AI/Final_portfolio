import { useEffect, useRef, useState } from 'react';

export const scrollProgressRef = { current: 0 };

export function useScrollTracking() {
  useEffect(() => {
    const handleScroll = () => {
      scrollProgressRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

// Hook to animate section on scroll (IntersectionObserver)
export function useScrollAnimation(threshold = 0.18) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold, isVisible]);

  return [ref, isVisible];
}
