import React, { useEffect } from 'react';

const AiChat = () => {
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

        return () => {
            const chatbaseScript = document.getElementById('Aqqmvco8hv-GG-y6Dw8ZE');
            if (chatbaseScript) {
                document.body.removeChild(chatbaseScript);
            }
        };
    }, []);

    return null; // Return null since we don't want to render anything
};

export default AiChat;