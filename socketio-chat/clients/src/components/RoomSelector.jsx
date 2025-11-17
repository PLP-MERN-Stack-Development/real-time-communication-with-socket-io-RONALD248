import React from 'react';
import { useSocket } from '../context/SocketContext';
import './RoomSelector.css';

const RoomSelector = () => {
  const { currentRoom, rooms, joinRoom } = useSocket();

  return (
    <div className="room-selector">
      <h3>Chat Rooms</h3>
      <div className="rooms-list">
        {rooms.map(room => (
          <button
            key={room}
            className={`room-button ${currentRoom === room ? 'active' : ''}`}
            onClick={() => joinRoom(room)}
          >
            <span className="room-icon">#</span>
            <span className="room-name">{room}</span>
            {currentRoom === room && (
              <span className="active-indicator"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoomSelector;