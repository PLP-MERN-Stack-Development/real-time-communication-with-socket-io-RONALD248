// Simple authentication middleware for Socket.io
export const authenticateSocket = (socket, next) => {
  try {
    const { userId, username } = socket.handshake.auth;
    
    if (!userId || !username) {
      return next(new Error('Authentication required'));
    }

    // Add user info to socket for later use
    socket.userId = userId;
    socket.username = username;
    
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

// Room authorization middleware
export const authorizeRoom = (room) => {
  return (socket, next) => {
    // In a real app, you might check if user has permission to join this room
    const allowedRooms = ['general', 'random', 'help', 'tech'];
    
    if (!allowedRooms.includes(room)) {
      return next(new Error('Room not allowed'));
    }
    
    next();
  };
};