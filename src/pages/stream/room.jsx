import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../context/Authcontext';
import './RoomLobby.css';

const RoomLobby = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [error, setError] = useState('');
  const [recentRooms, setRecentRooms] = useState([]);

  useEffect(() => {
    if (user) {
      const fullName = `${user.firstName} ${user.lastName}`;
      setUserName(fullName);
      // Load recent rooms from localStorage
      loadRecentRooms();
    }
  }, [user]);

  const loadRecentRooms = () => {
    try {
      const saved = localStorage.getItem('recentMeetingRooms');
      if (saved) {
        setRecentRooms(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading recent rooms:', error);
    }
  };

  const saveRecentRoom = (roomId, roomName) => {
    try {
      const newRoom = {
        id: roomId,
        name: roomName || `Meeting ${roomId}`,
        lastJoined: new Date().toISOString(),
        userId: user._id
      };

      const updated = [newRoom, ...recentRooms.filter(r => r.id !== roomId)].slice(0, 10);
      setRecentRooms(updated);
      localStorage.setItem('recentMeetingRooms', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent room:', error);
    }
  };

  const generateRoomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const createRoom = async () => {
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!roomName.trim()) {
      setError('Please enter a room name');
      return;
    }

    setIsCreatingRoom(true);
    setError('');

    try {
      const newRoomId = generateRoomId();
      saveRecentRoom(newRoomId, roomName);

      // Navigate to the meeting room
      navigate(`/meeting-room/${newRoomId}`, {
        state: {
          roomName,
          userName,
          isHost: true
        }
      });
    } catch (error) {
      setError('Failed to create room. Please try again.');
      console.error('Error creating room:', error);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const joinRoom = async () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsJoiningRoom(true);
    setError('');

    try {
      // Test connection to room
      const testConnection = await testRoomConnection(roomId);

      if (testConnection) {
        saveRecentRoom(roomId, `Room ${roomId}`);
        navigate(`/meeting-room/${roomId}`, {
          state: {
            userName,
            isHost: false
          }
        });
      } else {
        setError('Room not found or unavailable');
      }
    } catch (error) {
      setError('Failed to join room. Please check the room ID and try again.');
      console.error('Error joining room:', error);
    } finally {
      setIsJoiningRoom(false);
    }
  };

  const testRoomConnection = async (roomId) => {
    // This would typically check with the backend if the room exists
    // For now, we'll just validate the format
    return /^[A-Z0-9]{8}$/.test(roomId.toUpperCase());
  };

  const joinRecentRoom = (room) => {
    setRoomId(room.id);
    setUserName(userName || `${user.firstName} ${user.lastName}`);
    navigate(`/meeting-room/${room.id}`, {
      state: {
        userName: userName || `${user.firstName} ${user.lastName}`,
        isHost: false
      }
    });
  };

  const formatRoomId = (id) => {
    return id.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 8);
  };

  const handleRoomIdChange = (e) => {
    const formatted = formatRoomId(e.target.value);
    setRoomId(formatted);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="room-lobby">
      <div className="lobby-container">
        <div className="lobby-header">
          <h1>Video Meeting</h1>
          <p>Join or create a meeting room</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="lobby-content">
          <div className="join-room-section">
            <h2>Join a Meeting</h2>
            <div className="form-group">
              <label htmlFor="roomId">Room ID</label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={handleRoomIdChange}
                placeholder="Enter 8-character room ID"
                maxLength={8}
                className="room-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="userName">Your Name</label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your display name"
                className="room-input"
              />
            </div>

            <button
              onClick={joinRoom}
              disabled={isJoiningRoom || !roomId.trim() || !userName.trim()}
              className="primary-btn"
            >
              {isJoiningRoom ? 'Joining...' : 'Join Meeting'}
            </button>
          </div>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="create-room-section">
            <h2>Create a Meeting</h2>
            <div className="form-group">
              <label htmlFor="roomName">Room Name</label>
              <input
                type="text"
                id="roomName"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter meeting room name"
                className="room-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="createUserName">Your Name</label>
              <input
                type="text"
                id="createUserName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your display name"
                className="room-input"
              />
            </div>

            <button
              onClick={createRoom}
              disabled={isCreatingRoom || !roomName.trim() || !userName.trim()}
              className="primary-btn create-btn"
            >
              {isCreatingRoom ? 'Creating...' : 'Create Meeting'}
            </button>
          </div>
        </div>

        {recentRooms.length > 0 && (
          <div className="recent-rooms">
            <h3>Recent Meetings</h3>
            <div className="recent-rooms-list">
              {recentRooms.map((room) => (
                <div
                  key={room.id}
                  className="recent-room-item"
                  onClick={() => joinRecentRoom(room)}
                >
                  <div className="room-info">
                    <h4>{room.name}</h4>
                    <p>Room ID: {room.id}</p>
                    <small>
                      Last joined: {new Date(room.lastJoined).toLocaleDateString()}
                    </small>
                  </div>
                  <button className="join-recent-btn">Join</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="lobby-features">
          <div className="feature-item">
            <div className="feature-icon">🎥</div>
            <div className="feature-text">
              <h4>HD Video & Audio</h4>
              <p>Crystal clear video and audio quality</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🖥️</div>
            <div className="feature-text">
              <h4>Screen Sharing</h4>
              <p>Share your screen with participants</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">💬</div>
            <div className="feature-text">
              <h4>Real-time Chat</h4>
              <p>Chat with other participants instantly</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">📱</div>
            <div className="feature-text">
              <h4>Mobile Friendly</h4>
              <p>Works on all devices and screen sizes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomLobby;
