import { v4 as uuidv4 } from 'uuid';

export class MessageController {
  constructor(userManager, messageManager) {
    this.userManager = userManager;
    this.messageManager = messageManager;
  }

  handleSendMessage(socket, data) {
    const { content, room, type = 'text' } = data;
    const user = this.userManager.getUserBySocketId(socket.id);
    
    if (!user || !content?.trim()) {
      return;
    }

    const message = this.messageManager.addMessage(room, {
      id: uuidv4(),
      content: content.trim(),
      sender: {
        id: user.id,
        username: user.username
      },
      room,
      type,
      timestamp: new Date().toISOString()
    });

    // Broadcast to room
    socket.to(room).emit('new_message', message);
    
    // Send delivery confirmation to sender
    socket.emit('message_delivered', {
      messageId: message.id,
      room,
      timestamp: new Date().toISOString()
    });

    console.log(`Message sent in ${room} by ${user.username}: ${content}`);
  }

  handleGetMessageHistory(socket, room) {
    const messages = this.messageManager.getRoomMessages(room);
    socket.emit('message_history', { room, messages });
  }
}