import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useTypingIndicator } from '../hooks/useTypingIndicator';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import OnlineUsers from './OnlineUsers';
import RoomSelector from './RoomSelector';
import TypingIndicator from './TypingIndicator';
import './ChatRoom.css';

const ChatRoom = () => {
  const {
    currentRoom,
    messages,
    typingUsers,
    roomUsers,
    user,
    isConnected,
    joinRoom,
    startTyping,
    stopTyping
  } = useSocket();

  const [inputValue, setInputValue] = useState('');
  
  const { startTyping: startTypingIndicator, stopTyping: stopTypingIndicator } = useTypingIndicator(
    () => startTyping(currentRoom),
    () => stopTyping(currentRoom),
    1000
  );

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.get(currentRoom)]);

  const handleSendMessage = (content) => {
    if (content.trim() && isConnected) {
      // This will be handled by the context
      setInputValue('');
      stopTypingIndicator();
    }
  };

  const handleInputChange = (value) => {
    setInputValue(value);
    if (value.trim()) {
      startTypingIndicator();
    } else {
      stopTypingIndicator();
    }
  };

  const currentMessages = messages.get(currentRoom) || [];
  const currentTypingUsers = typingUsers.get(currentRoom) || [];
  const currentRoomUsers = roomUsers.get(currentRoom) || [];

  return (
    <div className="chat-room">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h2>💬 Chat App</h2>
          <div className="user-info">
            <span className="username">{user?.username}</span>
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢 Online' : '🔴 Offline'}
            </div>
          </div>
        </div>

        <RoomSelector />
        <OnlineUsers 
          users={currentRoomUsers} 
          title={`Room Users (${currentRoomUsers.length})`}
        />
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <h3># {currentRoom}</h3>
          <div className="room-info">
            <span>{currentRoomUsers.length} users in room</span>
          </div>
        </div>

        <div className="chat-messages">
          <MessageList messages={currentMessages} currentUser={user} />
          <TypingIndicator users={currentTypingUsers} />
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <MessageInput
            value={inputValue}
            onChange={handleInputChange}
            onSendMessage={handleSendMessage}
            disabled={!isConnected}
            placeholder={isConnected ? `Message #${currentRoom}...` : 'Connecting...'}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;