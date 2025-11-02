import { useRef, useCallback, useEffect } from "react";

export const useInfiniteScroll = (callback) => {
  const observer = useRef();
  const callbackRef = useRef(callback);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const lastElementRef = useCallback((node) => {
    
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callbackRef.current();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Trigger earlier
        threshold: 0.1,
      }
    );

    if (node) {
      observer.current.observe(node);
    }
  }, []); // Empty deps, uses callbackRef instead

  return lastElementRef;
};
