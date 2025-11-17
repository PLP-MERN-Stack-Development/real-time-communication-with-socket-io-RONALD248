export class TypingController {
  constructor(userManager) {
    this.userManager = userManager;
  }

  handleTypingStart(socket, room) {
    const user = this.userManager.getUserBySocketId(socket.id);
    if (user) {
      user.setTyping(room);
      socket.to(room).emit('user_typing', {
        user: { id: user.id, username: user.username },
        room
      });
    }
  }

  handleTypingStop(socket, room) {
    const user = this.userManager.getUserBySocketId(socket.id);
    if (user) {
      user.stopTyping();
      socket.to(room).emit('user_stop_typing', {
        user: { id: user.id, username: user.username },
        room
      });
    }
  }

  getTypingUsers(room) {
    return this.userManager.getUsersInRoom(room)
      .filter(user => user.typingInRoom === room)
      .map(user => ({ id: user.id, username: user.username }));
  }
}