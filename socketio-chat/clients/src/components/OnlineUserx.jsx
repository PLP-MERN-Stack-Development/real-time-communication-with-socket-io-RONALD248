import React from 'react';
import './OnlineUsers.css';

const OnlineUsers = ({ users, title = 'Online Users' }) => {
  return (
    <div className="online-users">
      <h3>{title}</h3>
      <div className="users-list">
        {users.length === 0 ? (
          <div className="no-users">No users online</div>
        ) : (
          users.map(user => (
            <div key={user.id} className="user-item">
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="username">{user.username}</span>
                <div className="user-status online"></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;