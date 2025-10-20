import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import './mainFrame.css';

// In MainFrame.jsx
const MainFrame = ({ 
    children, 
    padding = "2rem", 
    backgroundColor = "#f8f9fa", 
    width = "100%", 
    height = "100%", 
    overflow = "auto",
    isMobileMenuOpen = false,
    className = ""
}) => {
    const mainFrameRef = useRef(null);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1024);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const mobileView = window.innerWidth <= 1024;
            setIsMobileView(mobileView);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate main content styles
    const mainFrameStyles = {
        padding,
        backgroundColor,
        width,
        height,
        overflow,
        minHeight: '100vh',
        transition: 'all 0.3s ease',
    };

    // Adjust styles based on mobile view and menu state
    if (isMobileView) {
        mainFrameStyles.padding = '1rem';
        mainFrameStyles.paddingTop = '5rem';
    }

    return (
        <div 
            className={`instructor-main-frame ${isMobileMenuOpen ? 'menu-open' : ''} ${isMobileView ? 'mobile-view' : ''} ${className}`}
            ref={mainFrameRef}
            style={mainFrameStyles}
        >
            {children}
        </div>
    );
};

export default MainFrame;