import React from 'react';
import './TypingIndicator.css';

const TypingIndicator = ({ users }) => {
  if (users.length === 0) return null;

  const usernames = users.map(user => user.username).join(', ');
  const isMultiple = users.length > 1;

  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="typing-text">
        {usernames} {isMultiple ? 'are' : 'is'} typing...
      </span>
    </div>
  );
};

export default TypingIndicator;