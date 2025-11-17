// Socket.io server configuration
export const socketConfig = {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true
  }
};

// Room configuration
export const roomConfig = {
  maxUsersPerRoom: 50,
  messageHistoryLimit: 100,
  defaultRooms: ['general', 'random', 'help']
};

// Application constants
export const events = {
  // Connection events
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  
  // User events
  USER_JOIN: 'user_join',
  USER_LEAVE: 'user_leave',
  USER_TYPING: 'user_typing',
  USER_STOP_TYPING: 'user_stop_typing',
  
  // Message events
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  MESSAGE_DELIVERED: 'message_delivered',
  
  // Room events
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  ROOM_USERS: 'room_users',
  
  // Status events
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline'
};