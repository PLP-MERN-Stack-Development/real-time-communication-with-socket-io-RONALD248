import React from 'react';
import './MessageList.css';

const MessageList = ({ messages, currentUser }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const shouldShowDateSeparator = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.timestamp).toDateString();
    const previousDate = new Date(previousMessage.timestamp).toDateString();
    
    return currentDate !== previousDate;
  };

  return (
    <div className="message-list">
      {messages.map((message, index) => {
        const previousMessage = messages[index - 1];
        const showDateSeparator = shouldShowDateSeparator(message, previousMessage);
        const isOwnMessage = message.sender.id === currentUser?.userId;

        return (
          <React.Fragment key={message.id}>
            {showDateSeparator && (
              <div className="date-separator">
                {formatDate(message.timestamp)}
              </div>
            )}
            
            <div className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}>
              <div className="message-avatar">
                {message.sender.username.charAt(0).toUpperCase()}
              </div>
              
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">
                    {isOwnMessage ? 'You' : message.sender.username}
                  </span>
                  <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                
                <div className="message-text">
                  {message.content}
                </div>
                
                {message.delivered && (
                  <div className="message-status">
                    ✓ Delivered
                  </div>
                )}
              </div>
            </div>
          </React.Fragment>
        );
      })}
      
      {messages.length === 0 && (
        <div className="empty-messages">
          <div className="empty-icon">💬</div>
          <h3>No messages yet</h3>
          <p>Be the first to send a message in this room!</p>
        </div>
      )}
    </div>
  );
};

export default MessageList;