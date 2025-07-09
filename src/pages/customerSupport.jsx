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
        <>
        <div className="chatAi-header">
            <Link className="logo">
            <img src={MyteacherLogo} alt="myteacher Logo" />
            <h1>Myteacher</h1>
            </Link>
            <div className="chat-icon-header">
                <i className='fas fa-comments'></i>
            <h1>Chat with us</h1>
            </div>
        </div>
        <div style={{ minHeight: '80vh', }}>
            <img src={CustomerSupportImage} alt="myteacher customer support" className='customer-support-image-background' />
            {/* The chat widget will be injected here by the Chatbase script */}
        </div>
        </>
    );
};

export default CustomerSupport;