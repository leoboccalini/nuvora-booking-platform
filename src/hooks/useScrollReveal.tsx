import { useEffect, useRef, useState } from 'react';
interface UseScrollRevealOptions {
    threshold?: number;
    rootMargin?: string;
    delay?: number;
}
export const useScrollReveal = (options: UseScrollRevealOptions = {}) => {
    const { threshold = 0.1, rootMargin = '0px', delay = 0 } = options;
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    setIsVisible(true);
                }, delay);
            }
        }, {
            threshold,
            rootMargin,
        });
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold, rootMargin, delay]);
    return { ref, isVisible };
};
export const useScrollRevealMultiple = (count: number, staggerDelay: number = 100) => {
    const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(count).fill(false));
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                for (let i = 0; i < count; i++) {
                    setTimeout(() => {
                        setVisibleItems(prev => {
                            const newState = [...prev];
                            newState[i] = true;
                            return newState;
                        });
                    }, i * staggerDelay);
                }
            }
        }, {
            threshold: 0.1,
            rootMargin: '0px',
        });
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [count, staggerDelay]);
    return { ref, visibleItems };
};
