import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../context/Authcontext';
import socketService from '../../services/socketService';
import Peer from 'simple-peer';
import './meeting.css';

const MeetingRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Refs
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const screenShareRef = useRef();

  // State
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isRoomLocked, setIsRoomLocked] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [userData, setUserData] = useState(null);

  // Initialize meeting
  useEffect(() => {
    if (!user || !roomId) {
      navigate('/dashboard');
      return;
    }

    initializeMeeting();
    return () => {
      cleanup();
    };
  }, [user, roomId]);

  const initializeMeeting = async () => {
    try {
      // Connect to socket
      const socket = socketService.connect(user._id);

      // Setup event listeners
      setupSocketListeners();

      // Initialize media
      await initializeMedia();

      // Join room
      socketService.joinRoom(roomId, {
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
        avatar: user.profilePicture
      });

    } catch (error) {
      console.error('Error initializing meeting:', error);
    }
  };

  const setupSocketListeners = () => {
    socketService.on('room-joined', (data) => {
      console.log('Room joined:', data);
      setIsConnected(true);
      setConnectionState('connected');
      setParticipants(data.participants);
      setMessages([]);
      setUserData(data.user);
    });

    socketService.on('user-joined', (data) => {
      console.log('User joined:', data);
      setParticipants(prev => [...prev, data]);
    });

    socketService.on('user-left', (data) => {
      console.log('User left:', data);
      setParticipants(prev => prev.filter(p => p.userId !== data.userId));
      setPeers(prev => {
        const newPeers = { ...prev };
        delete newPeers[data.userId];
        return newPeers;
      });
    });

    socketService.on('signal', (data) => {
      handleSignal(data);
    });

    socketService.on('chat-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketService.on('screen-sharing-started', (data) => {
      console.log('Screen sharing started:', data);
    });

    socketService.on('screen-sharing-stopped', (data) => {
      console.log('Screen sharing stopped:', data);
    });

    socketService.on('recording-started', (data) => {
      setIsRecording(true);
    });

    socketService.on('recording-stopped', (data) => {
      setIsRecording(false);
    });

    socketService.on('user-media-updated', (data) => {
      setParticipants(prev =>
        prev.map(p =>
          p.userId === data.userId
            ? { ...p, mediaState: data.mediaState }
            : p
        )
      );
    });

    socketService.on('error', (error) => {
      console.error('Meeting error:', error);
    });
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const handleSignal = (data) => {
    const { userId, signal } = data;

    if (!peers[userId]) {
      createPeer(userId, true, signal);
    } else {
      peers[userId].signal(signal);
    }
  };

  const createPeer = (userId, initiator = false, signal = null) => {
    const peer = new Peer({
      initiator,
      trickle: false,
      stream: localStream,
    });

    peer.on('signal', (data) => {
      socketService.sendSignal(userId, data);
    });

    peer.on('stream', (stream) => {
      if (remoteVideoRef.current && !isScreenSharing) {
        remoteVideoRef.current.srcObject = stream;
      }
    });

    peer.on('close', () => {
      setPeers(prev => {
        const newPeers = { ...prev };
        delete newPeers[userId];
        return newPeers;
      });
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
    });

    if (signal) {
      peer.signal(signal);
    }

    setPeers(prev => ({ ...prev, [userId]: peer }));
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      setScreenStream(stream);
      setIsScreenSharing(true);

      if (screenShareRef.current) {
        screenShareRef.current.srcObject = stream;
      }

      // Replace video track for all peers
      Object.values(peers).forEach(peer => {
        const videoTrack = stream.getVideoTracks()[0];
        const sender = peer._pc.getSenders().find(s => s.track && s.track.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      stream.getTracks().forEach(track => {
        track.onended = () => {
          stopScreenShare();
        };
      });

    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);

      // Restore camera stream
      if (localStream) {
        Object.values(peers).forEach(peer => {
          const videoTrack = localStream.getVideoTracks()[0];
          const sender = peer._pc.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
      }
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      socketService.sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const startRecording = () => {
    socketService.startRecording();
  };

  const stopRecording = () => {
    socketService.stopRecording();
  };

  const leaveRoom = () => {
    cleanup();
    navigate('/dashboard');
  };

  const cleanup = () => {
    // Stop all streams
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }

    // Close all peer connections
    Object.values(peers).forEach(peer => peer.destroy());

    // Disconnect socket
    socketService.disconnect();
  };

  return (
    <div className="meeting-room">
      <div className="meeting-header">
        <div className="room-info">
          <h2>Meeting Room: {roomId}</h2>
          <span className={`status ${connectionState}`}>
            {connectionState === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
          <span className="participant-count">
            {participants.length + 1} participants
          </span>
        </div>

        <div className="meeting-controls">
          <button
            className={`control-btn ${!isAudioEnabled ? 'muted' : ''}`}
            onClick={toggleAudio}
          >
            {isAudioEnabled ? '🎤' : '🚫'}
          </button>
          <button
            className={`control-btn ${!isVideoEnabled ? 'video-off' : ''}`}
            onClick={toggleVideo}
          >
            {isVideoEnabled ? '📹' : '🚫'}
          </button>
          <button
            className={`control-btn ${isScreenSharing ? 'active' : ''}`}
            onClick={isScreenSharing ? stopScreenShare : startScreenShare}
          >
            🖥️
          </button>
          <button
            className={`control-btn ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? '⏹️' : '⏺️'}
          </button>
          <button className="control-btn leave" onClick={leaveRoom}>
            📞 Leave
          </button>
        </div>
      </div>

      <div className="meeting-content">
        <div className="video-section">
          <div className="main-video">
            {isScreenSharing ? (
              <video
                ref={screenShareRef}
                autoPlay
                playsInline
                className="screen-share-video"
              />
            ) : (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="remote-video"
              />
            )}
          </div>

          <div className="local-video">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="local-preview"
            />
            <div className="local-controls">
              <span className="user-name">{userData?.name || 'You'}</span>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="participants-panel">
            <h3>Participants ({participants.length + 1})</h3>
            <div className="participant-list">
              <div className="participant-item">
                <div className="participant-video">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="participant-preview"
                  />
                </div>
                <span className="participant-name">
                  {userData?.name || 'You'} (You)
                </span>
              </div>
              {participants.map(participant => (
                <div key={participant.userId} className="participant-item">
                  <div className="participant-video">
                    <video
                      autoPlay
                      playsInline
                      className="participant-preview"
                    />
                  </div>
                  <span className="participant-name">
                    {participant.userData?.name || 'Participant'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="chat-panel">
            <h3>Chat</h3>
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div key={index} className="chat-message">
                  <span className="message-sender">
                    {message.sender?.name || 'Unknown'}:
                  </span>
                  <span className="message-content">{message.content}</span>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;
