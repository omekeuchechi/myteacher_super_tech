import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './meetingRoom.css';

const apiBase = import.meta.env.VITE_BASEURL;

const MeetingRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([]);
  
  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef({});
  const socketRef = useRef(null);
  const peerConnections = useRef({});
  const localStream = useRef(null);
  const screenStream = useRef(null);
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(apiBase); // Update with your server URL
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      Object.values(peerConnections.current).forEach(pc => pc.close());
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Set up socket event handlers
  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    socket.on('existing-users', ({ users }) => {
      users.forEach(userId => {
        if (userId !== socket.id) {
          createPeerConnection(userId);
        }
      });
    });

    socket.on('user-joined', ({ userId }) => {
      createPeerConnection(userId);
      setParticipants(prev => [...prev, { id: userId }]);
    });

    socket.on('user-left', ({ userId }) => {
      if (peerConnections.current[userId]) {
        peerConnections.current[userId].close();
        delete peerConnections.current[userId];
      }
      setParticipants(prev => prev.filter(p => p.id !== userId));
    });

    socket.on('signal', async ({ signal, userId }) => {
      try {
        await peerConnections.current[userId].signal(signal);
      } catch (error) {
        console.error('Error handling signal:', error);
      }
    });

    return () => {
      socket.off('existing-users');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('signal');
    };
  }, []);

  const createPeerConnection = (userId) => {
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnections.current[userId] = peerConnection;

    // Add local stream to peer connection
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream.current);
      });
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        const remoteVideo = document.createElement('video');
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.autoplay = true;
        remoteVideo.playsInline = true;
        remoteVideosRef.current[userId] = remoteVideo;
        updateParticipants();
      }
    };

    

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('signal', {
          targetUserId: userId,
          signal: {
            candidate: event.candidate,
            type: 'candidate'
          }
        });
      }
    };

    // Create and send offer
    if (socketRef.current.id !== userId) {
      peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => {
          socketRef.current.emit('signal', {
            targetUserId: userId,
            signal: {
              sdp: peerConnection.localDescription,
              type: 'offer'
            }
          });
        })
        .catch(console.error);
    }
  };

  const updateParticipants = () => {
    setParticipants(prev => 
      prev.map(participant => ({
        ...participant,
        videoElement: remoteVideosRef.current[participant.id] || null
      }))
    );
  };

  const joinRoom = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoOn,
        audio: isAudioOn
      });
      
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      socketRef.current.emit('join', roomId);
      setIsJoined(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Could not access camera/microphone. Please check permissions.');
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        screenStream.current = stream;
        
        // Replace video track in all peer connections
        const videoTrack = stream.getVideoTracks()[0];
        Object.values(peerConnections.current).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track.kind === 'video');
          if (sender) sender.replaceTrack(videoTrack);
        });
        
        stream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };
        
        setIsScreenSharing(true);
      } else {
        // Switch back to camera
        if (localStream.current) {
          const videoTrack = localStream.current.getVideoTracks()[0];
          Object.values(peerConnections.current).forEach(pc => {
            const sender = pc.getSenders().find(s => s.track.kind === 'video');
            if (sender) sender.replaceTrack(videoTrack);
          });
          
          screenStream.current.getTracks().forEach(track => track.stop());
          screenStream.current = null;
          setIsScreenSharing(false);
        }
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const leaveRoom = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }
    
    if (screenStream.current) {
      screenStream.current.getTracks().forEach(track => track.stop());
      screenStream.current = null;
    }
    
    Object.values(peerConnections.current).forEach(pc => pc.close());
    peerConnections.current = {};
    remoteVideosRef.current = {};
    setParticipants([]);
    setIsJoined(false);
    
    if (socketRef.current) {
      socketRef.current.emit('leave-room', roomId);
    }
  };

  if (!isJoined) {
    return (
      <div className="join-meeting-container">
        <h1>Join Meeting</h1>
        <div className="join-form">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            className="room-input"
          />
          <button onClick={joinRoom} className="join-button">
            Join Meeting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="meeting-container">
      <div className="video-container">
        <div className="local-video">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="video-element"
          />
          <div className="video-label">You</div>
        </div>
        
        {participants.map((participant) => (
          <div key={participant.id} className="remote-video">
            {participant.videoElement && (
              <>
                {React.cloneElement(participant.videoElement, {
                  className: 'video-element',
                  ref: (el) => {
                    if (el && !el.srcObject && participant.videoElement.srcObject) {
                      el.srcObject = participant.videoElement.srcObject;
                    }
                  }
                })}
                <div className="video-label">Participant {participant.id.substring(0, 6)}</div>
              </>
            )}
          </div>
        ))}
      </div>
      
      <div className="meeting-controls">
        <button
          onClick={toggleAudio}
          className={`control-button ${!isAudioOn ? 'muted' : ''}`}
          title={isAudioOn ? 'Mute' : 'Unmute'}
        >
          {isAudioOn ? '🎤' : '🔇'}
        </button>
        
        <button
          onClick={toggleVideo}
          className={`control-button ${!isVideoOn ? 'muted' : ''}`}
          title={isVideoOn ? 'Stop Video' : 'Start Video'}
        >
          {isVideoOn ? '📹' : '📷❌'}
        </button>
        
        <button
          onClick={toggleScreenShare}
          className={`control-button ${isScreenSharing ? 'active' : ''}`}
          title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
        >
          {isScreenSharing ? '🖥️⏹️' : '🖥️'}
        </button>
        
        <button
          onClick={leaveRoom}
          className="control-button leave-button"
          title="Leave Meeting"
        >
          🚪 Leave
        </button>
      </div>
    </div>
  );
};

export default MeetingRoom;