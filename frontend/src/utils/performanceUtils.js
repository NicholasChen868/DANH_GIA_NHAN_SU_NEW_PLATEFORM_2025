/**
 * Performance Utilities for Large Employee Dataset
 * Handles virtual scrolling, lazy loading, and optimization
 */

import { useMemo, useCallback, useRef, useEffect, useState } from 'react';

// Debounce hook for search optimization
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Virtual scrolling hook for large lists
export const useVirtualScrolling = (items, containerHeight = 400, itemHeight = 200) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState(null);

  const visibleItems = useMemo(() => {
    if (!items.length) return { startIndex: 0, endIndex: 0, visibleItems: [] };

    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    const visibleItems = items.slice(startIndex, endIndex);

    return {
      startIndex,
      endIndex,
      visibleItems,
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    };
  }, [items, scrollTop, containerHeight, itemHeight]);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return {
    ...visibleItems,
    containerRef,
    setContainerRef,
    handleScroll
  };
};

// Memoized filter function for employee data
export const useEmployeeFilter = (employees, filters) => {
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);
  
  return useMemo(() => {
    if (!employees.length) return [];

    return employees.filter(employee => {
      // Search query filter (debounced)
      if (debouncedSearchQuery.trim()) {
        const query = debouncedSearchQuery.toLowerCase().trim();
        const searchFields = [
          employee.name,
          employee.email,
          employee.position,
          employee.department,
          employee.id
        ].map(field => field?.toLowerCase() || '');
        
        if (!searchFields.some(field => field.includes(query))) {
          return false;
        }
      }

      // Department filter
      if (filters.department !== 'all' && employee.department !== filters.department) {
        return false;
      }

      // Business Unit filter
      if (filters.businessUnit !== 'all' && employee.buName !== filters.businessUnit) {
        return false;
      }

      // Level filter
      if (filters.level !== 'all' && employee.level !== filters.level) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && employee.status !== filters.status) {
        return false;
      }

      // Form status filter
      if (filters.formStatus !== 'all') {
        const completedCount = employee.completedForms || 0;
        switch (filters.formStatus) {
          case 'completed':
            if (completedCount !== 3) return false;
            break;
          case 'partial':
            if (completedCount === 0 || completedCount === 3) return false;
            break;
          case 'incomplete':
            if (completedCount !== 0) return false;
            break;
        }
      }

      return employee.canBeEvaluated !== false;
    });
  }, [employees, debouncedSearchQuery, filters]);
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (callback, options = {}) => {
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback, options]);

  return setRef;
};

// Image lazy loading hook
export const useLazyImage = (src, placeholder = null) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const imgRef = useIntersectionObserver(
    useCallback((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && src) {
          const img = new Image();
          img.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
          };
          img.onerror = () => {
            setIsError(true);
          };
          img.src = src;
        }
      });
    }, [src])
  );

  return { imageSrc, isLoaded, isError, imgRef };
};

// Chunk processing for large datasets
export const processInChunks = (array, chunkSize = 50, callback) => {
  let index = 0;
  
  const processChunk = () => {
    const chunk = array.slice(index, index + chunkSize);
    if (chunk.length > 0) {
      callback(chunk, index);
      index += chunkSize;
      
      // Use requestAnimationFrame to avoid blocking the main thread
      requestAnimationFrame(() => {
        if (index < array.length) {
          processChunk();
        }
      });
    }
  };
  
  processChunk();
};

// Memory optimization utilities
export const memoizeWithLimit = (fn, limit = 100) => {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      // Move to end (LRU)
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }
    
    const result = fn(...args);
    
    // Remove oldest if limit reached
    if (cache.size >= limit) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, result);
    return result;
  };
};

// Performance monitoring
export const usePerformanceMonitor = (componentName) => {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const endTime = Date.now();
    const renderTime = endTime - startTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} - Render #${renderCount.current}, Time: ${renderTime}ms`);
    }
    
    startTime.current = endTime;
  });

  return renderCount.current;
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Check if browser supports modern features
export const browserSupport = {
  intersectionObserver: 'IntersectionObserver' in window,
  requestIdleCallback: 'requestIdleCallback' in window,
  webWorker: typeof Worker !== 'undefined',
  localStorage: (() => {
    try {
      return typeof Storage !== 'undefined';
    } catch (e) {
      return false;
    }
  })()
};

// Local storage with size limit management
export const managedLocalStorage = {
  setItem: (key, value, maxSize = 5 * 1024 * 1024) => { // 5MB default
    try {
      const serialized = JSON.stringify(value);
      
      // Check size
      if (serialized.length > maxSize) {
        console.warn(`Data too large for localStorage: ${key}`);
        return false;
      }
      
      localStorage.setItem(key, serialized);
      return true;
    } catch (e) {
      console.error('localStorage setItem error:', e);
      return false;
    }
  },
  
  getItem: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('localStorage getItem error:', e);
      return null;
    }
  },
  
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('localStorage removeItem error:', e);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('localStorage clear error:', e);
      return false;
    }
  }
};

// Export all utilities
export default {
  useDebounce,
  useVirtualScrolling,
  useEmployeeFilter,
  useIntersectionObserver,
  useLazyImage,
  usePerformanceMonitor,
  processInChunks,
  memoizeWithLimit,
  throttle,
  browserSupport,
  managedLocalStorage
};