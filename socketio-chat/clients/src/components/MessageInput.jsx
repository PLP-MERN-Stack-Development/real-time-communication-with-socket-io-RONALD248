import React from 'react';
import './MessageInput.css';

const MessageInput = ({ value, onChange, onSendMessage, disabled, placeholder }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSendMessage(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <div className="input-container">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="message-input"
          maxLength={500}
        />
        
        <button 
          type="submit" 
          disabled={!value.trim() || disabled}
          className="send-button"
          title="Send message"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
      
      <div className="input-hint">
        Press Enter to send • Shift + Enter for new line
      </div>
    </form>
  );
};

export default MessageInput;