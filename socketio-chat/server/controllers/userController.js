export class UserController {
  constructor(userManager) {
    this.userManager = userManager;
  }

  handleUserJoin(socket, userData) {
    const { userId, username } = userData;
    const user = this.userManager.addUser(userId, username, socket.id);
    
    // Join default rooms
    user.rooms.forEach(room => {
      socket.join(room);
    });

    // Notify about new user
    socket.broadcast.emit('user_online', {
      id: user.id,
      username: user.username
    });

    // Send current online users to the new user
    const onlineUsers = this.userManager.getOnlineUsers()
      .filter(u => u.id !== user.id)
      .map(u => ({ id: u.id, username: u.username }));
    
    socket.emit('online_users', onlineUsers);

    console.log(`User joined: ${username} (${userId})`);
  }

  handleUserLeave(socket) {
    const user = this.userManager.getUserBySocketId(socket.id);
    if (user) {
      this.userManager.removeUser(user.id);
      
      // Notify other users
      socket.broadcast.emit('user_offline', {
        id: user.id,
        username: user.username
      });

      console.log(`User left: ${user.username} (${user.id})`);
    }
  }

  handleJoinRoom(socket, room) {
    const user = this.userManager.getUserBySocketId(socket.id);
    if (user && !user.rooms.has(room)) {
      user.joinRoom(room);
      socket.join(room);
      
      // Notify room
      socket.to(room).emit('user_joined_room', {
        user: { id: user.id, username: user.username },
        room
      });

      // Send room users list
      const roomUsers = this.userManager.getUsersInRoom(room)
        .map(u => ({ id: u.id, username: u.username }));
      
      socket.emit('room_users', { room, users: roomUsers });

      console.log(`User ${user.username} joined room: ${room}`);
    }
  }

  handleLeaveRoom(socket, room) {
    const user = this.userManager.getUserBySocketId(socket.id);
    if (user && user.rooms.has(room)) {
      user.leaveRoom(room);
      socket.leave(room);
      
      // Notify room
      socket.to(room).emit('user_left_room', {
        user: { id: user.id, username: user.username },
        room
      });

      console.log(`User ${user.username} left room: ${room}`);
    }
  }
}