import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import './LoginForm.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { connect, error } = useSocket();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      return;
    }

    setIsLoading(true);
    
    // Generate a simple user ID (in real app, this would come from backend)
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    connect({
      userId,
      username: username.trim()
    });
    
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>💬 Socket.io Chat</h1>
        <p>Join the real-time conversation</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Choose a username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username..."
              required
              minLength={2}
              maxLength={20}
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={!username.trim() || isLoading}
            className="login-button"
          >
            {isLoading ? 'Connecting...' : 'Join Chat'}
          </button>
        </form>
        
        <div className="login-features">
          <h3>Features:</h3>
          <ul>
            <li>Real-time messaging</li>
            <li>Multiple chat rooms</li>
            <li>Online user indicators</li>
            <li>Typing indicators</li>
            <li>Message history</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;