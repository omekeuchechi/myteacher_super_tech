import { useEffect } from 'react';
import Nav from '../components/nav';
import MyteacherLogo from '../img/Untitled-1.png';
import CustomerSupportImage from '../assets/illustrations/MyteachercustomerSupprt.jpg';
import '../assets/styles/customerSupport.css'
import { Link } from 'react-router-dom';

const CustomerSupport = () => {
    useEffect(() => {
        // Initialize Chatbase widget
        (function(){
            if(!window.chatbase || window.chatbase("getState") !== "initialized") {
                window.chatbase = function() {
                    if(!window.chatbase.q) { window.chatbase.q = []; }
                    window.chatbase.q.push(arguments);
                };
                window.chatbase = new Proxy(window.chatbase, {
                    get(target, prop) {
                        if(prop === "q") { return target.q; }
                        return function() { return target(prop, ...arguments); };
                    }
                });
            }
            
            const onLoad = function() {
                const script = document.createElement("script");
                script.src = "https://www.chatbase.co/embed.min.js";
                script.id = "Aqqmvco8hv-GG-y6Dw8ZE";
                script.domain = "www.chatbase.co";
                document.body.appendChild(script);
            };
            
            if(document.readyState === "complete") {
                onLoad();
            } else {
                window.addEventListener("load", onLoad);
            }
        })();

        // Cleanup function to remove the script when component unmounts
        return () => {
            const chatbaseScript = document.getElementById('Aqqmvco8hv-GG-y6Dw8ZE');
            if (chatbaseScript) {
                document.body.removeChild(chatbaseScript);
            }
        };
    }, []);

    return (
        <div className="customer-support-container">
            <header className="chatAi-header">
                <Link to="/" className="logo" aria-label="Myteacher Home">
                    <img 
                        src={MyteacherLogo} 
                        alt="Myteacher Logo" 
                        width="50"
                        height="50"
                        className="logo-img"
                    />
                    <h1 className="logo-text">Myteacher</h1>
                </Link>
                <div className="chat-icon-header">
                    <i className='fas fa-comments chat-icon'></i>
                    <h2 className="chat-text">Chat with us</h2>
                </div>
            </header>
            
            <div className="support-hero">
                <div className="support-content">
                    <h2>How can we help you today?</h2>
                    <p>Our support team is available 24/7 to assist with any questions</p>
                    <p>Just click on the chat icon below to start a conversation</p>
                </div>
                <img 
                    src={CustomerSupportImage} 
                    alt="Friendly customer support team" 
                    className="customer-support-image"
                />
                {/* Chat widget will be injected here by Chatbase */}
            </div>
        </div>
    );
};

export default CustomerSupport;