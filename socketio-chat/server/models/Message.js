export class Message {
  constructor(id, content, sender, room, type = 'text') {
    this.id = id;
    this.content = content;
    this.sender = {
      id: sender.id,
      username: sender.username
    };
    this.room = room;
    this.type = type;
    this.timestamp = new Date().toISOString();
    this.delivered = false;
    this.readBy = new Set();
    this.reactions = [];
  }

  markDelivered() {
    this.delivered = true;
  }

  markRead(userId) {
    this.readBy.add(userId);
  }

  addReaction(userId, reaction) {
    this.reactions.push({
      userId,
      reaction,
      timestamp: new Date().toISOString()
    });
  }
}

export class MessageManager {
  constructor() {
    this.messages = new Map(); // room -> messages array
    this.initializeDefaultRooms();
  }

  initializeDefaultRooms() {
    const defaultRooms = ['general', 'random', 'help'];
    defaultRooms.forEach(room => {
      this.messages.set(room, []);
    });
  }

  addMessage(room, message) {
    if (!this.messages.has(room)) {
      this.messages.set(room, []);
    }
    
    const roomMessages = this.messages.get(room);
    roomMessages.push(message);
    
    // Keep only the latest messages
    if (roomMessages.length > 100) {
      roomMessages.shift();
    }
    
    return message;
  }

  getRoomMessages(room, limit = 50) {
    const messages = this.messages.get(room) || [];
    return messages.slice(-limit);
  }

  getMessage(room, messageId) {
    const messages = this.messages.get(room) || [];
    return messages.find(msg => msg.id === messageId);
  }
}