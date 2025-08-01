import { useEffect, useRef, useState, createContext, useContext } from 'react';


// Global scroll context for scroll position, progress, and velocity
export const ScrollContext = createContext({
  scrollY: 0,
  progress: 0,
  velocity: 0,
  scrollStarted: false,
});

export function ScrollProvider({ children, scrollContainerRef }) {
  const [scrollY, setScrollY] = useState(0);
  const [progress, setProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [scrollStarted, setScrollStarted] = useState(false);
  const lastScroll = useRef(0);
  const lastTime = useRef(performance.now());
  const scrollTimeout = useRef();

  useEffect(() => {
    const container = scrollContainerRef?.current || window;
    const handleScroll = () => {
      const now = performance.now();
      let newScroll, docHeight;
      if (scrollContainerRef?.current) {
        newScroll = scrollContainerRef.current.scrollTop;
        docHeight = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;
      } else {
        newScroll = window.scrollY;
        docHeight = document.documentElement.scrollHeight - window.innerHeight;
      }
      const delta = newScroll - lastScroll.current;
      const dt = now - lastTime.current;
      const v = dt > 0 ? delta / dt : 0;
      setScrollY(newScroll);
      setVelocity(v);
      lastScroll.current = newScroll;
      lastTime.current = now;
      setProgress(docHeight > 0 ? newScroll / docHeight : 0);
      setScrollStarted(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setScrollStarted(false), 200);
    };
    container.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [scrollContainerRef]);

  return (
    <ScrollContext.Provider value={{ scrollY, progress, velocity, scrollStarted }}>
      {children}
    </ScrollContext.Provider>
  );
}

// Hook to use global scroll context
export function useGlobalScroll() {
  return useContext(ScrollContext);
}

// Deprecated: useGlobalScroll instead for global scroll state
export function useScrollTracking() {
  // No-op for backward compatibility
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
