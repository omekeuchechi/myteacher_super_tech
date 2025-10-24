import { useState, useEffect, useRef } from 'react';
import './card.css';

const Card = ({ 
    children, 
    className = '', 
    hoverEffect = 'elevate', 
    animationType = 'fadeIn',
    delay = 0,
    hoverBgColor = 'rgba(255, 255, 255, 0.1)',
    style = {},
    width = '100%',
    height = '100%',
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);

    // Add intersection observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, []);

    // Set initial visibility after a short delay if not using intersection observer
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            ref={cardRef}
            className={`card ${className} ${hoverEffect} ${isVisible ? `animate-${animationType}` : ''}`}
            style={{ 
                animationDelay: `${delay}ms`,
                opacity: isVisible ? 1 : 0,
                ...style,
                width,
                height
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Hover overlay */}
            <div 
                className="card-hover-overlay"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: width,
                    height: isHovered ? '100%' : '0%',
                    background: hoverBgColor,
                    transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 1,
                    pointerEvents: 'none'
                }}
            />
            
            {/* Card content */}
            <div 
                className="card-content"
                style={{ 
                    position: 'relative', 
                    zIndex: 2,
                    height: height
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default Card;