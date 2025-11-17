import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventCallbacks = new Map();
  }

  connect(userData) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000', {
      auth: {
        userId: userData.userId,
        username: userData.username
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.emitEvent('connect');
      console.log('Connected to server');
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      this.emitEvent('disconnect', reason);
      console.log('Disconnected from server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      this.emitEvent('connect_error', error);
      console.error('Connection error:', error);
    });

    // Register all event handlers
    this.registerEvent('new_message');
    this.registerEvent('message_delivered');
    this.registerEvent('user_online');
    this.registerEvent('user_offline');
    this.registerEvent('online_users');
    this.registerEvent('user_typing');
    this.registerEvent('user_stop_typing');
    this.registerEvent('user_joined_room');
    this.registerEvent('user_left_room');
    this.registerEvent('room_users');
    this.registerEvent('message_history');
  }

  registerEvent(eventName) {
    this.socket.on(eventName, (data) => {
      this.emitEvent(eventName, data);
    });
  }

  on(event, callback) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event).push(callback);
  }

  off(event, callback) {
    if (this.eventCallbacks.has(event)) {
      const callbacks = this.eventCallbacks.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emitEvent(event, data) {
    if (this.eventCallbacks.has(event)) {
      this.eventCallbacks.get(event).forEach(callback => {
        callback(data);
      });
    }
  }

  // Message methods
  sendMessage(messageData) {
    this.socket.emit('send_message', messageData);
  }

  getMessageHistory(room) {
    this.socket.emit('get_message_history', room);
  }

  // Room methods
  joinRoom(room) {
    this.socket.emit('join_room', room);
  }

  leaveRoom(room) {
    this.socket.emit('leave_room', room);
  }

  // Typing methods
  startTyping(room) {
    this.socket.emit('typing_start', room);
  }

  stopTyping(room) {
    this.socket.emit('typing_stop', room);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket() {
    return this.socket;
  }
}

// Create and export a singleton instance
export const socketClient = new SocketClient();