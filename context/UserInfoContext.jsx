import React, { createContext, useState, useEffect, useContext } from 'react';

import Pusher from 'pusher-js';
import { AuthContext } from './Authcontext'; // Make sure this path is correct

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

export const UserInfoContext = createContext();

export const UserInfoProvider = ({ children }) => {
    const { user, authLoading } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch initial user info
    useEffect(() => {
        const fetchUserInfo = async () => {
            // As requested, get the token directly from localStorage.
            const token = localStorage.getItem("token");

            // Wait until auth is complete and we have a token.
            if (authLoading || !token) {
                if (!authLoading) {
                    setLoading(false); // Not loading if auth is done but no token.
                }
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/user_info/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.status === 404) {
                    // User exists but has no profile info yet. This is not an error.
                    setUserInfo({}); 
                    setError(null);
                } else if (!response.ok) {
                    // Handle other HTTP errors
                    throw new Error(`Failed to fetch user info: ${response.statusText}`);
                } else {
                    // Success
                    const data = await response.json();
                    setUserInfo(data || {});
                    setError(null);
                }
            } catch (err) {
                console.error("Failed to fetch user info:", err);
                setError('Failed to load profile information.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [authLoading]);

    // Set up Pusher for real-time updates
    useEffect(() => {
        // Ensure we have the user ID before subscribing
        if (!user?._id) return;

        // IMPORTANT: Make sure these env variables are in your .env file
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
            useTLS: true
        });

        const channel = pusher.subscribe('user-info');

        const handleUpdate = (data) => {
            // Check if the update is for the currently logged-in user
            if (data.userId === user._id) {
                console.log('Pusher update received:', data);
                setUserInfo(prevInfo => ({ ...prevInfo, ...data.userInfo }));
            }
        };
        
        const handleStoryImageUpdate = (data) => {
             if (data.userId === user._id) {
                setUserInfo(prevInfo => ({ ...prevInfo, storyImage: data.url }));
            }
        };

        const handleStoryVideoUpdate = (data) => {
             if (data.userId === user._id) {
                setUserInfo(prevInfo => ({ ...prevInfo, storyVideo: data.url }));
            }
        };

        // Bind to events from your backend
        channel.bind('updated', handleUpdate);
        channel.bind('created', handleUpdate);
        channel.bind('storyImage', handleStoryImageUpdate);
        channel.bind('storyVideo', handleStoryVideoUpdate);

        // Cleanup on unmount
        return () => {
            channel.unbind_all();
            pusher.unsubscribe('user-info');
            pusher.disconnect();
        };
    }, [user?._id]); // Re-run if the user ID changes

    const value = {
        userInfo,
        loading,
        error,
    };

    return (
        <UserInfoContext.Provider value={value}>
            {children}
        </UserInfoContext.Provider>
    );
};

export default UserInfoProvider;
