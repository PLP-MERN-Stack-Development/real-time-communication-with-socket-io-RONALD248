// In-memory user storage (replace with database in production)
export class User {
  constructor(id, username, socketId) {
    this.id = id;
    this.username = username;
    this.socketId = socketId;
    this.rooms = new Set(['general']); // Default room
    this.isOnline = true;
    this.lastSeen = new Date();
    this.typingInRoom = null;
  }

  joinRoom(room) {
    this.rooms.add(room);
  }

  leaveRoom(room) {
    this.rooms.delete(room);
  }

  setTyping(room) {
    this.typingInRoom = room;
  }

  stopTyping() {
    this.typingInRoom = null;
  }
}

// User management class
export class UserManager {
  constructor() {
    this.users = new Map();
    this.onlineUsers = new Map();
  }

  addUser(userId, username, socketId) {
    const user = new User(userId, username, socketId);
    this.users.set(userId, user);
    this.onlineUsers.set(userId, user);
    return user;
  }

  removeUser(userId) {
    const user = this.users.get(userId);
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date();
      this.onlineUsers.delete(userId);
    }
    return user;
  }

  getUser(userId) {
    return this.users.get(userId);
  }

  getUserBySocketId(socketId) {
    return Array.from(this.users.values()).find(user => user.socketId === socketId);
  }

  getOnlineUsers() {
    return Array.from(this.onlineUsers.values());
  }

  getUsersInRoom(room) {
    return this.getOnlineUsers().filter(user => user.rooms.has(room));
  }
}