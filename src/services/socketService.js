import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(userId = null) {
    const serverUrl = import.meta.env.VITE_BASEURL || 'http://localhost:5000';

    this.socket = io(serverUrl, {
      auth: {
        userId: userId
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Connected to server:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Disconnected from server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Event listeners
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      this.listeners.set(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      this.listeners.delete(event);
    }
  }

  // Emit events
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  }

  // Room operations
  joinRoom(roomId, userData = {}) {
    this.emit('join', { room: roomId, userData });
  }

  leaveRoom() {
    this.emit('leave-room');
  }

  // WebRTC signaling
  sendSignal(targetUserId, signal) {
    this.emit('signal', { targetUserId, signal });
  }

  // Media controls
  toggleAudio() {
    this.emit('mute-audio');
  }

  toggleVideo() {
    this.emit('stop-video');
  }

  // Screen sharing
  startScreenShare(streamId, streamType = 'screen') {
    this.emit('start-screen-share', { streamId, streamType });
  }

  stopScreenShare() {
    this.emit('stop-screen-share');
  }

  // Chat
  sendMessage(message, type = 'text', metadata = {}) {
    this.emit('chat-message', {
      message,
      type,
      metadata,
      timestamp: new Date().toISOString()
    });
  }

  // Recording
  startRecording() {
    this.emit('start-recording');
  }

  stopRecording() {
    this.emit('stop-recording');
  }

  // Room settings
  updateRoomMetadata(metadata) {
    this.emit('update-room', metadata);
  }

  setRoomLock(locked) {
    this.emit('set-room-lock', { locked });
  }

  getRoomInfo() {
    return new Promise((resolve) => {
      this.emit('get-room-info', {}, (roomInfo) => {
        resolve(roomInfo);
      });
    });
  }
}

export default new SocketService();
