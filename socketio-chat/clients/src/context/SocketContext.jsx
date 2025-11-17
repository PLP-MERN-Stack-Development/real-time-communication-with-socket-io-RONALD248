import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { socketClient } from '../socket/socketClient.js';

const SocketContext = createContext();

// Initial state
const initialState = {
  isConnected: false,
  user: null,
  onlineUsers: [],
  currentRoom: 'general',
  rooms: ['general', 'random', 'help', 'tech'],
  messages: new Map(), // room -> messages array
  typingUsers: new Map(), // room -> typing users array
  roomUsers: new Map(), // room -> users array
  error: null,
  loading: false
};

// Reducer function
function socketReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_CURRENT_ROOM':
      return { ...state, currentRoom: action.payload };
    
    case 'SET_ONLINE_USERS':
      return { ...state, onlineUsers: action.payload };
    
    case 'ADD_MESSAGE':
      const roomMessages = state.messages.get(action.payload.room) || [];
      const newMessages = new Map(state.messages);
      newMessages.set(action.payload.room, [...roomMessages, action.payload.message]);
      return { ...state, messages: newMessages };
    
    case 'SET_MESSAGES':
      const updatedMessages = new Map(state.messages);
      updatedMessages.set(action.payload.room, action.payload.messages);
      return { ...state, messages: updatedMessages };
    
    case 'ADD_TYPING_USER':
      const roomTypingUsers = state.typingUsers.get(action.payload.room) || [];
      const newTypingUsers = new Map(state.typingUsers);
      if (!roomTypingUsers.find(u => u.id === action.payload.user.id)) {
        newTypingUsers.set(action.payload.room, [...roomTypingUsers, action.payload.user]);
      }
      return { ...state, typingUsers: newTypingUsers };
    
    case 'REMOVE_TYPING_USER':
      const currentTypingUsers = state.typingUsers.get(action.payload.room) || [];
      const filteredTypingUsers = new Map(state.typingUsers);
      filteredTypingUsers.set(
        action.payload.room, 
        currentTypingUsers.filter(u => u.id !== action.payload.user.id)
      );
      return { ...state, typingUsers: filteredTypingUsers };
    
    case 'SET_ROOM_USERS':
      const newRoomUsers = new Map(state.roomUsers);
      newRoomUsers.set(action.payload.room, action.payload.users);
      return { ...state, roomUsers: newRoomUsers };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

export function SocketProvider({ children }) {
  const [state, dispatch] = useReducer(socketReducer, initialState);

  useEffect(() => {
    // Socket event listeners
    socketClient.on('connect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
    });

    socketClient.on('disconnect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: false });
    });

    socketClient.on('connect_error', (error) => {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    });

    socketClient.on('new_message', (message) => {
      dispatch({ type: 'ADD_MESSAGE', payload: { room: message.room, message } });
    });

    socketClient.on('message_history', ({ room, messages }) => {
      dispatch({ type: 'SET_MESSAGES', payload: { room, messages } });
    });

    socketClient.on('online_users', (users) => {
      dispatch({ type: 'SET_ONLINE_USERS', payload: users });
    });

    socketClient.on('user_online', (user) => {
      dispatch({ type: 'SET_ONLINE_USERS', payload: [...state.onlineUsers, user] });
    });

    socketClient.on('user_offline', (user) => {
      dispatch({ 
        type: 'SET_ONLINE_USERS', 
        payload: state.onlineUsers.filter(u => u.id !== user.id) 
      });
    });

    socketClient.on('user_typing', ({ user, room }) => {
      dispatch({ type: 'ADD_TYPING_USER', payload: { user, room } });
    });

    socketClient.on('user_stop_typing', ({ user, room }) => {
      dispatch({ type: 'REMOVE_TYPING_USER', payload: { user, room } });
    });

    socketClient.on('room_users', ({ room, users }) => {
      dispatch({ type: 'SET_ROOM_USERS', payload: { room, users } });
    });

    return () => {
      // Cleanup event listeners
      socketClient.disconnect();
    };
  }, []);

  const actions = {
    connect: (userData) => {
      dispatch({ type: 'SET_USER', payload: userData });
      socketClient.connect(userData);
    },

    disconnect: () => {
      socketClient.disconnect();
      dispatch({ type: 'SET_CONNECTED', payload: false });
    },

    sendMessage: (content, room = state.currentRoom) => {
      if (content.trim()) {
        socketClient.sendMessage({
          content: content.trim(),
          room,
          type: 'text'
        });
      }
    },

    joinRoom: (room) => {
      if (room !== state.currentRoom) {
        socketClient.joinRoom(room);
        dispatch({ type: 'SET_CURRENT_ROOM', payload: room });
        
        // Load message history for the room
        socketClient.getMessageHistory(room);
      }
    },

    leaveRoom: (room) => {
      socketClient.leaveRoom(room);
    },

    startTyping: (room = state.currentRoom) => {
      socketClient.startTyping(room);
    },

    stopTyping: (room = state.currentRoom) => {
      socketClient.stopTyping(room);
    },

    loadMessageHistory: (room) => {
      socketClient.getMessageHistory(room);
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};