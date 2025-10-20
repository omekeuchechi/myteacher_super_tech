import { useState, useContext, useEffect } from 'react';
import SideNav from '../../components/instructorCom/sideNav';
import MainFrame from '../../components/instructorCom/mainFrame';
import Card from '../../components/instructorCom/card';
import { AuthContext } from '../../../context/Authcontext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Pusher from 'pusher-js';
import './dash.css';

const API_BASE = import.meta.env.VITE_BASEURL;

const InstructorDashboard = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [counts, setCounts] = useState({
        lectures: 0,
        assets: 0,
        videos: 0,
        loading: true
    });
    const { user } = useContext(AuthContext);

    useEffect(() => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.error('No authentication token found');
            toast.error('Authentication required. Please log in again.');
            return;
        }

        const fetchCounts = async () => {
            try {
                const [lecturesRes, assetsRes, videosRes] = await Promise.all([
                    axios.get(`${API_BASE}/instructor/lectures/count`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${API_BASE}/instructor/assets/count`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${API_BASE}/instructor/videos/count`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setCounts({
                    lectures: lecturesRes.data.count,
                    assets: assetsRes.data.count,
                    videos: videosRes.data.count,
                    loading: false
                });
            } catch (error) {
                console.error('Error fetching counts:', error);
                toast.error('Failed to load dashboard data');
                setCounts(prev => ({ ...prev, loading: false }));
            }
        };

        // Initialize Pusher
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
            encrypted: true
        });

        // Subscribe to instructor's channel
        const channel = pusher.subscribe(`instructor-${user?.id}`);

        // Listen for count updates
        channel.bind('all-counts-updated', (data) => {
            setCounts(prev => ({
                ...prev,
                lectures: data.lecturesCount,
                assets: data.assetsCount,
                videos: data.videosCount
            }));
        });

        // Initial fetch
        fetchCounts();

        // Cleanup function
        return () => {
            if (channel) {
                channel.unbind_all();
                pusher.unsubscribe(`instructor-${user?.id}`);
            }
        };
    }, [user?.id]);

    return (
        <div className="instructor-container">
            <SideNav
                isMobileMenuOpen={isMobileMenuOpen}
                onMenuToggle={setIsMobileMenuOpen}
            />
            <MainFrame isMobileMenuOpen={isMobileMenuOpen}>
                <div className="container">
                    <h1 className="welcomeText">Welcome back {user.name}</h1>
                    <div className="cardsContainer">
                        <Card
                            className="card fadeIn"
                            hoverBgColor='rgba(255, 255, 255, 0.1)'
                            hoverEffect="elevate"
                            animationType="fadeIn"
                            delay={100}
                        >
                            <i className='fas fa-book'></i>
                            <h3>Amount of Lectures</h3>
                            <p>{counts.loading ? 'Loading...' : counts.lectures}</p>
                        </Card>
                        <Card
                            className="card fadeIn"
                            hoverBgColor='rgba(255, 255, 255, 0.1)'
                            hoverEffect="elevate"
                            animationType="fadeIn"
                            delay={100}
                        >
                            <i className='fas fa-file'></i>
                            <h3>Assets Uploaded</h3>
                            <p>{counts.loading ? 'Loading...' : counts.assets}</p>
                        </Card>
                        <Card
                            className="card fadeIn"
                            hoverBgColor='rgba(255, 255, 255, 0.1)'
                            hoverEffect="elevate"
                            animationType="fadeIn"
                            delay={100}
                        >
                            <i className='fas fa-video'></i>
                            <h3>Videos Uploaded</h3>
                            <p>{counts.loading ? 'Loading...' : counts.videos}</p>
                        </Card>
                    </div>
                </div>
            </MainFrame>
        </div>
    );
};

export default InstructorDashboard;